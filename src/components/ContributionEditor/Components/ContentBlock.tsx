import BlockControls from "./BlockControls";
import "../../../css/DynamicPage.css";
import { ReactElement } from "react";
import { ResObject, SetState } from "../../../utils/typesUtils";

interface propTypes {
    index: number;
    block: Record<string, any>;
    schema: any[];
    setSchema: React.Dispatch<React.SetStateAction<any[]>>;
    setToDelete?: React.Dispatch<React.SetStateAction<any[]>>;
    onChangeHandler: (index: number, key: string, target: any, func: SetState<ResObject[]>) => void;
}

function ContentBlock({ index, block, schema, setSchema, onChangeHandler, setToDelete }: propTypes): ReactElement {
    
    switch (block.type) {

        // Heading type content
        case "heading-type":
            return (
                <div className="content-box">
                    <textarea
                        placeholder="Table title"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target.value, setSchema)}
                        className="w-full field-sizing-content resize-none font-['Montserrat'] font-bold text-[20px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        // Table type content
        case "table-type":
            return (
                <div className="content-box">
                    <div className="flex border-black [&>textarea]:w-43">
                        <textarea
                            placeholder="Table head"
                            value={block.head_data}
                            onChange={(e) => onChangeHandler(index, "head_data", e.target.value, setSchema)}
                            className="p-1 field-sizing-content resize-none font-['Montserrat'] font-bold" />
                        <textarea
                            placeholder="Table data"
                            value={block.content_data}
                            onChange={(e) => onChangeHandler(index, "content_data", e.target.value, setSchema)}
                            className="p-1 field-sizing-content resize-none font-['Montserrat']" />
                    </div>
                    <BlockControls currentIndex={index} addButton={true} schema={schema} setSchema={setSchema} />
                </div>  
            );

        // Paragraph type content
        case "paragraph-type":
            return (
                <div className="content-box">
                    <textarea
                        placeholder="Paragraph title"
                        value={block.title}
                        onChange={(e) => onChangeHandler(index, "title", e.target.value, setSchema)}
                        className="w-full p-1 field-sizing-content resize-none font-['Montserrat'] text-[1.3em] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                    <textarea
                        placeholder="Paragraph content"
                        value={block.data}
                        onChange={(e) => onChangeHandler(index, "data", e.target.value, setSchema)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none bg-transparent" />
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} />
                </div>
            );

        // Image type content
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
                        accept="image/jpeg, image/png, image/webp, .jpg, .jpeg, .png, .webp"
                        style={{display: "none"}}
                        onChange={e => {
                            const selectedFile: File | undefined = e.target.files?.[0];
                            if (!selectedFile) return;

                            // Set the image path to accessable on browser
                            const urlPath: string = URL.createObjectURL(selectedFile);

                            // If true, current block has a value already
                            if (block?.prev_url === "") onChangeHandler(index, "prev_url", block.url, setSchema);

                            onChangeHandler(index, "url", urlPath, setSchema);
                            onChangeHandler(index, "raw_file", selectedFile, setSchema);

                            if (block?.prev_url !== undefined) {
                                setToDelete?.((prev: string[]) => [...prev, block.public_id]);
                            }
                        }} />
                    <label
                        htmlFor={`image-input-${index}`}
                        className="p-2 font-bold rounded-2xl border hover:bg-gray-500/70 active:bg-white transition-colors duration-150 ease-in-out">
                            Choose image
                    </label>
                    <button
                        title="Restore previous"
                        onClick={() => {
                            // Restore the default image if it's changed
                            onChangeHandler(index, "url", block?.prev_url, setSchema);
                            onChangeHandler(index, "prev_url", "", setSchema);
                            setToDelete?.((prev: string[]) => [...prev].toSpliced([...prev].indexOf(block.public_id), 1));
                        }}
                        className={`${block?.prev_url !== undefined && block?.prev_url !== "" ? "block" : "hidden"}
                                    my-3 p-3 rounded-full border-none bg-transparent transition-colors duration-150 ease-in-out
                                    hover:bg-gray-500/30`}>
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                    <textarea
                        placeholder="Add image description"
                        value={block.description}
                        onChange={(e) => onChangeHandler(index, "description", e.target.value, setSchema)}
                        className="w-full min-h-25 p-1 field-sizing-content font-['Montserrat'] resize-none outline-none border-none" /> 
                    <BlockControls currentIndex={index} schema={schema} setSchema={setSchema} editMode={true} setToDelete={setToDelete} />
                </div>
            );

        default:
            return (<></>);
    }
}

export default ContentBlock;