import { ResObject } from "../typesUtils"

// Blue print for validated block configurations
interface BlockConfigs<T> {
    HeadingType: T;
    TableType: T,
    ParagraphType: T,
    ImageType: T
}

// Blocks setting
const Blocks: BlockConfigs<ResObject> = {
    HeadingType: { // Heading type content
        type: "heading-type" as const,
        data: ""
    },
    TableType: { // Table type content
        type: "table-type" as const,
        head_data: "",
        content_data: ""
    },
    ParagraphType: { // Paragraph type content
        type: "paragraph-type" as const,
        title: "",
        data: ""
    },
    ImageType: { // Image type content
        type: "image-type" as const,
        url: "",
        public_id: "",
        raw_file: undefined,
        description: ""
    }
}

// Export main Blocks variable
export default Blocks;