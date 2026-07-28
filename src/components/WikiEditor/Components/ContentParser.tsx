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

    const prevBlock: ResObject = content[index - 1];
    const nextBlock: ResObject = content[index + 1];

    const sameCheck = (block: ResObject, type: string): boolean => {
        if (!block) return false;
        return block?.type === type ? true : false;
    }

    const differCheck = (block: ResObject, type: string): boolean => {
        if (!block) return true;
        return block?.type !== type ? true : false;
    }

    switch(block.type) {
        
        case "heading-type":
            return (
                <div className={`box mx-3 py-3 flex flex-col items-center justify-center gap-2 border-l border-r
                                ${index !== 0 && differCheck(prevBlock, "table-type") && "border-t"}
                                ${light ? "bg-white/10" : "bg-gray-700/30"}`}>
                    <div
                        className={`w-[90%]
                                    ${sameCheck(prevBlock, "table-type") && "border-t border-t-[rgb(85,85,85)]"}`} />
                    <h3 className="text-center">
                        <span className="highlight">{block.data}</span>
                    </h3>
                </div>
            );

        case "table-type":
            return (
                <div className={`box mx-3 p-3 flex gap-3 border-l border-r
                                ${differCheck(nextBlock, "table-type") && differCheck(nextBlock, "heading-type") && "border-b"}
                                ${light ? "bg-white/10" : "bg-gray-700/30"}`}>
                    <h4 className="w-full uppercase text-[.8em]">{block.head_data}</h4>
                    <TextParser content={block.content_data} style="w-full font-normal text-[.9em]" />
                </div>
            );

        case "paragraph-type":
            if (menuContent.length === 0) return (
                <div className="mx-3 my-10">
                    <h3 className="font-medium">{block.title}</h3>
                    <p className="mt-3 font-normal leading-7 text-[.9em]">{block.data}</p>
                </div>
            );
            
            for (let index: number = 0; index < menuContent.length; index++) {
                if (block === menuContent[index]) {
                    return (
                        <div
                            id={`content${index + 1}`}
                            className="mx-3 my-10 scroll-m-20">
                            <h3 className="font-medium">{block.title}</h3>
                            <TextParser content={block.data} style="mt-3 font-normal leading-relaxed text-[.9em]" />
                        </div>
                    );
                }
            }
            return (<></>);

        case "image-type":
            return (
                <div className="p-3 flex justify-center items-center">
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