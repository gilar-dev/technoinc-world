import { API, ArticleConfig, ResObject, Schema } from "./typesUtils";

// Check article existence by using its id
export async function checkArticleId(id: string, category: string): Promise<any> {
    if (id === "" || category === "") return; // If id or category is empty, return
    try {
        // Fetch request to backend for getting article wiki
        const response: Response = await fetch(`${API}/api/v1/wiki/${category}/${id}/exist`);
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Get article wiki from database
export async function getArticleWiki(id: string, category: string): Promise<any> {
    try {
        // Fetch request to backend for getting article wiki
        const response: Response = await fetch(`${API}/api/v1/wiki/${category}/${id}`);
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Upload new article wiki to database
export async function uploadArticleWiki(finalArticle: ArticleConfig): Promise<any> {
    try {
        // Fetch request to backend for uploading new article
        const response: Response = await fetch(`${API}/api/v1/contribution/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalArticle)
        });
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Update article wiki to database
export async function updateArticleWiki(id: string, category: string, schema: Schema): Promise<any> {
    try {
        // Fetch request to backend for updating article
        const response: Response = await fetch(`${API}/api/v1/contribution/update/${category}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, wiki_content: schema })
        });
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Delete article wiki from database
export async function deleteArticleWiki(id: string, category: string): Promise<any> {
    try {
        // Fetch request to backend for deleting article
        const response: Response = await fetch(`${API}/api/v1/wiki/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, category: category })
        });
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        console.log(result);
        return result;

    } catch (error) {
        console.error(error);
    }
}