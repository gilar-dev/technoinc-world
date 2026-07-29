import { ReactElement } from "react";
import { ResObject } from "../../../utils/typesUtils";

interface PropTypes {
    content: string;
    style?: string;
}

function TextParser({ content, style="" }: PropTypes): ReactElement {

    const parsedText = (content: string): any => {
        if (!content) return [];

        const regexCombined: RegExp = /(?<bold>\*\*(.*?)\*\*)|(?<underline>__(.*?)__)|(?<italic>\*(.*?)\*)|(?<dotted>_(.*?)_)|(?<link><link:(.*?)#(.*?)>)/g;
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
                    <strong key={`b-${index}`}>{parsedText(cleanText)}</strong>
                );
            } else if (groups?.underline) {
                const cleanText: string = match[4];
                elements.push(
                    <u key={`u-${index}`}>{parsedText(cleanText)}</u>
                );
            } else if (groups?.italic) {
                const cleanText: string = match[6];
                elements.push(
                    <em key={`i-${index}`}>{parsedText(cleanText)}</em>
                );
            } else if (groups?.dotted) {
                const cleanText: string = match[8];
                elements.push(
                    <span key={`d-${index}`} className="border-0 border-b border-dotted">{parsedText(cleanText)}</span>
                );
            } else if (groups?.link) {
                const linkLabel: string = match[10];
                const linkUrl: string = match[11];
                elements.push(
                    <a 
                        key={`l-${index}`}
                        href={linkUrl} target={linkUrl.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener nooferrer"
                        className="font-medium text-[#5c92ff] hover:underline"
                    >
                        {parsedText(linkLabel)}
                    </a>
                );
            }

            lastIndex = matchIndex + matchString.length;
        });

        if (lastIndex < content.length) {
            elements.push(content.substring(lastIndex));
        }

        return elements;
    }

    return (
        <p className={style}>{parsedText(content)}</p>
    );
}

export default TextParser;