import { ResObject, SetState } from "../../../utils/typesUtils";
import { Theme } from "../../../utils/contextUtils";
import { ReactElement, useContext } from "react";

interface PropTypes {
    isExist: boolean | undefined;
    article: ResObject;
    content: ResObject;
    states: {
        setShowed: SetState<string>;
        setImageContainer: SetState<boolean>;
    }
}

function PageImageCover({ isExist, article, content, states }: PropTypes): ReactElement {

    const { light } = useContext(Theme);

    return (
        <div className={`box mx-3 p-5 border
                        ${isExist ? "block" : "hidden"}
                        ${
                            content?.type.includes("heading-type") && "border-b-0" ||
                            content?.type.includes("table-type") && "border-b-0"
                        }
                        ${light ? "bg-white/10" : "bg-gray-700/30"}`}>
            <img
                src={article.cover || null}
                alt={article.title}
                onClick={() => {
                    states.setShowed(article.cover);
                    states.setImageContainer(true);
                }}
                className="w-full cursor-pointer" />
        </div>
    );
}

export default PageImageCover;