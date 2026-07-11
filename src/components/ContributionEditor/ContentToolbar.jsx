import { useState } from "react";
import { addNewContent } from "./ContributionUtils";
import PropTypes from "prop-types";

function ContentToolbar({ setSchema, light }) {

    return (
        <div className={`mt-[3em] mx-[1em] p-[1em] flex gap-[1em] overflow-auto rounded-[10px]
                        ${light ? "bg-white/70 [&>button]:border-black [&>button]:text-black [&>button]:bg-white/70 [&>button]:hover:bg-gray-300"
                                : "bg-gray-700/50 [&>button]:border-white [&>button]:text-white [&>button]:bg-gray-700 [&>button]:hover:bg-gray-500"}
                        sticky bottom-0 shadow-2xs shadow-black
                        [&>button]:p-[.2em] [&>button]:text-3xl [&>button]:rounded-[5px]
                        [&>button]:border [&>button]:cursor-pointer [&>button]:transition-colors [&>button]:duration-150 [&>button]:ease-in-out`}>
            
            <button
                title="Add new table heading"
                onClick={() => addNewContent({
                    type: "heading-type",
                    data: ""
                }, setSchema)}>
                <i className="fa-solid fa-heading"></i>
            </button>

            <button
                title="Add new table content"
                onClick={() => addNewContent({
                    type: "table-type",
                    head_data: "",
                    content_data: ""
                }, setSchema)}>
                <i className="fa-solid fa-table-list"></i>
            </button>

            <button
                title="Add new paragraph"
                onClick={() => addNewContent({
                    type: "paragraph-type",
                    title: "",
                    data: ""
                }, setSchema)}>
                <i className="fa-solid fa-paragraph"></i>
            </button>

            <button
                title="Add new image"
                onClick={() => addNewContent({
                    type: "image-type",
                    url: "",
                    public_id: "",
                    raw_file: "",
                    description: ""
                }, setSchema)}>
                <i className="fa-solid fa-image"></i>
            </button>
        </div>
    );
}

ContentToolbar.propTypes = {
    setSchema: PropTypes.func.isRequired,
    light: PropTypes.bool
}

export default ContentToolbar;