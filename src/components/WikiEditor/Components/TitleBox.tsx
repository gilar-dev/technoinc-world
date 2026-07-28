import { ResObject } from "../../../utils/typesUtils";
import { ReactElement } from "react";

interface PropTypes {
    article: ResObject;
}

function TitleBox({ article }: PropTypes): ReactElement {

    return (
        <div className={`mt-5 mb-[3em] flex flex-col items-center`}>
            <h2 className="text-center">
                <span className="highlight">{article.title}</span>
            </h2>
            <p className="mt-2 text-[small]">{article?.description || article.category}</p>
        </div>
    );
}

export default TitleBox;