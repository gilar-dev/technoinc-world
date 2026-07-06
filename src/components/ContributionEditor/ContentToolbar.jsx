import { addNewContent } from "./ContributionUtils";
import PropTypes from "prop-types";

function ContentToolbar({ setSchema }) {

    return (
        <div className="mt-[3em] mx-[1em] p-[1em] flex gap-[1em] overflow-auto rounded-[10px]
                        bg-[rgb(220,220,220)] sticky bottom-0 shadow-2xs shadow-black
                        [&>button]:p-[.2em] [&>button]:border-none [&>button]:text-3xl [&>button]:rounded-[5px]
                        [&>button]:text-white [&>button]:bg-[rgb(0,175,255)] [&>button]:hover:bg-[rgb(0,155,235)]
                        [&>button]:active:text-[rgb(0,155,235)] [&>button]:active:bg-white [&>button]:cursor-pointer">
            
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
                    raw_file: "",
                    description: ""
                }, setSchema)}>
                <i className="fa-solid fa-image"></i>
            </button>
        </div>
    );
}

ContentToolbar.propTypes = {
    setSchema: PropTypes.func.isRequired
}

export default ContentToolbar;