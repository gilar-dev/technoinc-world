import TextParser from "./TextParser";
import { Schema, ResObject, SetState } from "../../../utils/typesUtils";
import { Theme } from "../../../utils/contextUtils";
import { ReactElement, useContext } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    index: number;
    content: Schema;
    block: ResObject;
    menuContent?: Schema;
    setImageContainer: SetState<boolean>;
    setShowed: SetState<string>;
}

function ContentParser({ index, content, block, menuContent=[], setImageContainer, setShowed }: PropTypes): ReactElement {

    const { light } = useContext(Theme);

    const prevBlock: ResObject | undefined = content[index - 1];
    const nextBlock: ResObject | undefined = content[index + 1];
    const boxTypes: string[] = ["heading-type", "table-type", "plain-text-type"];

    switch(block.type) {
        
        case "heading-type":
            return (
                <div className={`mx-3 py-3 whitespace-pre-wrap flex flex-col items-center justify-center gap-2 border-l border-r border-[rgb(85,85,85)]
                                ${!prevBlock && "border-t" || prevBlock && !boxTypes.some((type: string) => prevBlock.type === type) && "border-t"}
                                ${!nextBlock && "border-b" || nextBlock && !boxTypes.some((type: string) => nextBlock.type === type) && "border-b"}
                                ${light ? "bg-white/10" : "bg-gray-700/30"}`}>
                    <div
                        className={`w-[90%] border-t-[rgb(85,85,85)]
                                    ${prevBlock && boxTypes.some((type: string) => prevBlock.type) && "border-t"}`} />
                    <h3 className="text-center">
                        <span className="highlight">{block.data}</span>
                    </h3>
                </div>
            );

        case "table-type":
            return (
                <div className={`mx-3 p-3 whitespace-pre-wrap flex gap-3 border-l border-r border-[rgb(85,85,85)]
                                ${!prevBlock && "border-t" || prevBlock && !boxTypes.some((type: string) => prevBlock.type === type) && "border-t"}
                                ${!nextBlock && "border-b" || nextBlock && !boxTypes.some((type: string) => nextBlock.type === type) && "border-b"}
                                ${light ? "bg-white/10" : "bg-gray-700/30"}`}>
                    <h4 className="w-full uppercase text-[.8em]">{block.head_data}</h4>
                    <TextParser content={block.content_data} style="w-full font-normal text-[.9em]" />
                </div>
            );

        case "paragraph-type":
            for (let index: number = 0; index < menuContent.length; index++) {
                if (block === menuContent[index]) {
                    return (
                        <div
                            id={`content${index + 1}`}
                            className="mx-3 my-10 whitespace-pre-wrap scroll-m-20">
                            <h2 className="py-1 font-medium border-b">{block.title}</h2>
                            <TextParser content={block.data} style="mt-3 font-normal leading-relaxed text-[.9em]" />
                        </div>
                    );
                }
            }
            return (<></>);

        case "plain-text-type":
            return (
                <div className={`mx-3 whitespace-pre-wrap text-center border-l border-r border-[rgb(85,85,85)]
                                ${!prevBlock && "border-t" || prevBlock && !boxTypes.some((type: string) => prevBlock.type === type) && "border-t"}
                                ${!nextBlock && "border-b" || nextBlock && !boxTypes.some((type: string) => nextBlock.type === type) && "border-b"}
                                ${light ? "bg-white/10" : "bg-gray-700/30"}`}>
                    <TextParser content={block.text} />
                </div>
            );

        case "image-type":
            return (
                <div className="p-3 whitespace-pre-wrap flex justify-center items-center">
                    <div className="w-min p-1 flex flex-col items-center gap-1 border border-[rgb(85,85,85)]">
                        <div className="overflow-hidden cursor-pointer relative">
                            <img
                                src={block.url || null}
                                alt={block.description}  
                                onClick={() => {
                                    setShowed(block.url);
                                    setImageContainer(true);
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

        default:
            return (<></>)

    }
}

export default ContentParser;