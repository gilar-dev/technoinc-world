import { ReactElement } from "react";
import { addNewContentBlock } from "../../../utils/ContentBlocks/contentUtils";
import Blocks from "../../../utils/ContentBlocks/blockUtils";
import { Schema, SetState } from "../../../utils/typesUtils";

interface PropTypes {
    light: boolean;
    setSchema: SetState<Schema>;
}

function ContentToolbar({ light, setSchema }: PropTypes): ReactElement {

    return (
        <div className={`mt-[3em] mx-[1em] p-[1em] flex gap-[1em] overflow-auto rounded-[10px]
                        sticky bottom-0 shadow-2xs shadow-black
                        [&>button]:p-[.2em] [&>button]:text-3xl [&>button]:rounded-[5px]
                        [&>button]:border [&>button]:cursor-pointer [&>button]:transition-colors [&>button]:duration-150 [&>button]:ease-in-out
                        ${light ? "bg-white/70 [&>button]:border-black [&>button]:text-black [&>button]:bg-white/70 [&>button]:hover:bg-gray-300"
                                : "bg-gray-700/50 [&>button]:border-white [&>button]:text-white [&>button]:bg-gray-700 [&>button]:hover:bg-gray-500"}`}>
            <button
                title="Add new table heading"
                onClick={() => addNewContentBlock(Blocks.HeadingType(), setSchema)}>
                <i className="fa-solid fa-heading"></i>
            </button>
            <button
                title="Add new table content"
                onClick={() => addNewContentBlock(Blocks.TableType(), setSchema)}>
                <i className="fa-solid fa-table-list"></i>
            </button>
            <button
                title="Add new paragraph"
                onClick={() => addNewContentBlock(Blocks.ParagraphType(), setSchema)}>
                <i className="fa-solid fa-paragraph"></i>
            </button>
            <button
                title="Add new image"
                onClick={() => addNewContentBlock(Blocks.ImageType(), setSchema)}>
                <i className="fa-solid fa-image"></i>
            </button>
        </div>
    );
}

export default ContentToolbar;