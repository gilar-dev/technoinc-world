import { Schema, ResObject, SetState, MoveDirections } from "../typesUtils";
import { processMessage } from "../processUtils";

// Add new content to array of schema
export function addNewContentBlock(block: ResObject, setSchema: SetState<Schema>): void {
    setSchema((prev: Schema) => [...prev, block]); // Adding block to schema
    scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); // Scroll to bottom of the web with smooth behavior
}

// Add new content block at specific index of schema array
export function addNewContentBlockAtIndex(index: number, block: ResObject, setSchema: SetState<Schema>): void {
    setSchema((prev: Schema) => [...prev].toSpliced(index + 1, 0, block)); // Add new content at specific index
}

// Move content in schema to up/down and reorder
export function moveContentBlock(currentIndex: number, direction: MoveDirections, schema: Schema, setSchema: SetState<Schema>): any {
    if (schema.length <= 1) return; // Return if schema length is only 1
    // Get the targeted index
    let targetIndex: number = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    setSchema((prev: Schema) => {
        // Store current schema and content
        const updatedSchema: Schema = [...prev];
        const currentContent: ResObject = updatedSchema[currentIndex];
        // Check if index out of range
        if (targetIndex < 0) targetIndex = updatedSchema.length - 1;
        else if (targetIndex > updatedSchema.length - 1) targetIndex = 0;
        // Reordering contents by swaping contents
        updatedSchema[currentIndex] = updatedSchema[targetIndex];
        updatedSchema[targetIndex] = currentContent;

        return updatedSchema;
    });
}

// Delete content in array of schema
export function deleteContentBlock(index: number, setSchema: SetState<Schema>): void {
    setSchema((prev: Schema) => ([...prev].toSpliced(index, 1))); // Delete content in specific array index
}

// Check schema content values
export function checkContentValues(schema: Schema): ResObject {
    if (schema.length === 0) return processMessage(false, "Schema contents can't be empty"); // Check if schema length is empty (0)
    for (let index: number = 0; index < schema.length; index++) {
        // Define content inside schema
        const content: ResObject = schema[index];
        switch (content.type) {
            case "heading-type": // Heading type content check
                if (content.data === "") return processMessage(false, "this can't be empty", index);
                break;
            case "table-type": // Table type content check
                if (content.head_data === "" || content.content_data === "") return processMessage(false, "this can't be empty", index);
                break;
            case "paragraph-type": // Paragraph type content check
                if (content.title === "" || content.data === "") return processMessage(false, "this can't be empty", index);
                break;
            case "image-type": // Image type content check
                if (content.url === "" || content.description === "") return processMessage(false, "this can't be empty", index);
                break;
            default:
                return processMessage(false, "none");
        }
    }
    // Return true if all values are not empty
    return processMessage(true, "Passed");
}