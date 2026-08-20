import { ArticleConfig, Schema, ResObject } from "../typesUtils";
import { processMessage } from "../processUtils";
import { deleteAssets } from "../storageUtils";
import { getArticleWiki, deleteArticleWiki } from "../databaseUtils";

// Main export function to delete article wiki from database
/**
 * @description A function to delete existed article from database
 * @param articleID Article id
 * @returns Returns ResObject which contains only two keys { passed: boolean, message: string }
 */
export default async function deleleArticleInit(articleTitle: string): Promise<ResObject> {

    const getArticle: ResObject = await getArticleWiki(articleTitle); // Get article wiki from database
    const wikiContent: Schema = getArticle.article.wiki_content; // Set only article wiki content schema
    const getImages: Schema = wikiContent.filter((img: ResObject) => img.type.includes("image")); // Filter image type contents

    // If length is not 0, delete its assets first
    if (getImages.length !== 0) {
        if (! await deleteAssets(`Article_${getArticle.article.id}`, getImages.map((pid: ResObject) => pid.public_id), false)) return processMessage(false, "Failed to delete assets");
    }
    // Delete article cover image by using its public id
    if (! await deleteAssets(`Article_${getArticle.article.id}`, [getArticle.article.public_id], true)) return processMessage(false, "Failed to delete article cover assets");
    // Lastly, delete article wiki from database
    if (! await deleteArticleWiki(getArticle.article.id)) return processMessage(false, "Failed to delete article wiki");

    // If all checks success, return success
    return processMessage(true, "Successfully delete article!");
}