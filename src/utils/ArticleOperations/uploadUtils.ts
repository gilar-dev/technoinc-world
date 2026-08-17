import { Schema, ResObject, ArticleConfig, History, ModifyAction, TimeAndDate } from "../typesUtils";
import { checkArticleValues, getCurrentDate, filtration } from "../articleUtils";
import { checkContentValues } from "../ContentBlocks/contentUtils";
import { uploadPackage, uploadToCloud } from "../storageUtils";
import { uploadArticleWiki, getUniversalId, increaseUniversalId } from "../databaseUtils";
import { processMessage } from "../processUtils";

interface Configs {
    user: string;
    summary: string;
    modify_logs: ModifyAction[];
}

// Main export function to validate all things before uploading
/**
 * @description Used for validating created article before uploading it
 * @param article Article template used after creating article
 * @param schema Array of content schemas within your article (heading, table, paragraph, etc)
 * @param uploadStates A React immutable set state to set its state variable
 * @returns Returns ResObject which contains only two keys (passed: boolean, message: string)
*/
export default async function uploadArticleInit(article: ArticleConfig, schema: Schema, configs: Configs): Promise<ResObject> {

    const cloneSchema: Schema = structuredClone<Schema>(schema); // Store schema by cloning it
    const universalId: ResObject = await getUniversalId(); // Fetch request to get universal id
    const universalIdValue: number = await universalId.universal_id + 1; // Get universal id value and increase it

    const checkValues: ResObject = checkArticleValues(article); // Check article general values
    if (!checkValues.passed) return processMessage(false, checkValues.message);

    const checkContents: ResObject = checkContentValues(cloneSchema); // Check content values
    if (!checkContents.passed) return processMessage(false, checkContents.message, checkContents.index);

    const coverAssets: ResObject = await uploadCoverAssets(article.raw_cover as File, universalIdValue);
    const containImages: boolean = cloneSchema.some((img: ResObject) => img.type.includes("image")); // Check image types in schema
    let modifiedSchema: any; // Modify schema by uploading asset contents to get its official cloud url
    if (containImages) {
        modifiedSchema = await getImagesToUpload(universalIdValue, cloneSchema);
        if (!modifiedSchema) return processMessage(false, "Failed when uploading assets to cloud!");
    } else modifiedSchema = cloneSchema;

    // Create final article data payload
    const uploadFinalArticle: ArticleConfig = await uploadArticleWiki({
        ...article,
        id: universalIdValue,
        cover: coverAssets.secure_url,
        public_id: coverAssets.public_id,
        history: [createNewHistory(configs)],
        wiki_content: filtration(modifiedSchema)
    })

    // Start uploading new article to database
    if (!uploadFinalArticle) return processMessage(false, "Failed to upload article!");
    await increaseUniversalId();

    return processMessage(true, "Successfully created article");
}

// Helper functions
// Upload cover assets to cloud storage
async function uploadCoverAssets(rawCover: File, articleId: number): Promise<any> {
    const dataPackage: FormData = uploadPackage(rawCover, {
        folder: `Article_${articleId}`,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
    });
    const upload: ResObject = await uploadToCloud(dataPackage);
    if (!upload) return;
    return upload;
}

// Upload image type content assets to cloud storage
async function getImagesToUpload(articleId: number, schema: Schema): Promise<any> {
    if (schema.length === 0) return;
    for (let index: number = 0; index < schema.length; index++) {
        if (schema[index].type.includes("image")) {
            const dataPackage: FormData = uploadPackage(schema[index].raw_file, {
                folder: `Article_${articleId}`,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
            });
            const upload: ResObject = await uploadToCloud(dataPackage);
            if (!upload) return;
            schema[index].src = upload.secure_url;
            schema[index].public_id = upload.public_id;
        }
    }
    return schema;
}

// Create current date validation
function createNewHistory(configs: Configs): History {
    const dateNow: TimeAndDate = getCurrentDate();
    return {
        status: "created",
        user: configs.user,
        summary: configs.summary,
        time: [dateNow.hour, dateNow.minute],
        date: [dateNow.date, dateNow.month, dateNow.year],
        modify_logs: configs.modify_logs
    }
}