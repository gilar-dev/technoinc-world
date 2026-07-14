import { ReactElement } from "react";
import "../css/DynamicPage.css";

interface propTypes {
    message?: string;
}

function NotFound({ message="" }: propTypes): ReactElement {

    return (
        <div className="mt-[5em] flex-1 flex flex-col items-center gap-3">
            <h2>Sorry...</h2>
            <p>{message === "" ? "The article you're looking for is not found." 
                               : message}</p>
        </div>
    );
}

export default NotFound;