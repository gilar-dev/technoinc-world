import { ReactElement } from "react";
import "../css/DynamicPage.css";

interface propTypes {
    show?: boolean;
    position?: "static" | "relative" | "absolute";
}

function Loading({ show=false, position="absolute" }:propTypes): ReactElement {

    return (
        <div className={`w-full h-full mt-5 justify-center items-center top-0
                        ${show ? "flex" : "hidden"}
                        ${position}`}>
            <div className="w-[50%] p-3 flex flex-col items-center rounded-[5px] gap-5 bg-gray-500/30">
                <div className="w-[30%] aspect-square bg-[url('/assets/icons/loading-pixel.gif')] bg-center bg-cover bg-no-repeat" />
                <p className="font-['Pixelify_Sans'] text-[100%] text-white">Loading...</p>
            </div>
        </div>
    );
}

export default Loading;