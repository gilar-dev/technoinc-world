import PropTypes from "prop-types";
import BlockControls from "./BlockControls";
import "../../css/DynamicPage.css";

function BlockContent({ index, block, buttons, onChangeHandler }) {
    
    switch (block.type) {
        case "heading-type":
            return (
                <div className="content-box">
                    <textarea
                        placeholder="Table title"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target.value)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] font-bold text-[20px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <BlockControls currentIndex={index} operationalButtons={buttons} />
                </div>
            );
            break;

        case "table-type":
            return (
                <div className="content-box">
                    <div className="flex border-black [&>textarea]:w-43">
                        <textarea
                            placeholder="Table head"
                            value={block.head_data}
                            onChange={(e) => onChangeHandler(index, "head_data", e.target.value)}
                            className="p-1 field-sizing-content resize-none font-['Montserrat'] font-bold" />
                        <textarea
                            placeholder="Table data"
                            value={block.content_data}
                            onChange={(e) => onChangeHandler(index, "content_data", e.target.value)}
                            className="p-1 field-sizing-content resize-none font-['Montserrat']" />
                    </div>
                    <BlockControls currentIndex={index} addButton={true} operationalButtons={buttons} />
                </div>  
            );
            break;

        case "paragraph-type":
            return (
                <div className="content-box">
                    <textarea
                        placeholder="Paragraph title"
                        value={block.title}
                        onChange={(e) => onChangeHandler(index, "title", e.target.value)}
                        className="w-full p-1 field-sizing-content resize-none font-['Montserrat'] text-[1.3em] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <textarea
                        placeholder="Paragraph content"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target.value)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none bg-transparent" />
                    <BlockControls currentIndex={index} operationalButtons={buttons}/>
                </div>
            );
            break;

        case "image-type":
            return (
                <div className="content-box">
                    <img
                        src={block.url || null}
                        alt={block.title}
                        className="w-full rounded-[5px]" />
                    <input
                        id={`image-input-${index}`}
                        type="file"
                        accept="image/*"
                        style={{display: "none"}}
                        onChange={e => {
                            const selectedFile = e.target.files[0];
                            if (!selectedFile) return;

                            const urlPath = URL.createObjectURL(selectedFile);

                            onChangeHandler(index, "url", urlPath);
                            onChangeHandler(index, "raw_file", selectedFile);
                        }} />
                    <label
                        htmlFor={`image-input-${index}`}
                        className="p-2 font-bold rounded-2xl text-white bg-green-500 hover:bg-green-600 active:text-green-500 active:bg-white">
                            Choose image
                    </label>
                    <textarea
                        placeholder="Add title"
                        value={block.title}
                        onChange={(e) => onChangeHandler(index, "title", e.target.value)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] text-2xl outline-none border-l-0 border-t-0 border-r-0 border-gray-400 bg-transparent" />
                    <textarea
                        type="text"
                        placeholder="Add image description"
                        value={block.description}
                        onChange={(e) => onChangeHandler(index, "description", e.target.value)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none" /> 
                    <BlockControls currentIndex={index} operationalButtons={buttons} />
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
    buttons: PropTypes.object.isRequired,
    onChangeHandler: PropTypes.func.isRequired
}

export default BlockContent;