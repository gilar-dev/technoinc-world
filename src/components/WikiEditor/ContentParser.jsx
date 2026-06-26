import PropTypes from "prop-types";
import "../../css/DynamicPage.css";

function ContentParser({ index, content, block }) {

    const prevBlock = content[index - 1];
    const nextBlock = content[index + 1];

    const sameCheck = (block, type) => {
        return block?.type === type ? true : false;
    }

    const differCheck = (block, type) => {
        if (!block) return true;
        return block?.type !== type ? true : false;
    }

    switch(block.type) {
        case "heading-type":
            return (
                <div
                    style={{borderTop: index !== 0 && "1px solid rgb(85,85,85)"}}
                    className="box mx-3 py-3 flex flex-col items-center justify-center gap-2 border-l border-r">
                    <div
                        style={{borderTop: sameCheck(prevBlock, "table-type") && "1px solid rgb(85,85,85)"}}
                        className="w-[80%]" />
                    <h3 className="text-center">
                        <span className="highlight">{block.data}</span>
                    </h3>
                </div>
            );
            break;

        case "table-type":
            return (
                <div
                    style={{
                        borderBottom: differCheck(nextBlock, "table-type") && "1px solid rgb(85,85,85)"
                    }}
                    className={"box mx-3 flex p-3 border-l border-r"}>
                    <h4 className="w-full text-[.9em]">{block.head_data}</h4>
                    <p className="w-full font-light text-[.9em]">{block.content_data}</p>
                </div>
            );
            break;

        case "paragraph-type":
            return (
                <div className="mx-3 my-10">
                    <h3 className="font-medium">{block.title}</h3>
                    <p className="mt-3 font-light">{block.data}</p>
                </div>
            );
            break;

        case "image-type":
            return (
                <div className="p-3 flex justify-center items-center">
                    <img
                        src={block.url || null}
                        className="w-[75%]" />
                </div>
            );
            break;

        default:
            return null;
    }
}

ContentParser.propTypes = {
    index: PropTypes.number.isRequired,
    content: PropTypes.array.isRequired,
    block: PropTypes.object.isRequired
}

export default ContentParser;