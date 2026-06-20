import PropTypes from "prop-types";
import { useState } from "react";
import "../css/DynamicPage.css";

function BlockContent({ index, block, reorder, buttons, onChangeHandler }) {

    const [restore, setRestore] = useState(block.restore);

    switch (block.type) {
        case "heading-type":
            return (
                <div className="content-box m-[1em] pl-1 pb-1 flex flex-col items-center gap-3 border-l-5 border-[rgb(0,175,255)]">
                    <input
                        type="text"
                        placeholder="Table title"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target)}
                        className="w-full font-bold text-[20px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    {buttons(index)}
                </div>
            );
            break;

        case "table-type":
            return (
                <div className="content-box m-[1em] pl-1 pb-1 flex flex-col items-center gap-3 border-l-5 border-[rgb(0,175,255)]">
                    <div className="flex border-black [&>input]:text-[15px] [&>input]:p-1 [&>input]:outline-none [&>input]:bg-transparent">
                        <input
                            type="text"
                            placeholder="Table head"
                            value={block.headData}
                            onChange={(e) => onChangeHandler(index, "headData", e.target)}
                            className="font-bold w-[45%]" />
                        <input
                            type="text"
                            placeholder="Table data"
                            value={block.contentData}
                            onChange={(e) => onChangeHandler(index, "contentData", e.target)}
                            className="w-[45%]" />
                    </div>
                    {buttons(index)}
                </div>  
            );
            break;

        case "paragraph-type":
            return (
                <div className="content-box m-[1em] pl-1 pb-1 flex flex-col items-center gap-3 border-l-5 border-[rgb(0,175,255)]">
                    <input
                        type="text"
                        placeholder="Paragraph title"
                        value={block.title}
                        onChange={(e) => onChangeHandler(index, "title", e.target)}
                        className="w-full p-1 text-[1.3em] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <textarea
                        placeholder="Paragraph content"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target)}
                        className="w-full h-25 p-1 resize-none outline-none border-none" />
                    {buttons(index)}
                </div>
            );
            break;

        default:
            return null;
    }
}

BlockContent.propTypes = {
    index: PropTypes.number.isRequired,
    block: PropTypes.object.isRequired,
    reorder: PropTypes.bool,
    buttons: PropTypes.func.isRequired,
    onChangeHandler: PropTypes.func.isRequired
}

export default BlockContent;