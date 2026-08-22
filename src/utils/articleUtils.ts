import { Schema, ResObject, ArticleConfig, SetState, TimeAndDate } from "./typesUtils";
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

// Create time and date for article history
export function createDate(): string {
    const date: Date = new Date();
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const dateValue: number = date.getDate();
    const hour: number = date.getHours();
    const minute: number = date.getMinutes();
    const second: number = date.getSeconds();
    return `${year}/${month}/${dateValue}, ${hour}:${minute}:${second}`;
}

export function parseDate(date: string): TimeAndDate {
    const splitedDate: string[] = date.split(", ");
    const getDateData: string[] = splitedDate[0].split("/");
    const getTimeData: string[] = splitedDate[1].split(":");
    return {
        date: [Number(getDateData[0]), Number(getDateData[1]), Number(getDateData[2])],
        time: [Number(getTimeData[0]), Number(getTimeData[1]), Number(getTimeData[2])]
    }
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
    if (article.description === "") return processMessage(false, "Description can't be empty") // Return if description is empty
    if (article.category.length === 0) return processMessage(false, "You should add at least one category");
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
        delete schema[index]["prev_src"];
        delete schema[index]["is_empty"];
    }
    // Return filtrated schema
    return schema;
}

// Check and register user view based on cookie in their browser
export function checkAndRegisterViewWithCookie(articleTitle: string): boolean {
    const cookieName: string = `visited_art_${articleTitle.replaceAll(" ", "_")}`;
    // Check if cookie with article id is exist in the browser
    const cookies: string[] = document.cookie.split("; ");
    const cookieExists: boolean = cookies.some((row: string) => row.startsWith(`${cookieName}=`));
    // If cookie exists, it's not been 2 hours yet and return false
    if (cookieExists) return false;
    // If doesn't exist, it's been 2 hours and a new visit
    const maxAgeSeconds: number = 60 * 120; // (seconds) * (minutes)
    document.cookie = `${cookieName}=true; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
    return true;
}

// Clear styling code in article text
export function clearTextStyling(text: string): string {
    return text
        .replaceAll("*", "") // Replace all '*' symbols
        .replaceAll("_", "") // Replace all '_' symbols
        .replace(/(<link:(.*?)#(.*?)>)/g, "$2"); // Replace link code
}