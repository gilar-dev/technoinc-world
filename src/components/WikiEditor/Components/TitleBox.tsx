import { ResObject } from "../../../utils/typesUtils";
import { ReactElement } from "react";

interface PropTypes {
    isExist: boolean | undefined;
    article: ResObject;
}

function TitleBox({ isExist, article }: PropTypes): ReactElement {

    return (
        <div className={`mt-4 mb-[6em] flex-col items-center
                        ${isExist ? "flex" : "hidden"}`}>
            <h2 className="text-center">
                <span className="highlight">{article.title}</span>
            </h2>
            <p className="mt-2 text-[small]">{`${article.category} Page`}</p>
            <div className="mt-3 flex justify-center items-center gap-1 [&>p]:text-[.7em]">
                <p>VISITED</p>
                <p>{article.visited}</p>
            </div>
        </div>
    );
}

export default TitleBox;