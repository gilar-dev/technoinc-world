import TextParser from "./TextParser";
import { ResObject, SetState } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { useContext } from "react";

interface PropTypes {
    block: ResObject;
}

interface ContextTypes {
    setShowed: SetState<string>;
    setImageGallery: SetState<boolean>;
}

function WikiRenderer({ block }: PropTypes): React.JSX.Element {

    const { setShowed, setImageGallery } = useContext<ContextTypes>(Config);

    switch (block.type) {

        // General content block types
        case "gen-heading-type":
            return (
                <h1 className="font-['Noto_Serif'] font-medium text-[22px]">
                    {block.heading}
                </h1>
            );

        case "gen-subheading-type":
            return (
                <h2 className="mb-2 font-['Inter'] font-medium text-[19px]">
                    {block.subheading}
                </h2>
            );

        case "gen-paragraph-type":
            return (
                <p className="mb-3 font-['Inter'] font-normal text-[15px] leading-relaxed whitespace-pre-wrap">
                    <TextParser content={block.text} />
                </p>
            );

        case "gen-image-type":
            return (
                <div className="p-3 whitespace-pre-wrap flex justify-center items-center">
                    <div className="w-min p-1 flex flex-col items-center gap-1">
                        <div className="overflow-hidden cursor-pointer relative">
                            <img
                                src={block.src || null}
                                alt={block.description}
                                onClick={() => {
                                    setShowed(block.src);
                                    setImageGallery(true);
                                }}
                                className="max-w-[90vw] max-h-[22em] transition-transform ease-in-out duration-500 hover:scale-[110%]" />
                            <span className="p-1.25 text-[10px] absolute bottom-2 right-2 self-end rounded-full text-white bg-black/50">
                                <i className="fa-regular fa-clone"></i>
                            </span>
                        </div>
                        <TextParser content={block.description} style="font-[400] text-[.75em] tracking-wide" />
                    </div>
                </div>
            );

        // Infobox content block types
        case "ib-heading-type":
            return (
                <div className="font-['Inter'] font-medium text-[.9em] text-center whitespace-pre-wrap">
                    <TextParser content={block.heading} />
                </div>
            );

        case "ib-subheading-type":
            return (
                <div className="mt-5 p-3 border-t border-[rgb(85,85,85)]">
                    <h4 className="text-center">
                        <span className="highlight">{block.subheading}</span>
                    </h4>
                </div>
            );

        case "ib-info-type":
            return (
                <div className="py-1 font-['Inter'] flex justify-between gap-3">
                    <div className="w-full">
                        <h5>
                            <TextParser content={block.head} />
                        </h5>
                    </div>
                    <div className="w-full">
                        <div className="font-['Inter'] text-[.9em] leading-relaxed whitespace-pre-wrap">
                            <TextParser content={block.data} />
                        </div>
                    </div>
                </div>
            );

        case "ib-image-type":
            return (
                <div className="whitespace-pre-wrap flex justify-center items-center">
                    <div className="w-min p-1 flex flex-col items-center gap-1">
                        <div className="overflow-hidden cursor-pointer relative">
                            <img
                                src={block.src || null}
                                alt={block.description}
                                onClick={() => {
                                    setShowed(block.src);
                                    setImageGallery(true);
                                }}
                                className="max-w-[80vw] max-h-[22em] transition-transform ease-in-out duration-500 hover:scale-[110%]" />
                            <span className="p-1.25 text-[10px] absolute bottom-2 right-2 self-end rounded-full text-white bg-black/50">
                                <i className="fa-regular fa-clone"></i>
                            </span>
                        </div>
                        <TextParser content={block.description} style="font-[400] text-[.75em] tracking-wide" />
                    </div>
                </div>
            );

        default:
            return (<></>);
    }
}

export default WikiRenderer;