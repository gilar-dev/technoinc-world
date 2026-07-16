import { ResObject, Schema } from "./typesUtils";

// Get article category based on its id
export function getCategoryById(id: string, plural: boolean=false): string {
    const splitedID: string[] = id.split("-");
    const getID: string = splitedID[splitedID.length - 1];
    const categories: Record<string, any> = {
        civ:   !plural ? "Civilization" : "Civilizations",
        char:  !plural ? "Character"    : "Characters",
        org:   !plural ? "Organization" : "Organizations",
        ide:   !plural ? "Ideology"     : "Ideologies",
        party: !plural ? "Party"        : "Parties",
        town:  !plural ? "Town"         : "Towns",
        lore:  !plural ? "Lore"         : "Lores"
    }
    return categories[getID] ? categories[getID] : "";
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