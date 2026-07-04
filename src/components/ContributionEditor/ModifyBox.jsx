import PropTypes from "prop-types";
import { useState } from "react";

function ModifyBox({ search }) {

    return (
        <div
            style={{display: search ? "block" : "none"}}
            className="w-full h-full fixed z-1 bg-black/90">
            <div className="mt-3 flex items-center relative">
                <input
                    type="text"
                    placeholder="Search article name"
                    className="w-full h-10 pl-3 pr-10 text-[1em] outline-none border-l-0 border-t-0 border-r-0 text-white bg-transparent" />
                <button className="h-[90%] aspect-square absolute top-0 right-0 border-none rounded-[5px] text-white bg-[rgb(0,175,255)]">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>

            <div>
            </div>
        </div>
    );
}

ModifyBox.propTypes = {
    search: PropTypes.bool
}

export default ModifyBox;