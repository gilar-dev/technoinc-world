import { Schema, ResObject, ArticleConfig, SetState } from "./typesUtils";

// Strerilized word from user input to prevent XSS
export function sterilizedWord(word: string): string {
    if (!word) return ""; // Return empty string if word doesn't match
    // Get word from param, then replace specific chars
    const replaced: string = word.toLowerCase().trim()
        .replace(/&/g, "&amp") // Replace '&' char
        .replace(/</g, "&lt") // Replace '<' char
        .replace(/>/g, "&gt") // Replace '>' char
        .replace(/"/g, "&quot") // Replace '"' char
        .replace(/'/g, "&#x27") // Replace ''' char
        .replace(/\//g, "&#x2f") // Replace '/' char
    // Return sterilized word
    return replaced.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

// Generate new article id
export function generateId(title: string, category: string): string {
    const modifiedTitle: string = title // Get title and modify it
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        .toLowerCase();
    // Usable id names based on category
    const idNames: ResObject = {
        Civilization: "civ",
        Character   : "char",
        Ideology    : "ide",
        Organization: "org",
        Party       : "party",
        Town        : "town",
        Lore        : "lore" 
    };
    // Return modified title combined with id names with category key
    return modifiedTitle + "-" + idNames[category];
}

// Get article category based on its id
export function getCategoryById(id: string, plural: boolean=false): string {
    if (id === "") return ""; // Return empty string if id is empty
    const splitedId: string[] = id.split("-"); // Split id value by using separator '-'
    const getId: string = splitedId[splitedId.length - 1]; // Get the last index of splitedId (id)
    // Object of existed categories (singular & plural)
    const categories: ResObject = {
        civ  : !plural ? "Civilization" : "Civilizations", // Id = civ
        char : !plural ? "Character"    : "Characters", // Id = char
        org  : !plural ? "Organization" : "Organizations", // Id = org
        ide  : !plural ? "Ideology"     : "Ideologies", // Id = ide
        party: !plural ? "Party"        : "Parties", // Id = party
        town : !plural ? "Town"         : "Towns", // Id = town
        lore : !plural ? "Lore"         : "Lores" // Id = lore
    }
    // Return matched id from categories key ("" if not exist)
    return categories[getId] ? categories[getId] : "";
}

// Handle input changes on content schema
export function handleInputChange(index: number, property: string, value: any, setSchema: SetState<ResObject[]>): void {
    setSchema((prev: ResObject[]) => {
        const updatedSchema: ResObject[] = [...prev]; // Store schema by cloning it
        updatedSchema[index][property] = value; // Set property needs to be updated
        return updatedSchema; // Return the updated schema
    });
}

// Check article general values
export function checkArticleValues(article: ArticleConfig): string {
    if (article.title === "") return "Title is empty"; // Return if title is empty
    if (article.cover === "") return "Cover is empty"; // Return if cover is empty
    // // Return true if all values passed the checks
    return "Passed";
}

// Check schema content values
export function checkContentValues(schema: Schema): string {
    if (schema.length === 0) return "Schema contents can't be empty"; // Check if schema length is empty (0)
    for (let index: number = 0; index < schema.length; index++) {
        // Define content inside schema
        const content: ResObject = schema[index];
        switch (content.type) {
            case "heading-type": // Heading type content check
                if (content.data === "") return "this can't be empty";
                break;
            case "table-type": // Table type content check
                if (content.head_data === "" || content.content_data === "") return "this can't be empty";
                break;
            case "paragraph-type": // Paragraph type content check
                if (content.title === "" || content.data === "") return "this can't be empty";
                break;
            case "image-type": // Image type content check
                if (content.url === "" || content.description === "") return "this can't be empty";
                break;
            default:
                return "none";
        }
    }
    // Return true if all values are not empty
    return "Passed";
}

// Delete unecessary properties from image type content
export function filtration(schema: Schema): Schema {
    for (let index: number = 0; index < schema.length; index++) {
        delete schema[index]["raw_file"];
        delete schema[index]["prev_url"];
    }
    // Return filtrated schema
    return schema;
}