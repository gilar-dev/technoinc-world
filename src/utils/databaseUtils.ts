import { API, ResObject, Schema } from "./typesUtils";

// Update article to database
export async function updateArticleWiki(id: string, category: string, schema: Schema): Promise<any> {
    try {
        // Fetch request to backend for deleting article
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