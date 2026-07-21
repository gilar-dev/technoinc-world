import { ResObject } from "../typesUtils"

// Blue print for validated block configurations
interface BlockConfigs<T> {
    HeadingType: () => T;
    TableType: () => T,
    ParagraphType: () => T,
    ImageType: () => T
}

// Blocks setting
const Blocks: BlockConfigs<ResObject> = {
    // Heading type content
    HeadingType: () => ({
        type: "heading-type" as const,
        data: "",
        is_empty: false
    }),
    // Table type content
    TableType: () => ({
        type: "table-type" as const,
        head_data: "",
        content_data: "",
        is_empty: false
    }),
    // Paragraph type content
    ParagraphType: () => ({
        type: "paragraph-type" as const,
        title: "",
        data: "",
        is_empty: false
    }),
    // Image type content
    ImageType: () => ({
        type: "image-type" as const,
        url: "",
        public_id: "",
        raw_file: undefined,
        description: "",
        is_empty: false
    })
}

// Export main Blocks variable
export default Blocks;