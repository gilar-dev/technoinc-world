import React, { ReactElement, useMemo } from "react";
import { ResObject } from "../../../utils/typesUtils";

interface PropTypes {
    content: string;
    style?: string;
}

function TextParser({ content, style="" }: PropTypes): ReactElement {

    const parsedText: any = useMemo<any>(() => {
        if (!content) return [];

        const regexCombined: RegExp = /(?<bold>\*\*(.*?)\*\*)|(?<underline>__(.*?)__)|(?<italic>\*(.*?)\*)|(?<link><link:(.*?)#(.*?)>)/g;
        const elements: React.ReactNode[] = [];
        let lastIndex: number = 0;

        const matches: RegExpExecArray[] = Array.from(content.matchAll(regexCombined));
        matches.forEach((match: RegExpExecArray, index: number) => {
            const matchString: string = match[0];
            const matchIndex: number = match.index ?? 0;
            const groups: ResObject | undefined = match.groups;

            if (matchIndex > lastIndex) {
                elements.push(content.substring(lastIndex, matchIndex));
            }

            if (groups?.bold) {
                const cleanText: string = match[2];
                elements.push(
                    <strong key={`b-${index}`}>{cleanText}</strong>
                );
            } else if (groups?.underline) {
                const cleanText: string = match[4];
                elements.push(
                    <u key={`u-${index}`}>{cleanText}</u>
                );
            } else if (groups?.italic) {
                const cleanText: string = match[6];
                elements.push(
                    <em key={`i-${index}`}>{cleanText}</em>
                );
            } else if (groups?.link) {
                const linkLabel: string = match[8];
                const linkUrl: string = match[9];
                elements.push(
                    <a 
                        key={`l-${index}`}
                        href={linkUrl} target={linkUrl.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener nooferrer"
                        className="text-[rgb(105,137,252)]"
                        >{linkLabel}</a>
                );
            }

            lastIndex = matchIndex + matchString.length;
        });

        if (lastIndex < content.length) {
            elements.push(content.substring(lastIndex));
        }

        return elements;
    }, [content]);

    return (
        <p className={style}>{parsedText}</p>
    );
}

export default TextParser;