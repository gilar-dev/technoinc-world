import { Config } from "../../../utils/contextUtils";
import { ReactElement, useContext } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    mode: "create" | "edit";
    text?: string;
}

function TextEditor({ mode, text }: PropTypes): ReactElement {

    const { light } = useContext<any>(Config);

    return (
        <div className={`mt-5 flex justify-between items-center gap-3 sticky top-15 shadow-2xs shadow-black
                        [&_button]:text-[1.5em] [&_button]:border-0 [&_button]:border-l [&_button]:border-r
                        [&_button]:border-[rgb(85,85,85)]/50 [&_button]:text-gray-400 [&_button]:bg-transparent
                        ${light ? "bg-white" : "bg-gray-700/50"}`}>
            <button>
                <i className="fa-solid fa-bold"></i>
            </button>
            <button
                onClick={() => {
                }}
                className="px-5 py-2 cursor-pointer font-['Montserrat'] font-bold text-[1.2em] text-white! bg-green-500!">
                {mode === "create" ? "Create" : "Upload"}
            </button>
        </div>
    );
}

export default TextEditor;