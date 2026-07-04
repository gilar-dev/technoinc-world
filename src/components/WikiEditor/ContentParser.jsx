import PropTypes from "prop-types";
import { useEffect } from "react";
import "../../css/DynamicPage.css";

function ContentParser({ index, content, block, setImageContainer, setShowed, menuContent=[] }) {

    const prevBlock = content[index - 1];
    const nextBlock = content[index + 1];

    const sameCheck = (block, type) => {
        return block?.type === type ? true : false;
    }

    const differCheck = (block, type) => {
        if (!block) return true;
        return block?.type !== type ? true : false;
    }

    switch(block.type) {
        case "heading-type":
            return (
                <div
                    style={{borderTop: index !== 0 && "1px solid rgb(85,85,85)"}}
                    className="box mx-3 py-3 flex flex-col items-center justify-center gap-2 border-l border-r">
                    <div
                        style={{borderTop: sameCheck(prevBlock, "table-type") && "1px solid rgb(85,85,85)"}}
                        className="w-[80%]" />
                    <h3 className="text-center">
                        <span className="highlight">{block.data}</span>
                    </h3>
                </div>
            );
            break;

        case "table-type":
            return (
                <div
                    style={{
                        borderBottom: differCheck(nextBlock, "table-type") && "1px solid rgb(85,85,85)"
                    }}
                    className={"box mx-3 flex p-3 border-l border-r"}>
                    <h4 className="w-full uppercase text-[.8em]">{block.head_data}</h4>
                    <p className="w-full font-normal text-[.9em]">{block.content_data}</p>
                </div>
            );
            break;

        case "paragraph-type":
            if (menuContent.length === 0) return (
                <div className="mx-3 my-10">
                    <h3 className="font-medium">{block.title}</h3>
                    <p className="mt-3 font-normal leading-7 text-[.9em]">{block.data}</p>
                </div>
            );
            
            for (let i = 0; i < menuContent.length; i++) {
                if (block === menuContent[i]) {
                    return (
                        <div
                            id={`content${i + 1}`}
                            className="mx-3 my-10">
                            <h3 className="font-medium">{block.title}</h3>
                            <p className="mt-3 font-normal leading-7 text-[.9em]">{block.data}</p>
                        </div>
                    );
                }
            }
            break;

        case "image-type":
            return (
                <div
                    onClick={() => {
                        setShowed(block.url);
                        setImageContainer(true);
                    }}
                    className="p-3 flex flex-col items-center justify-center gap-1">
                    <div className="w-full overflow-hidden cursor-pointer relative">
                        <img
                            src={block.url || null}
                            alt={block.description}
                            className="w-full max-h-60 transition-transform ease-in-out duration-500 hover:scale-[110%]" />
                        <span className="p-1.25 text-[10px] absolute bottom-2 right-2 self-end rounded-full text-white bg-black/50">
                            <i className="fa-regular fa-clone"></i>
                        </span>
                    </div>
                    <p className="text-[.7em]">{block.description}</p>
                </div>
            );
            break;

        default:
            return null;
    }
}

ContentParser.propTypes = {
    index: PropTypes.number.isRequired,
    content: PropTypes.array.isRequired,
    block: PropTypes.object.isRequired,
    setImageContainer: PropTypes.func.isRequired,
    setShowed: PropTypes.func.isRequired,
    menuContent: PropTypes.array
}

export default ContentParser;