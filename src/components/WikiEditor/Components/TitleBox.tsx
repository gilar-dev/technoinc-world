import { ArticleConfig } from "../../../utils/typesUtils";
import { ReactElement } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    article: ArticleConfig;
}

function TitleBox({ article }: PropTypes): ReactElement {

    return (
        <div className={`mt-5 mb-[3em] px-3 font-['Montserrat'] flex flex-col items-center`}>
            <h2 className="text-center">
                <span className="highlight">{article.title}</span>
            </h2>
            <span className="mt-2 text-center text-[small]">{article.description}</span>
        </div>
    );
}

export default TitleBox;