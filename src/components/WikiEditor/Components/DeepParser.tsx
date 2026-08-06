import WikiRenderer from "./WikiRenderer";
import { ResObject } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { useMemo, useContext } from "react";
import "../../../css/DynamicPage.css"

interface PrimaryProps {
    block: ResObject[];
    expandContent: (event: HTMLDivElement) => void;
}

interface SecondaryProps {
    block: ResObject[];
    index: number;
}

export function PrimaryParser({ block, expandContent }: PrimaryProps): React.JSX.Element {

    const isArray = (content: any): boolean => {
        return Array.isArray(content);
    }

    const checkType = (content: ResObject[], type: string): boolean => {
        return content.some((item: ResObject) => item.type.includes(type));
    }

    return (
        <div className="mt-5">
            <div
                onClick={(e) => expandContent(e.currentTarget)}
                className="my-3 py-1 flex justify-between items-center gap-2 border-b border-[rgb(85,85,85)]">
                <WikiRenderer block={block[0]} />
                <span className="text-[1.3em]"><i className="fa-solid fa-angle-up"></i></span>
            </div>
            <div className="block">
                {block.map((subBlock: any, subIndex: number) => {
                    if (!isArray(subBlock) && subBlock.type !== "gen-heading-type") return (
                        <WikiRenderer key={subIndex} block={subBlock} />
                    );
                    else if (isArray(subBlock) && checkType(subBlock, "ib")) return (
                        <SecondaryParser key={subIndex} block={subBlock} index={subIndex} />
                    );
                })}
            </div>
        </div>
    );
}

export function SecondaryParser({ block, index }: SecondaryProps): React.JSX.Element {

    const { light } = useContext<any>(Config);

    const getSubheadings = useMemo<number[]>(() => {
        const subheadings: number[] = [];
        for (let pos: number = 0; pos < block.length; pos++) {
            if (block[pos].type === "ib-subheading-type") subheadings.push(pos);
        }
        return subheadings;
    }, [block]);

    const setFullMode = (event: HTMLButtonElement, className: string): void => {
        const infoboxChild: NodeListOf<Element> = document.querySelectorAll(`.${className}`);
        infoboxChild.forEach((child: Element) => {
            const isExpand: boolean = child.classList.contains("table-row");
            child.classList.replace(isExpand ? "table-row" : "hidden", !isExpand ? "table-row" : "hidden");
            event.children[0].textContent = !isExpand ? "Collapse" : "Expand";
        });
    }

    return (
        <table
            width="100%"
            className={`my-5 p-3 border border-[rgb(85,85,85)]
                        ${light ? "bg-white/30" : "bg-gray-700/30"}`}>
            <tbody>
                {block.map((subBlock: any, subIndex: number) => (
                    <tr
                        key={subIndex}
                        className={`table-row
                                    ${getSubheadings.length > 1 && subIndex >= getSubheadings[1] && `more-${index}`}`}>
                        <td>
                            <WikiRenderer block={subBlock} />
                        </td>
                    </tr>
                ))}
                {getSubheadings.length > 1 && (
                    <tr>
                        <td>
                            <div className="w-full mt-3 font-sans flex justify-center items-center hover:bg-white/30">
                                <button
                                    onClick={(e) => setFullMode(e.currentTarget, `more-${index}`)}
                                    className={`w-full p-1 cursor-pointer border-none bg-transparent
                                                ${light ? "border-black text-black" : "border-white text-white"}`}>
                                    <span className="px-1 font-semibold border-l border-r">Collapse</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}