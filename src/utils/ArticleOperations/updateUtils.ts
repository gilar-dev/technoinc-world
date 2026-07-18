import { Schema, PublicID, ResObject } from "../typesUtils";
import { checkContentValues, filtration } from "../articleUtils";
import { uploadPackage, uploadToCloud, deleteAssets } from "../storageUtils";
import { updateArticleWiki } from "../databaseUtils";

// Add essential configurations
interface Config {
    schema: Schema;
    pendingDelete: PublicID;
}

// Main export function to validate all things before updating
export default async function updateArticleInit(id: string, category: string, config: Config): Promise<any> {

    const cloneSchema: Schema = structuredClone<Schema>(config.schema); // Store schema by cloning it

    // Check delete image assets
    if (config.pendingDelete.length !== 0) {
        if (!await deleteAssets(config.pendingDelete)) return;
    }

    const modifiedSchema: Schema | undefined = await getImagesToUpload(category, cloneSchema); // Bulk delete and upload new assets
    // Check if schema is successfully modified
    if (!modifiedSchema) return;
    // Check if all content values are not empty
    if (!checkContentValues(modifiedSchema)) return;
    // Wait for the update article to database result
    if (!await updateArticleWiki(id, category, filtration(modifiedSchema))) return;

    return true;
}

// Helper functions
// Get changed images to upload to cloud storage
async function getImagesToUpload(category: string, schema: Schema): Promise<any> {
    const images: ResObject[] = schema.filter((img: ResObject) => img.type === "image-type");
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