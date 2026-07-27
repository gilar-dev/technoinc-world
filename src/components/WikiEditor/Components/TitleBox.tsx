import { ResObject } from "../../../utils/typesUtils";
import { ReactElement } from "react";

interface PropTypes {
    isExist: boolean | undefined;
    article: ResObject;
}

function TitleBox({ isExist, article }: PropTypes): ReactElement {

    return (
        <div className={`mt-5 mb-[3em] flex-col items-center
                        ${isExist ? "flex" : "hidden"}`}>
            <h2 className="text-center">
                <span className="highlight">{article.title}</span>
            </h2>
            <p className="mt-2 text-[small]">{article?.description || article.category}</p>
        </div>
    );
}

export default TitleBox;