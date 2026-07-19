import { Schema, ResObject } from "../typesUtils";
import { processMessage } from "../processUtils";
import { deleteAssets } from "../storageUtils";
import { getArticleWiki, deleteArticleWiki } from "../databaseUtils";

// Main export function to delete article wiki from database
/**
 * @description A function to delete existed article from database
 * @param id Article id
 * @param category Article category
 * @returns Returns ResObject which contains only two keys (passed: boolean, message: string)
 */
export default async function deleleArticleInit(id: string, category: string): Promise<ResObject> {

    const getArticle: ResObject = await getArticleWiki(id, category); // Get article wiki from database
    const wikiContent: Schema = getArticle.article.wiki_content; // Set only article wiki content schema
    const getImages: Schema = wikiContent.filter((img: ResObject) => img.type === "image-type"); // Filter image type contents

    // If length is not 0, delete its assets first
    if (getImages.length !== 0) {
        if (! await deleteAssets(getImages.map((pid: ResObject) => pid.public_id))) return processMessage(false, "Failed to delete assets");
    }
    // Delete article cover image by using its public id
    if (! await deleteAssets([getArticle.article.public_id])) return processMessage(false, "Failed to delete article cover assets");
    // Lastly, delete article wiki from database
    if (! await deleteArticleWiki(id, category)) return processMessage(false, "Failed to delete article wiki");

    // If all checks success, return success
    return processMessage(true, "Successfully delete article!");
}