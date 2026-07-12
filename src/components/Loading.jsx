import PropTypes from "prop-types";
import "../css/DynamicPage.css";

function Loading({ show=false, position="" }) {

    return (
        <div className={`w-full h-full justify-center items-center top-0
                        ${show ? "flex" : "hidden"}
                        ${position === "" ? "absolute" : position}`}>
            <div className="w-[50%] flex flex-col items-center gap-5">
                <div className="w-[30%] aspect-square bg-[url('/assets/icons/loading-pixel.gif')] bg-center bg-cover bg-no-repeat" />
                <p className="font-['Pixelify_Sans'] text-[100%]">Loading...</p>
            </div>
        </div>
    );
}

Loading.propTypes = {
    show: PropTypes.bool,
    position: PropTypes.string
}

export default Loading;