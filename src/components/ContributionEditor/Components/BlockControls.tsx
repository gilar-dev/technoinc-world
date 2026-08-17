import { ReactElement, useContext } from "react";
import { Schema, PublicID, SetState, ModifyAction } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { moveContentBlock, deleteContentBlock } from "../../../utils/ContentBlocks/contentUtils";
import "../../../css/DynamicPage.css";

interface propTypes {
    currentIndex: number;
    schema: Schema;
    setSchema: SetState<Schema>;
    setToDelete?: SetState<PublicID> | undefined;
}

interface ContextTypes {
    edit: boolean;
    setBlockMenu: SetState<boolean>;
    setBlockIndex: SetState<number>;
    setModifyLogs: SetState<ModifyAction[]>;
}

function BlockControls({ currentIndex, schema, setSchema, setToDelete = undefined }: propTypes): ReactElement {

    const { edit, setBlockMenu, setBlockIndex, setModifyLogs } = useContext<ContextTypes>(Config);

    return (
        <div className="w-full flex justify-center items-center gap-1
                        [&>button]:p-2 [&>button]:text-[1em] [&>button]:rounded-[5px] [&>button]:border-2
                        [&>button]:text-white [&>button]:cursor-pointer [&_button]:transition-colors [&_button]:duration-150 [&_button]:ease-in-out">
            <button
                title="Move up"
                onClick={() => {
                    const action: any = moveContentBlock(currentIndex, "up", schema, setSchema);
                    if (action && edit) setModifyLogs((prev: ModifyAction[]) => {
                        const logs: ModifyAction[] = [...prev];
                        if (logs.length !== 0 && logs[logs.length - 1].block === schema[currentIndex].type) return logs;
                        return [...prev, { action: "move", block: schema[currentIndex].type }];
                    });
                }}
                className="border-[rgb(0,175,255)] bg-[rgb(0,175,255)]/50 hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
                title="Move down"
                onClick={() => {
                    const action: any = moveContentBlock(currentIndex, "down", schema, setSchema);
                    if (action && edit) setModifyLogs((prev: ModifyAction[]) => {
                        const logs: ModifyAction[] = [...prev];
                        if (logs.length !== 0 && logs[logs.length - 1].block === schema[currentIndex].type) return logs;
                        return [...prev, { action: "move", block: schema[currentIndex].type }];
                    });
                }}
                className="border-[rgb(0,175,255)] bg-[rgb(0,175,255)]/50 hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-down"></i>
            </button>
            <button
                title="Add new block"
                onClick={() => {
                    setBlockMenu(true);
                    setBlockIndex(currentIndex);
                }}
                className="border-green-500 bg-green-500/50 hover:bg-green-600 active:text-green-500 active:bg-white">
                <i className="fa-solid fa-plus"></i>
            </button>
            <span className="ml-auto mr-auto font-bold text-black/20">
                {currentIndex + 1} | {schema[currentIndex].type}
            </span>
            <button
                title="Delete block"
                onClick={() => {
                    if (setToDelete) {
                        setToDelete((prev: PublicID) => [...prev, schema[currentIndex].public_id]);
                    }
                    deleteContentBlock(currentIndex, setSchema);
                    if (edit) setModifyLogs((prev: ModifyAction[]) => [...prev, { action: "delete", block: schema[currentIndex].type }]);
                }}
                className="delete-btn border-[rgb(255,0,0)] bg-[rgb(255,0,0)]/50 hover:bg-[rgb(235,0,0)] active:text-[rgb(255,0,0)] active:bg-white">
                <i className="fa-solid fa-eraser"></i>
            </button>
        </div>
    );
}

export default BlockControls;