import BlockControls from "./BlockControls";
import "../../../css/DynamicPage.css";
import { Schema, PublicID, ResObject, SetState } from "../../../utils/typesUtils";
import { ReactElement } from "react";

interface propTypes {
    index: number;
    block: ResObject;
    schema: Schema;
    setSchema: SetState<Schema>;
    setToDelete?: SetState<PublicID> | undefined;
    onChangeHandler: (index: number, key: string, target: any, func: SetState<Schema>) => void;
}

function ContentBlock({ index, block, schema, setSchema, onChangeHandler, setToDelete }: propTypes): ReactElement {

    const getSelectedFile = (selectedFile: File | undefined): void => {
        if (!selectedFile) return;
        const preview: string = URL.createObjectURL(selectedFile);
        if (block.prev_src === "") onChangeHandler(index, "prev_src", block.src, setSchema);
        if (block.prev_src !== undefined) setToDelete?.((prev: string[]) => [...prev, block.public_id]);
        onChangeHandler(index, "src", preview, setSchema);
        onChangeHandler(index, "raw_file", selectedFile, setSchema);
        onChangeHandler(index, "is_empty", false, setSchema);
    }

    const restorePrevious = (): void => {
        // Restore the default image if it's changed
        onChangeHandler(index, "src", block.prev_src, setSchema);
        onChangeHandler(index, "prev_src", "", setSchema);
        onChangeHandler(index, "raw_file", undefined, setSchema);
        setToDelete?.((prev: string[]) => [...prev].toSpliced([...prev].indexOf(block.public_id), 1));
    }
    
    switch (block.type) {

        // General content block types
        // Heading type
        case "gen-heading-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <textarea
                        placeholder="Add heading"
                        value={block.heading}
                        onChange={(e) => onChangeHandler(index, "heading", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] font-bold text-[20px] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        // Subheading type
        case "gen-subheading-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <textarea
                        placeholder="Add subheading"
                        value={block.subheading}
                        onChange={(e) => onChangeHandler(index, "subheading", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] font-bold text-[15px] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        // Paragraph type
        case "gen-paragraph-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <textarea
                        placeholder="Paragraph content"
                        value={block.text}
                        onChange={(e) => onChangeHandler(index, "text", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        case "gen-image-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <img src={block.src || null} alt={block.description} className="w-full rounded-[5px]" />
                    <input id={`image-input-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => getSelectedFile(e.target.files?.[0])} />
                    <label
                        htmlFor={`image-input-${index}`}
                        className="p-2 font-bold rounded-2xl border hover:bg-gray-500/70 active:bg-white transition-colors duration-150 ease-in-out">
                        Choose image
                    </label>
                    <button title="Restore previous" onClick={() => restorePrevious()}
                        className={`my-3 p-3 rounded-full border-none bg-transparent transition-colors duration-150 ease-in-out hover:bg-gray-500/30
                                    ${block.prev_src !== undefined && block.prev_src !== "" ? "block" : "hidden"}`}>
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                    <textarea
                        placeholder="Add image description"
                        value={block.description}
                        onChange={(e) => onChangeHandler(index, "description", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} /> 
                </div>
            );

        // Infobox content block types
        // Heading type
        case "ib-heading-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <textarea
                        placeholder="Infobox heading"
                        value={block.heading}
                        onChange={(e) => onChangeHandler(index, "heading", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] font-semibold text-[20px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        case "ib-subheading-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <textarea
                        placeholder="Infobox subheading"
                        value={block.subheading}
                        onChange={(e) => onChangeHandler(index, "subheading", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] font-semibold text-[15px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        case "ib-info-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <div className="flex gap-3 border-black [&>textarea]:w-43">
                        <textarea
                            placeholder="Table head"
                            value={block.head}
                            onChange={(e) => onChangeHandler(index, "head", e.target.value, setSchema)}
                            onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                            className="p-1 field-sizing-content resize-none font-['Montserrat'] font-bold" />
                        <textarea
                            placeholder="Table data"
                            value={block.data}
                            onChange={(e) => onChangeHandler(index, "data", e.target.value, setSchema)}
                            onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                            className="p-1 field-sizing-content resize-none font-['Montserrat']" />
                    </div>
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>  
            );

        case "ib-image-type":
            return (
                <div className={`content-box ${block.is_empty && "border! border-red-500/70!"}`}>
                    <img src={block.src || null} alt={block.description} className="w-full rounded-[5px]" />
                    <input id={`image-input-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => getSelectedFile(e.target.files?.[0])} />
                    <label
                        htmlFor={`image-input-${index}`}
                        className="p-2 font-bold rounded-2xl border hover:bg-gray-500/70 active:bg-white transition-colors duration-150 ease-in-out">
                        Choose image
                    </label>
                    <button title="Restore previous" onClick={() => restorePrevious()}
                        className={`my-3 p-3 rounded-full border-none bg-transparent transition-colors duration-150 ease-in-out hover:bg-gray-500/30
                                    ${block.prev_src !== undefined && block.prev_src !== "" ? "block" : "hidden"}`}>
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                    <textarea
                        placeholder="(Optional) Add image description"
                        value={block.description}
                        onChange={(e) => onChangeHandler(index, "description", e.target.value, setSchema)}
                        onFocus={() => onChangeHandler(index, "is_empty", false, setSchema)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none" /> 
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} /> 
                </div>
            );

        default:
            return (<></>);
    }
}

export default ContentBlock;