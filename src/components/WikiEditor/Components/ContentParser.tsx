import { Schema, ResObject, SetState } from "../../../utils/typesUtils";
import { ReactElement } from "react";
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

    const prevBlock: ResObject = content[index - 1];
    const nextBlock: ResObject = content[index + 1];

    const sameCheck = (block: Record<string, any>, type: string): boolean => {
        return block?.type === type ? true : false;
    }

    const differCheck = (block: Record<string, any>, type: string): boolean => {
        if (!block) return true;
        return block?.type !== type ? true : false;
    }

    switch(block.type) {
        
        case "heading-type":
            return (
                <div className={`box mx-3 py-3 flex flex-col items-center justify-center gap-2 border-l border-r
                                ${index !== 0 && "border-t border-t-[rgb(85,85,85)]"}`}>
                    <div
                        className={`w-[80%]
                                    ${sameCheck(prevBlock, "table-type") && "border-t border-t-[rgb(85,85,85)]"}`} />
                    <h3 className="text-center">
                        <span className="highlight">{block.data}</span>
                    </h3>
                </div>
            );

        case "table-type":
            return (
                <div className={`box mx-3 flex p-3 border-l border-r
                                ${differCheck(nextBlock, "table-type") && "border-b border-b-[rgb(85,85,85)]"}`}>
                    <h4 className="w-full uppercase text-[.8em]">{block.head_data}</h4>
                    <p className="w-full font-normal text-[.9em]">{block.content_data}</p>
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
                            className="mx-3 my-10">
                            <h3 className="font-medium">{block.title}</h3>
                            <p className="mt-3 font-normal leading-7 text-[.9em]">{block.data}</p>
                        </div>
                    );
                }
            }
            return (<></>);

        case "image-type":
            return (
                <div
                    onClick={() => {
                        setShowed(block.url);
                        setImageContainer(true);
                    }}
                    className="p-3 flex flex-col items-center justify-center gap-1">
                    <div className="w-full overflow-hidden flex flex-col items-center cursor-pointer relative">
                        <img
                            src={block.url || null}
                            alt={block.description}  
                            className="max-w-[90%] max-h-100 transition-transform ease-in-out duration-500 hover:scale-[110%]" />
                        <span className="p-1.25 text-[10px] absolute bottom-2 right-2 self-end rounded-full text-white bg-black/50">
                            <i className="fa-regular fa-clone"></i>
                        </span>
                    </div>
                    <p className="text-[.7em]">{block.description}</p>
                </div>
            );

        default:
            return (<></>)

    }
}

export default ContentParser;