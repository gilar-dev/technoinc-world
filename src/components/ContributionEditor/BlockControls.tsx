import { addNewTable, moveContent, deleteContent } from "./ContributionUtils";

interface propTypes {
    currentIndex: number;
    addButton?: boolean;
    editMode?: boolean;
    schema: Record<string, any>[];
    setSchema: React.Dispatch<React.SetStateAction<any[]>>;
    setToDelete?: React.Dispatch<React.SetStateAction<any[]>>;
}

function BlockControls({ currentIndex, addButton=false, editMode=false, schema, setSchema, setToDelete }: propTypes) {

    return (
        <div className="w-full flex justify-center items-center gap-1
                        [&>button]:p-2 [&>button]:text-[1em] [&>button]:rounded-[5px] [&>button]:border-2
                        [&>button]:text-white [&>button]:cursor-pointer [&_button]:transition-colors [&_button]:duration-150 [&_button]:ease-in-out">
            <button
                title="Move up"
                onClick={() => moveContent(currentIndex, "up", schema, setSchema)}
                className="border-[rgb(0,175,255)] bg-[rgb(0,175,255)]/50 hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
                title="Move down"
                onClick={() => moveContent(currentIndex, "down", schema, setSchema)}
                className="border-[rgb(0,175,255)] bg-[rgb(0,175,255)]/50 hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
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
                className="border-green-500 bg-green-500/50 hover:bg-green-600 active:text-green-500 active:bg-white">
                <i className="fa-solid fa-plus"></i>
            </button>

            <span className="ml-auto mr-auto font-bold text-black/20">
                {currentIndex as number + 1}
            </span>

            <button
                title="Delete content"
                onClick={() => {
                    if (editMode) setToDelete?.((prev: any) => [...prev, schema[currentIndex as number]]);
                    deleteContent(currentIndex, setSchema);
                }}
                className="delete-btn border-[rgb(255,0,0)] bg-[rgb(255,0,0)]/50 hover:bg-[rgb(235,0,0)] active:text-[rgb(255,0,0)] active:bg-white">
                <i className="fa-solid fa-eraser"></i>
            </button>
        </div>
    );
}

export default BlockControls;