import { Schema, PublicID, ResObject, ArticleConfig, History, ModifyAction, TimeAndDate } from "../typesUtils";
import { filtration, createDate } from "../articleUtils";
import { checkContentValues } from "../ContentBlocks/contentUtils";
import { processMessage } from "../processUtils";
import { uploadPackage, uploadToCloud, deleteAssets } from "../storageUtils";
import { getArticleWiki, updateArticleWiki } from "../databaseUtils";

// Add essential configurations
interface Configs {
    schema: Schema;
    pendingDelete: PublicID;
    user: string;
    summary: string;
    modify_logs: ModifyAction[];
}

// Main export function to validate all things before updating
/**
 * @description A function to update existed article after being edited to database
 * @param id Article id
 * @param category Article category
 * @param config Additional configurations from main component to monitor which is changed or deleted in schema
 * @returns Returns ResObject which contains only two keys (passed: boolean, message: string)
 */
export default async function updateArticleInit(articleData: ArticleConfig, configs: Configs): Promise<ResObject> {

    const cloneSchema = structuredClone<Schema>(configs.schema); // Store schema by cloning it

    const latestVersion: ResObject = await getArticleWiki(articleData.title.toLowerCase(), "version");
    if (latestVersion.article !== articleData.version) return processMessage(false, "Article just got edited recently with latest version");

    const checkContents: ResObject = checkContentValues(cloneSchema); // Check if all content values are not empty
    if (!checkContents.passed) return processMessage(false, checkContents.message, checkContents.index);
    // Check delete image assets
    if (configs.pendingDelete.length !== 0) {
        const deleteProcess: ResObject = await deleteAssets(`Article_`, configs.pendingDelete, false);
        if (!deleteProcess) return processMessage(false, "Failed to delete previous assets");
    }
    const modifiedSchema: Schema | undefined = await getImagesToUpload(articleData.id, cloneSchema); // Bulk delete and upload new assets
    // Check if schema is successfully modified
    if (!modifiedSchema) return processMessage(false, "Failed to upload assets to cloud");

    // Wait for the update article to database result
    const modifiedHistory: History[] | false = articleData.history.length >= 5 && [...articleData.history.toSpliced(1, 1), createNewHistory(configs)];
    const updateFinalArticle: ArticleConfig = {
        ...articleData,
        history: modifiedHistory ? modifiedHistory : [...articleData.history, createNewHistory(configs)],
        wiki_content: filtration(modifiedSchema)
    }
    const updateArticle: ResObject = await updateArticleWiki(updateFinalArticle);
    if (!updateArticle) return processMessage(false, "Failed to update article");

    // Return successful update article process
    return processMessage(true, "Successfully updated article!");
}

// Helper functions
// Get changed images to upload to cloud storage
async function getImagesToUpload(articleId: number, schema: Schema): Promise<any> {
    const images: Schema = schema.filter((img: ResObject) => img.type.includes("image"));
    // Return schema immediately if no images are changed
    if (schema.filter((img: ResObject) => Object.keys(img).includes("raw_file") && img.raw_file === undefined).length === images.length){
        return schema;
    }
    // Bulk upload assets to cloud storage
    for (let index: number = 0; index < schema.length; index++) {
        if (schema[index].type.includes("image") && schema[index].raw_file !== undefined) {
            // Create form data to upload to cloud storage
            const dataPackage: FormData = uploadPackage(schema[index].raw_file, {
                folder: `Article_${articleId}`,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
            });
            // Start uploading form data to cloud storage
            const upload: ResObject = await uploadToCloud(dataPackage);
            if (!upload) return;
            // Set the content data with cloud storage assets url
            schema[index].src = upload.secure_url;
            schema[index].public_id = upload.public_id;
        }
    }
    return schema;
}

// Create new revision history of article
function createNewHistory(configs: Configs): History {
    return {
        status: "edited",
        user: configs.user,
        summary: configs.summary,
        date: createDate(),
        modify_logs: configs.modify_logs
    }
}