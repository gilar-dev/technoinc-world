import ContentRenderer from "./ContentRenderer";
import { PrimaryParser, SecondaryParser } from "./DeepParser";
import { Schema } from "../../../utils/typesUtils";
import { contentGrouper } from "../../../utils/ContentBlocks/parserUtils";
import "../../../css/DynamicPage.css";

interface PropTypes {
    schema: Schema;
}

function WikiParser({ schema }: PropTypes): React.JSX.Element {

    const content: Schema = contentGrouper(schema);

    const expandContent = (event: HTMLDivElement): void => {
        const target = event.nextElementSibling as HTMLDivElement;
        const angle = event.children[1].children[0] as HTMLElement;
        const isExpand: boolean = target.classList.contains("block");
        target.classList.replace(isExpand ? "block" : "hidden", isExpand ? "hidden" : "block");
        angle.classList.replace(isExpand ? "fa-angle-up" : "fa-angle-down", isExpand ? "fa-angle-down" : "fa-angle-up");
    }

    return (
        <main className="p-3">
            {content.map((block: any, index: number) => {
                if (!Array.isArray(block)) return (
                    <ContentRenderer key={index} block={block} />
                );
                else if (block[0].type === "gen-heading-type") return (
                    <PrimaryParser key={index} block={block} expandContent={expandContent} />
                );
                else if (block[0].type.includes("ib")) return (
                    <SecondaryParser key={index} block={block} index={index} />
                );
            })}
        </main>
    );
}

export default WikiParser;