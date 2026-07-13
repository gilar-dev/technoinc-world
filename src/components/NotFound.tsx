import "../css/DynamicPage.css";

interface propTypes {
    message?: string
}

function NotFound({ message="" }: propTypes) {

    return (
        <div className="flex-1 flex flex-col items-center gap-3">
            <h2>Sorry...</h2>
            <p>{message === "" ? "The article you're looking for is not found." 
                               : message}</p>
        </div>
    );
}

export default NotFound;