import TextParser from "./TextParser";
import { ResObject } from "../../../utils/typesUtils";

interface PropTypes {
    block: ResObject
}

function ContentRenderer({ block }: PropTypes): React.JSX.Element {

    switch (block.type) {

        // General content block types
        case "gen-heading-type":
            return (
                <h2 className="font-['Montserrat'] font-semibold">
                    {block.heading}
                </h2>
            );

        case "gen-subheading-type":
            return (
                <h3 className="font-['Montserrat'] font-semibold">
                    {block.subheading}
                </h3>
            );

        case "gen-paragraph-type":
            return (
                <p className="font-['Montserrat'] text-[.9em] leading-relaxed whitespace-pre-wrap">
                    <TextParser content={block.text} />
                </p>
            );

        // Infobox content block types
        case "ib-heading-type":
            return (
                <div className="font-['Montserrat'] font-medium text-[.9em] text-center whitespace-pre-wrap">
                    <TextParser content={block.heading} />
                </div>
            );
        
        case "ib-subheading-type":
            return (
                <div className="mt-5 border-t border-[rgb(85,85,85)]">
                    <h4 className="text-center">
                        <span className="highlight">{block.subheading}</span>
                    </h4>
                </div>
            );

        default:
            return (<></>);
    }
}

export default ContentRenderer;