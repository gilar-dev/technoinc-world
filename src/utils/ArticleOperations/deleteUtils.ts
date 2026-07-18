import { Schema, ResObject } from "../typesUtils";
import { deleteAssets } from "../storageUtils";
import { getArticleWiki, deleteArticleWiki } from "../databaseUtils";

export default async function deleleArticleInit(id: string, category: string): Promise<any> {

    const getArticle: ResObject = await getArticleWiki(id, category);
    const wikiContent: Schema = getArticle.article.wiki_content;
    const getImages: Schema = wikiContent.filter((img: ResObject) => img.type === "image-type");

    if (getImages.length !== 0) {
        if (! await deleteAssets([getArticle.cover, ...getImages.map((pid: ResObject) => pid.public_id)])) return;
    }
    if (! await deleteArticleWiki(id, category)) return;

    return true;
}