import { lazy } from "react";
import { ResObject } from "../typesUtils"

// Blue print for validated block configurations
interface BlockConfigs<T> {
    general: {
        HeadingType: () => T;
        SubheadingType: () => T;
        ParagraphType: () => T;
        ImageType: () => T;
    }
    infobox: {
        IbHeadingType: () => T;
        IbSubheadingType: () => T;
        IbInfoType: () => T;
        IbImageType: () => T;
    }
}

// Set block configurations and data
const Blocks: BlockConfigs<ResObject> = {
    general: {
        HeadingType: () => ({
            type: "gen-heading-type" as const,
            heading: "",
            is_empty: false
        }),
        SubheadingType: () => ({
            type: "gen-subheading-type" as const,
            subheading: "",
            is_empty: false
        }),
        ParagraphType: () => ({
            type: "gen-paragraph-type" as const,
            text: "",
            is_empty: false
        }),
        ImageType: () => ({
            type: "gen-image-type" as const,
            src: "",
            public_id: "",
            raw_file: undefined, // Temporary
            description: "",
            is_empty: false
        })
    },
    infobox: {
        IbHeadingType: () => ({
            type: "ib-heading-type" as const,
            heading: "",
            is_empty: false
        }),
        IbSubheadingType: () => ({
            type: "ib-subheading-type" as const,
            subheading: "",
            is_empty: false
        }),
        IbInfoType: () => ({
            type: "ib-info-type" as const,
            head: "",
            data: "",
            is_empty: false
        }),
        IbImageType: () => ({
            type: "ib-image-type" as const,
            src: "",
            public_id: "",
            raw_file: undefined, // Temporary
            description: "",
            is_empty: false
        })
    }
}

export const GeneralBlocks: ResObject[] = [
    {
        label: "Heading",
        icon: "fa-solid fa-heading",
        block: () => Blocks.general.HeadingType()
    },
    {
        label: "Subheading",
        icon: "fa-solid fa-heading -skew-x-12",
        block: () => Blocks.general.SubheadingType()
    },
    {
        label: "Paragraph",
        icon: "fa-solid fa-paragraph",
        block: () => Blocks.general.ParagraphType()
    },
    {
        label: "Image",
        icon: "fa-solid fa-image",
        block: () => Blocks.general.ImageType()
    }
];

export const InfoboxBlocks: ResObject[] = [
    {
        label: "IB Heading",
        icon: "fa-solid fa-heading border border-[rgb(85,85,85)]",
        block: () => Blocks.infobox.IbHeadingType()
    },
    {
        label: "IB Subheading",
        icon: "fa-solid fa-heading -skew-x-12 border border-[rgb(85,85,85)]",
        block: () => Blocks.infobox.IbSubheadingType()
    },
    {
        label: "IB Info",
        icon: "fa-solid fa-info",
        block: () => Blocks.infobox.IbInfoType()
    },
    {
        label: "IB Image",
        icon: "fa-solid fa-image border border-[rgb(85,85,85)]",
        block: () => Blocks.infobox.IbImageType()
    }
];