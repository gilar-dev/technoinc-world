import ContentRenderer from "./ContentRenderer";
import "../../../css/DynamicPage.css"

interface PrimaryProps {
    block: any;
    expandContent: (event: HTMLDivElement) => void;
}

interface SecondaryProps {
    block: any;
}

export function PrimaryParser({ block, expandContent }: PrimaryProps): React.JSX.Element {

    return (
        <div>
            <div
                onClick={(e) => expandContent(e.currentTarget)}
                className="mb-3 flex justify-between items-center gap-2 border-b border-[rgb(85,85,85)]">
                <ContentRenderer block={block[0]} />
                <span className="text-[1.5em]"><i className="fa-solid fa-angle-up"></i></span>
            </div>
            <div className="block">
                {block.map((subBlock: any, subIndex: number) => {
                    if (!Array.isArray(subBlock) && subBlock.type !== "gen-heading-type") return (
                        <ContentRenderer key={subIndex} block={subBlock} />
                    );
                    else if (Array.isArray(subBlock)) return (
                        <SecondaryParser key={subIndex} block={subBlock} />
                    );
                })}
            </div>
        </div>
    );
}

export function SecondaryParser({ block }: SecondaryProps): React.JSX.Element {

    return (
        <table width="100%" className="p-3 border border-[rgb(85,85,85)]">
            <tbody>
                {block.map((subBlock: any, subIndex: number) => (
                    <tr key={subIndex}>
                        <td>
                            <ContentRenderer block={subBlock} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}