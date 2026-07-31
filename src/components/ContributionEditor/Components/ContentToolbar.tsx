import { addNewContentBlock } from "../../../utils/ContentBlocks/contentUtils";
import { ReactElement, useContext } from "react";
import { ResObject, Schema, SetState } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";

interface PropTypes {
    light: boolean;
    setSchema: SetState<Schema>;
}

function ContentToolbar({ light, setSchema }: PropTypes): ReactElement {

    const { setBlockMenu, blockUsed } = useContext<any>(Config);

    return (
        <div className={`mt-[3em] mx-[1em] p-[1em] flex gap-1 rounded-[10px] sticky bottom-0 shadow-2xs shadow-black
                        [&_button]:p-[.2em] [&_button]:text-3xl [&_button]:relative [&_button]:rounded-[5px]
                        [&_button]:border [&_button]:cursor-pointer [&_button]:transition-colors [&_button]:duration-150 [&_button]:ease-in-out
                        ${light ? "bg-white/70 [&_button]:border-black [&_button]:text-black [&_button]:bg-white/70 [&_button]:hover:bg-gray-300"
                                : "bg-gray-700/50 [&_button]:border-white [&_button]:text-white [&_button]:bg-gray-700 [&_button]:hover:bg-gray-500"}`}>
            <div className="w-full overflow-auto flex items-center gap-3">
                <em className={`mx-auto ${blockUsed.length === 0 ? "block" : "hidden"}`}>Browse more content blocks</em>
                {blockUsed.map((used: ResObject, index: number) => (
                    <button key={index} title={used.label} onClick={() => addNewContentBlock(used.block(), setSchema)}>
                        <i className={used.icon}></i>
                    </button>
                ))}
            </div>
            <div>
                <button
                    title="Browse block"
                    onClick={() => setBlockMenu(true)}
                    className="border-none! text-white! bg-[rgb(0,175,255)]! hover:bg-[rgb(0,155,235)]! transition-colors duration-75 ease-in-out">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    );
}

export default ContentToolbar;