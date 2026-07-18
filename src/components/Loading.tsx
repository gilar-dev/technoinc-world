import { ReactElement, useEffect } from "react";
import "../css/DynamicPage.css";

interface PropTypes {
    show?: boolean;
    position?: "static" | "relative" | "absolute" | "fixed";
}

function Loading({ show=false, position="absolute" }:PropTypes): ReactElement {

    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "visible";
    }, [show]);

    return (
        <div className={`w-full h-full mt-5 justify-center items-center top-0 z-100
                        ${show ? "flex" : "hidden"} ${position}`}>
            <div className="w-[50%] p-3 flex flex-col items-center rounded-[5px] gap-5 bg-gray-500/30">
                <div className="w-[30%] aspect-square bg-[url('/assets/icons/loading-pixel.gif')] bg-center bg-cover bg-no-repeat" />
                <p className="font-['Pixelify_Sans'] text-[100%] text-white">Loading...</p>
            </div>
        </div>
    );
}

export default Loading;