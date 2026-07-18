import { ReactElement } from "react";

function InspireBox(): ReactElement {

    return (
        <div className="mt-[3em] mx-3 p-3 font-['Pixelify_Sans'] text-center flex flex-col
                        items-center justify-center rounded-[10px] border-3
                        text-white border-purple-600 bg-purple-800/50">
            <h1>The Story is All Yours!</h1>
            <p>Click tools bellow to start creating your own story!</p>
        </div>
    );
}

export default InspireBox;