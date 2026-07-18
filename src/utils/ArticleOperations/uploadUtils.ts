import { Schema, ResObject, ArticleConfig, SetState } from "../typesUtils";
import { checkArticleValues, checkContentValues, filtration } from "../articleUtils";
import { uploadPackage, uploadToCloud } from "../storageUtils";
import { checkArticleId, uploadArticleWiki } from "../databaseUtils";

// States used to set state variable from component
interface UploadStates {
    setArticle: SetState<ArticleConfig>;
    setSchema: SetState<ResObject[]>;
}

// Main export function to validate all things before uploading
export default async function uploadArticleInit(article: ArticleConfig, schema: Schema, uploadStates: UploadStates): Promise<any> {

    const cloneSchema: Schema = structuredClone(schema); // Store schema by cloning it

    const checkValues: string = checkArticleValues(article); // Check article general values
    if (checkValues !== "Passed") return checkValues;
    
    const checkId: any = await checkArticleId(article.id, article.category.toLowerCase()); // Check if article id existence
    if (checkId.is_exist) return "Article id is already exist!";

    const checkContents: string = checkContentValues(cloneSchema); // Check content values
    if (checkContents !== "Passed") return checkContents;

    const coverAssets = await uploadCoverAssets(article);
    const containImages: ResObject[] = cloneSchema.filter((img: ResObject) => img.type === "image-type"); // Check image types in schema
    let modifiedSchema: any; // Modify schema by uploading asset contents to get its official cloud url
    if (containImages.length !== 0) {
        modifiedSchema = await getImagesToUpload(article.category, cloneSchema)
        if (!modifiedSchema) return "Failed when uploading assets to cloud";
    }

    const uploadArticle: ResObject = await uploadArticleWiki({
        ...article,
        cover: coverAssets.secure_url,
        public_id: coverAssets.public_id,
        wiki_content: modifiedSchema
    })
    if (!uploadArticle) return "Failed to upload article";

    return "Success";
}

// Helper functions
// Upload cover assets to cloud storage
async function uploadCoverAssets(article: ArticleConfig): Promise<any> {
    const dataPackage: FormData = uploadPackage(article.raw_cover as File, {
        folder: "Cover",
        uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET
    });
    const upload: ResObject = await uploadToCloud(dataPackage);
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