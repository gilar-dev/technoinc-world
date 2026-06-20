import PropTypes from "prop-types";
import { useState } from "react";
import "../css/DynamicPage.css";

function BlockContent({ index, block, buttons, cloudStorage, onChangeHandler }) {

    const [restore, setRestore] = useState(block.restore);

    switch (block.type) {
        case "heading-type":
            return (
                <div className="content-box">
                    <input
                        type="text"
                        placeholder="Table title"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target.value)}
                        className="w-full font-bold text-[20px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    {buttons(index)}
                </div>
            );
            break;

        case "table-type":
            return (
                <div className="content-box">
                    <div className="flex border-black [&>input]:text-[15px] [&>input]:p-1 [&>input]:outline-none [&>input]:bg-transparent">
                        <input
                            type="text"
                            placeholder="Table head"
                            value={block.headData}
                            onChange={(e) => onChangeHandler(index, "headData", e.target.value)}
                            className="font-bold w-[45%]" />
                        <input
                            type="text"
                            placeholder="Table data"
                            value={block.contentData}
                            onChange={(e) => onChangeHandler(index, "contentData", e.target.value)}
                            className="w-[45%]" />
                    </div>
                    {buttons(index)}
                </div>  
            );
            break;

        case "paragraph-type":
            return (
                <div className="content-box">
                    <input
                        type="text"
                        placeholder="Paragraph title"
                        value={block.title}
                        onChange={(e) => onChangeHandler(index, "title", e.target.value)}
                        className="w-full p-1 text-[1.3em] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <textarea
                        placeholder="Paragraph content"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target.value)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none bg-transparent" />
                    {buttons(index)}
                </div>
            );
            break;

        case "image-type":
            return (
                <div className="content-box">
                    <img
                        src={block.url || null}
                        className="w-full rounded-[5px]" />
                    <input
                        id={`image-input-${index}`}
                        type="file"
                        accept="image/*"
                        style={{display: "none"}}
                        onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const urlPath = URL.createObjectURL(selectedFile);

                            if (!selectedFile) return;

                            onChangeHandler(index, "url", urlPath);
                            onChangeHandler(index, "rawFile", selectedFile);
                        }} />
                    <label
                        htmlFor={`image-input-${index}`}
                        className="p-2 font-bold rounded-2xl bg-green-500 hover:bg-green-600 active:text-green-500 active:bg-white">
                            Choose image
                    </label>
                    <input
                        type="text"
                        placeholder="Add title"
                        value={block.title}
                        onChange={(e) => onChangeHandler(index, "title", e.target.value)}
                        className="w-full text-2xl outline-none border-l-0 border-t-0 border-r-0 border-gray-400 bg-transparent" />
                    <textarea
                        type="text"
                        placeholder="Add image description"
                        value={block.description}
                        onChange={(e) => onChangeHandler(index, "description", e.target.value)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none" /> 
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
    buttons: PropTypes.func.isRequired,
    cloudStorage: PropTypes.func.isRequired,
    onChangeHandler: PropTypes.func.isRequired
}

export default BlockContent;