import { addNewTable, moveContent, deleteContent } from "./ContributionUtils";
import PropTypes from "prop-types";

function BlockControls({ currentIndex, addButton=false, schema, setSchema }) {
    return (
        <div className="w-full flex justify-center items-center gap-1
                        [&>button]:p-2 [&>button]:text-[1em] [&>button]:rounded-[5px] [&>button]:border-none
                        [&>button]:text-white [&>button]:cursor-pointer">
            <button
                title="Move up"
                onClick={() => moveContent(currentIndex, "up", schema={schema}, setSchema)}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
                title="Move down"
                onClick={() => moveContent(currentIndex, "down", schema={schema}, setSchema)}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-down"></i>
            </button>
            <button
                title="Add new table"
                style={{display: addButton ? "block" : "none"}}
                onClick={() => addNewTable(currentIndex, {
                    type: "table-type",
                    head_data: "",
                    content_data: ""
                }, setSchema)}
                className="bg-green-500 hover:bg-green-600 active:text-green-500 active:bg-white">
                <i className="fa-solid fa-plus"></i>
            </button>

            <span className="ml-auto mr-auto font-bold text-black/20">
                {currentIndex + 1}
            </span>

            <button
                title="Delete content"
                onClick={() => deleteContent(currentIndex, setSchema)}
                className="delete-btn bg-[rgb(255,0,0)] hover:bg-[rgb(235,0,0)] active:text-[rgb(255,0,0)] active:bg-white">
                <i className="fa-solid fa-eraser"></i>
            </button>
        </div>
    );
}

BlockControls.propTypes = {
    currentIndex: PropTypes.number.isRequired,
    addButton: PropTypes.bool.isRequired,
    schema: PropTypes.array.isRequired,
    setSchema: PropTypes.func.isRequired
}

export default BlockControls;