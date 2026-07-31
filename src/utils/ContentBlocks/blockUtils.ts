import { ResObject } from "../typesUtils"

// Blue print for validated block configurations
interface BlockConfigs<T> extends Infobox<T> {
    HeadingType: () => T;
    SubheadingType: () => T;
    TableType: () => T;
    ParagraphType: () => T;
    PlainTextType: () => T;
    ImageType: () => T;
}

interface Infobox<T> {
    IbHeadingType: () => T;
}

// Blocks setting
const Blocks: BlockConfigs<ResObject> = {
    // Heading type content
    HeadingType: () => ({
        type: "heading-type" as const,
        data: "",
        is_empty: false
    }),
    SubheadingType: () => ({
        type: "subheading-type",
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
    // Plain text type content
    PlainTextType: () => ({
        type: "plain-text-type" as const,
        text: "",
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
    }),
    IbHeadingType: () => ({
        type: "ib-heading-type" as const,
        heading: "",
        is_empty: false
    })
}

// Export main Blocks variable
export default Blocks;

export const GeneralBlocks: ResObject[] = [
    {
        label: "Heading",
        icon: "fa-solid fa-heading",
        block: () => Blocks.HeadingType()
    },
    {
        label: "Subheading",
        icon: "fa-solid fa-heading -skew-x-12",
        block: () => Blocks.SubheadingType()
    },
    {
        label: "Paragraph",
        icon: "fa-solid fa-paragraph",
        block: () => Blocks.ParagraphType()
    },
    {
        label: "Text",
        icon: "fa-solid fa-t",
        block: () => Blocks.PlainTextType()
    },
    {
        label: "Image",
        icon: "fa-solid fa-image",
        block: () => Blocks.ImageType()
    }
];