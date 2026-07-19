import { Schema, PublicID, ResObject } from "../typesUtils";
import { filtration } from "../articleUtils";
import { checkContentValues } from "../ContentBlocks/contentUtils";
import { processMessage } from "../processUtils";
import { uploadPackage, uploadToCloud, deleteAssets } from "../storageUtils";
import { updateArticleWiki } from "../databaseUtils";

// Add essential configurations
interface Config {
    schema: Schema;
    pendingDelete: PublicID;
}

// Main export function to validate all things before updating
/**
 * @description A function to update existed article after being edited to database
 * @param id Article id
 * @param category Article category
 * @param config Additional configurations from main component to monitor which is changed or deleted in schema
 * @returns Returns ResObject which contains only two keys (passed: boolean, message: string)
 */
export default async function updateArticleInit(id: string, category: string, config: Config): Promise<ResObject> {

    const cloneSchema: Schema = structuredClone<Schema>(config.schema); // Store schema by cloning it
    const checkContents: ResObject = checkContentValues(cloneSchema); // Check if all content values are not empty
    const modifiedSchema: Schema | undefined = await getImagesToUpload(category, cloneSchema); // Bulk delete and upload new assets

    if (!checkContents.passed) return processMessage(false, checkContents.message);
    // Check delete image assets
    if (config.pendingDelete.length !== 0) {
        if (!await deleteAssets(config.pendingDelete)) return processMessage(false, "Failed to delete previous assets");
    }
    // Check if schema is successfully modified
    if (!modifiedSchema) return processMessage(false, "Failed to upload assets to cloud");
    // Wait for the update article to database result
    if (!await updateArticleWiki(id, category, filtration(modifiedSchema))) return processMessage(false, "Failed to update article");

    // Return successful update article process
    return processMessage(true, "Successfully update article!");
}

// Helper functions
// Get changed images to upload to cloud storage
async function getImagesToUpload(category: string, schema: Schema): Promise<any> {
    const images: Schema = schema.filter((img: ResObject) => img.type === "image-type");
    // Return schema immediately if no images are changed
    if (schema.filter((img: ResObject) => img.raw_file === "").length === images.length) return schema;
    // Bulk upload assets to cloud storage
    for (let index: number = 0; index < schema.length; index++) {
        if (schema[index].type === "image-type" && schema[index].raw_file !== "") {
            // Create form data to upload to cloud storage
            const dataPackage: FormData = uploadPackage(schema[index].raw_file, {
                folder: category,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
            });
            // Start uploading form data to cloud storage
            const upload: ResObject = await uploadToCloud(dataPackage);
            if (!upload) return;
            // Set the content data with cloud storage assets url
            schema[index].url = upload.secure_url;
            schema[index].public_id = upload.public_id;
        }
    }
    return schema;
}