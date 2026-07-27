import { ReactElement } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    visited: number;
}

function ActionToolbar({ visited }: PropTypes): ReactElement {

    return (
        <div className="mx-3 mb-5 p-3 flex items-center gap-5 border-l-0 border-r-0 border border-[rgb(85,85,85)]">
            <span className="mr-auto font-medium text-[.85em]">{visited} Visited</span>
            <button className="text-[1.2em] border-none text-gray-400 bg-transparent">
                <i className="fa-regular fa-star"></i>
            </button>
            <button className="text-[1.2em] border-none text-gray-400 bg-transparent">
                <i className="fa-solid fa-pen"></i>
            </button>
        </div>
    );
}

export default ActionToolbar;