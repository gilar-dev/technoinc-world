import { Schema, ResObject, ArticleConfig, SetState } from "./typesUtils";
import { processMessage } from "./processUtils";

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
export function handleInputChange(index: number, property: string, value: any, setSchema: SetState<Schema>): void {
    setSchema((prev: Schema) => {
        const updatedSchema: Schema = [...prev]; // Store schema by cloning it
        updatedSchema[index][property] = value; // Set property needs to be updated
        return updatedSchema; // Return the updated schema
    });
}

// Check article general values
export function checkArticleValues(article: ArticleConfig): ResObject {
    if (article.title === "") return processMessage(false, "Title can't be empty"); // Return if title is empty
    if (article.cover === "") return processMessage(false, "Cover can't be empty"); // Return if cover is empty
    // // Return true if all values passed the checks
    return processMessage(true, "Passed");
}

// Delete unecessary properties from image type content
export function filtration(schema: Schema): Schema {
    for (let index: number = 0; index < schema.length; index++) {
        delete schema[index]["raw_cover"];
        delete schema[index]["raw_file"];
        delete schema[index]["prev_url"];
        delete schema[index]["is_empty"];
    }
    // Return filtrated schema
    return schema;
}

// Check and register user view based on cookie in their browser
export function checkAndRegisterViewWithCookie(articleId: string): boolean {
    const cookieName: string = `visited_art_${articleId}`;
    // Check if cookie with article id is exist in the browser
    const cookies: string[] = document.cookie.split("; ");
    const cookieExists: boolean = cookies.some((row: string) => row.startsWith(`${cookieName}=`));
    // If cookie exists, it's not been 2 hours yet and return false
    if (cookieExists) return false;
    // If doesn't exist, it's been 2 hours and a new visit
    const maxAgeSeconds: number = 60 * 30;
    document.cookie = `${cookieName}=true; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
    return true;
}

// Parse unique text code to turn it into unique text styles
export function textParser(text: string): string {
    const parsing: string = text.replace(
        /(?<bold>\*\*(.*?)\*\*)|(?<underline>__(.*?)__)|(?<italic>\*(.*?)\*)/g,
        (fullMatch: string, ...args: any[]) => {
            const groups: ResObject = args[args.length - 1];
            if (groups.bold) return `<strong>${args[1]}</strong>`;
            if (groups.underline) return `<u>${args[3]}</u>`;
            if (groups.italic) return `<em>${args[5]}</em>`;
            return fullMatch;
        }
    )
    return parsing;
}