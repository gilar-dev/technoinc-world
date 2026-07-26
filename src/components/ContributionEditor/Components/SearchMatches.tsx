import { ReactElement, useMemo } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    title: string;
    input: string;
}

function SearchMatches({ title, input }: PropTypes): ReactElement {

    const parsedText = useMemo<any>(() => {
        if (!input.trim()) return title;

        const escapedInput: string = input.replace(/[.*+?^${}()[\]\\]/g, "\\$&");
        const regex: RegExp = new RegExp(`(${escapedInput})`, "gi");
        const elements: React.ReactNode[] = [];
        let lastIndex: number = 0;

        const matches: RegExpExecArray[] = Array.from(title.matchAll(regex));
        matches.forEach((match: RegExpExecArray, index: number) => {
            if (match.index > lastIndex) elements.push(title.substring(lastIndex, match.index));

            if (match) elements.push(
                <mark key={`match-${index}`} className="text-white bg-blue-700">{match[0]}</mark>
            );
            lastIndex = match.index + match[0].length;
        });
        
        if (lastIndex < title.length) elements.push(title.substring(lastIndex));

        return elements;
    }, [title, input]);

    return (
        <h4>{parsedText}</h4>
    );
}

export default SearchMatches;