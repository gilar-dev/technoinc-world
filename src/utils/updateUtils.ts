type Schema = Record<string, any>[];
type PublicID = string[];

export default async function updateArticle(id: string, category: string, schema: Schema): Promise<boolean> {

    // Array of image public ids
    const cloneSchema: Schema = [...schema];
    const images: Schema = getImageTypes(schema);
    const pendingDelImages: PublicID = [];

    // Check changed schema values
    if (images.length > 0) deletedImageTypes(images, pendingDelImages);

    // For testing
    return true;
}

// Helper functions
// Get image type content from schema
function getImageTypes(schema: Schema): Schema {
    return schema.filter(img => img.type === "image-type");
}

// Check if image type content is deleted
function deletedImageTypes(images: Schema, deleteContainer: PublicID): void {
}