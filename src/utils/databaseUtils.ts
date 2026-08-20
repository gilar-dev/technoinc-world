import { API, ArticleConfig, ResObject } from "./typesUtils";

// Check article existence by using its id
export async function checkArticleTitle(articleTitle: string): Promise<any> {
    if (articleTitle === "") return; // If id or category is empty, return
    try {
        // Fetch request to backend for getting article wiki
        const response: Response = await fetch(`${API}/api/v1/wiki/check/${articleTitle}`);
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
export async function getArticleWiki(articleTitle: string, option: string = ""): Promise<any> {
    try {
        // Fetch request to backend for getting article wiki
        const response: Response = await fetch(`${API}/api/v1/wiki/get/${articleTitle}${option !== "" ? `?option=${option}` : ""}`);
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Get article by using search input value
export async function searchArticle(input: string): Promise<any> {
    try {
        // Fetch request to backend for searching article
        const response: Response = await fetch(
        `${API}/api/v1/wiki/search/${input}`,
        );
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Get category by using search input value
export async function searchCategory(input: string): Promise<any> {
    try {
        // Fetch request to backend for searching category
        const response: Response = await fetch(
        `${API}/api/v1/wiki/category/search/${input}`,
        );
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successfull fetch response data
        const result: ResObject = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Create new wiki category
export async function createCategory(categoryName: string, categoryParent: string): Promise<any> {
    try {
        // Fetch request to backend for searching category
        const response: Response = await fetch(
        `${API}/api/v1/wiki/category/create`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            category_name: categoryName,
            category_parent: categoryParent,
            }),
        },
        );
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successfull fetch response data
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
        const response: Response = await fetch(`${API}/api/v1/contribution/upload`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalArticle),
            },
        );
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
export async function updateArticleWiki(articleData: ArticleConfig): Promise<any> {
    try {
        // Fetch request to backend for updating article
        const response: Response = await fetch(`${API}/api/v1/contribution/update`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(articleData),
            }
        );
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
export async function deleteArticleWiki(articleId: number): Promise<any> {
    try {
        // Fetch request to backend for deleting article
        const response: Response = await fetch(`${API}/api/v1/wiki/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId }),
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

// Update increase article using its id
export async function increaseArticleVisited(articleId: string): Promise<any> {
    try {
        // Fetch request to backend for increasing article visited value
        const response: Response = await fetch(`${API}/api/v1/wiki/view`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: articleId })
        });

        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful response fetch data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Universal id configs
// Get current univeersal id
export async function getUniversalId(): Promise<any> {
    try {
        // Fetch request to backend for increasing article visited value
        const response: Response = await fetch(`${API}/api/v1/wiki/universal_id/get`);

        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful response fetch data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Increase universal id after used on new article
export async function increaseUniversalId(): Promise<any> {
    try {
        // Fetch request to backend for increasing article visited value
        const response: Response = await fetch(`${API}/api/v1/wiki/universal_id/increase`, { method: "PUT" });

        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful response fetch data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}