import ContentParser from "./ContentParser";
import { Schema, ResObject, SetState } from "../../../utils/typesUtils";
import { Theme } from "../../../utils/contextUtils";
import { ReactElement, useMemo, useContext } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    content: Schema;
}

interface Context {
    menuContent: Schema;
    setShowed: SetState<string>;
    setImageContainer: SetState<boolean>;
}

function ContentGrouper({ content }: PropTypes): ReactElement {

    const { menuContent, setShowed, setImageContainer }: Context = useContext(Theme);

    const grouper = useMemo<any[]>(() => {
        const group: any[] = [];
        let infobox: any[] = [];
        let paragraph: any[] = [];
        let current: string = "";
        for (let index: number = 0; index < content.length; index++) {
            const block = content[index];

            if (block.type === "heading-type" || block.type === "table-type") {
                current = "infobox";
                infobox.push(block);
            } else if (current === "infobox" && infobox.length !== 0) {
                group.push(infobox);
                infobox = [];
            }

            if (block.type === "paragraph-type" || block.type === "image-type") {
                if (block.type === "paragraph-type" && paragraph.length !== 0) {
                    group.push(paragraph);
                    paragraph = [];
                }
                current = "paragraph";
                paragraph.push(block);
            } else if (current === "paragraph" && paragraph.length !== 0) {
                group.push(paragraph);
                paragraph = [];
            }
        }

        if (infobox.length !== 0) group.push(infobox);
        else if (paragraph.length !== 0) group.push(paragraph);

        return group;
    }, [content]);

    return (
        <div className="whitespace-pre-wrap">
            {grouper.map((group: Schema, index: number) => (
                <div
                    key={index}
                    className=""
                >
                    {group.map((block: ResObject, subIndex: number) => (
                        <ContentParser
                            key={subIndex}
                            index={subIndex}
                            content={grouper[index]}
                            block={block}
                            menuContent={menuContent}
                            setShowed={setShowed}
                            setImageContainer={setImageContainer} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default ContentGrouper;