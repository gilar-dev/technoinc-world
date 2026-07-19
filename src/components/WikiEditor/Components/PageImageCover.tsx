import { ResObject, SetState } from "../../../utils/typesUtils";
import { ReactElement } from "react";

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

    return (
        <div className={`box mx-3 p-5 border
                        ${isExist ? "block" : "hidden"}
                        ${
                            content?.type.includes("heading-type") && "border-b-0" ||
                            content?.type.includes("table-type") && "border-b-0"
                        }`}>
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