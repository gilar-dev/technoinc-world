import { ResObject } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { GeneralBlocks } from "../../../utils/ContentBlocks/blockUtils";
import { addNewContentBlock } from "../../../utils/ContentBlocks/contentUtils";
import { ReactElement, useEffect, useContext } from "react";

function BlockMenu(): ReactElement {

    const { light, setSchema, blockMenu, setBlockMenu, setBlockUsed } = useContext<any>(Config);

    useEffect(() => {
        document.body.style.overflow = blockMenu ? "hidden" : "visible";
    }, [blockMenu]);

    return (
        <div className={`w-full p-3 fixed bottom-0 z-1 transition-transform duration-150 ease-in-out
                        ${blockMenu ? "translate-y-0" : "translate-y-full"}
                        ${light ? "bg-white" : "bg-gray-700"}`}>
            <div className=""></div>
            <div className="my-3 flex justify-between items-center">
                <h3>Content Blocks</h3>
                <button
                    onClick={() => setBlockMenu(false)}
                    className="text-2xl border-none bg-transparent">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div>
                <small className="mt-3 text-gray-700">General</small>
                <div className="p-1 flex justify-center items-center gap-5 flex-wrap">
                    {GeneralBlocks.map((block: ResObject, index: number) => (
                        <div
                            key={index}
                            onClick={() =>  {
                                addNewContentBlock(block.block, setSchema);
                                setBlockUsed((prev: ResObject[]) => {
                                    if (prev[0]?.block === block.block) return [...prev];
                                    if (prev.length > 6) prev.pop();
                                    return [{
                                        icon: block.icon,
                                        block: block.block
                                    }, ...prev];
                                })
                                setBlockMenu(false);
                            }}
                            className="w-25 h-25 p-3 flex flex-col items-center justify-between rounded-[5px] border border-[rgb(85,85,85)]">
                            <i className={`${block.icon} text-[3em] text-gray-400`}></i>
                            <p className="text-center text-[.7em]">{block.label}</p>
                        </div>
                    ))}
                </div>
                <small className="mt-3 text-gray-700">Infobox</small>
            </div>
        </div>
    );
}

export default BlockMenu;