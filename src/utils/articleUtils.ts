import { ResObject, Schema } from "./typesUtils";

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
    const splitedId: string[] = id.split("-"); // Split id value by using separator '-'
    const getId: string = splitedId[splitedId.length - 1]; // Get the last index of splitedId (id)
    // Object of existed categories (singular & plural)
    const categories: Record<string, any> = {
        civ:   !plural ? "Civilization" : "Civilizations", // Id = civ
        char:  !plural ? "Character"    : "Characters", // Id = char
        org:   !plural ? "Organization" : "Organizations", // Id = org
        ide:   !plural ? "Ideology"     : "Ideologies", // Id = ide
        party: !plural ? "Party"        : "Parties", // Id = party
        town:  !plural ? "Town"         : "Towns", // Id = town
        lore:  !plural ? "Lore"         : "Lores" // Id = lore
    }
    // Return matched id from categories key ("" if not exist)
    return categories[getId] ? categories[getId] : "";
}

// Check schema content values
export function checkContentValues(schema: Schema): any {
    for (let index: number = 0; index < schema.length; index++) {
        // Define content inside schema
        const content: ResObject = schema[index];
        switch (content.type) {
            case "heading-type": // Heading type content check
                if (content.data === "") return ;
                break;
            case "table-type": // Table type content check
                if (content.head_data === "" || content.content_data === "") return;
                break;
            case "paragraph-type": // Paragraph type content check
                if (content.title === "" || content.data === "") return;
                break;
            case "image-type": // Image type content check
                if (content.url === "" || content.description === "") return;
                break;
            default:
                return;
        }
    }
    // Return true if all values are not empty
    return true;
}