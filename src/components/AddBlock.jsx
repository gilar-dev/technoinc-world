import "../css/DynamicPage.css";

function addBlock(type) {
    
    const schema = document.createElement("div");

    switch (type) {
        case "paragraph-type":
            const input = document.createElement("input");
            const textArea = document.createElement("textarea");
            schema.append(input, textArea);
            return schema;
            break;

        default:
            return null;
    }
}

export { addBlock };