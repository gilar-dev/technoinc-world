import { Schema, ResObject, ArticleConfig, SetState } from "../typesUtils";
import { checkArticleValues, filtration } from "../articleUtils";
import { checkContentValues } from "../ContentBlocks/contentUtils";
import { uploadPackage, uploadToCloud } from "../storageUtils";
import { checkArticleId, uploadArticleWiki } from "../databaseUtils";
import { processMessage } from "../processUtils";

// States used to set state variable from component
interface UploadStates {
    setArticle: SetState<ArticleConfig>;
    setSchema: SetState<Schema>;
}

// Main export function to validate all things before uploading
/**
 * @description Used for validating created article before uploading it
 * @param article Article template used after creating article
 * @param schema Array of content schemas within your article (heading, table, paragraph, etc)
 * @param uploadStates A React immutable set state to set its state variable
 * @returns Returns ResObject which contains only two keys (passed: boolean, message: string)
*/
export default async function uploadArticleInit(article: ArticleConfig, schema: Schema, uploadStates: UploadStates): Promise<ResObject> {

    const cloneSchema: Schema = structuredClone<Schema>(schema); // Store schema by cloning it

    const checkValues: ResObject = checkArticleValues(article); // Check article general values
    if (!checkValues.passed) return processMessage(false, checkValues.message);
    
    const checkId: any = await checkArticleId(article.id, article.category.toLowerCase()); // Check if article id existence
    if (checkId.is_exist) return processMessage(false, "Article id is already exist!");

    const checkContents: ResObject = checkContentValues(cloneSchema); // Check content values
    if (!checkContents.passed) return processMessage(false, checkContents.message, checkContents.index);

    const coverAssets: ResObject = await uploadCoverAssets(article.raw_cover as File);
    const containImages: Schema = cloneSchema.filter((img: ResObject) => img.type === "image-type"); // Check image types in schema
    let modifiedSchema: any; // Modify schema by uploading asset contents to get its official cloud url
    if (containImages.length !== 0) {
        modifiedSchema = await getImagesToUpload(article.category, cloneSchema)
        if (!modifiedSchema) return processMessage(false, "Failed when uploading assets to cloud!");
    } else modifiedSchema = cloneSchema;

    const uploadArticle: ResObject = await uploadArticleWiki({
        ...article,
        cover: coverAssets.secure_url,
        public_id: coverAssets.public_id,
        wiki_content: filtration(modifiedSchema)
    })
    if (!uploadArticle) return processMessage(false, "Failed to upload article!");

    return processMessage(true, "Success!");
}

// Helper functions
// Upload cover assets to cloud storage
async function uploadCoverAssets(rawCover: File): Promise<any> {
    const dataPackage: FormData = uploadPackage(rawCover, {
        folder: "Cover",
        uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
    });
    const upload: ResObject = await uploadToCloud(dataPackage);
    if (!upload) return;
    return upload;
}

// Upload image type content assets to cloud storage
async function getImagesToUpload(category: string, schema: Schema): Promise<any> {
    if (schema.length === 0) return;
    for (let index: number = 0; index < schema.length; index++) {
        if (schema[index].type === "image-type") {
            const dataPackage: FormData = uploadPackage(schema[index].raw_file, {
                folder: category,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
            });
            const upload: ResObject = await uploadToCloud(dataPackage);
            if (!upload) return;
            schema[index].url = upload.secure_url;
            schema[index].public_id = upload.public_id;
        }
    }
    return schema;
}