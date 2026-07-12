import PropTypes from "prop-types";
import "../css/DynamicPage.css";

function NotFound({ message="" }) {

    return (
        <div className="flex-1 flex flex-col items-center gap-3">
            <h2>Sorry...</h2>
            <p>{message === "" ? "The article you're looking for is not found." 
                               : message}</p>
        </div>
    );
}

NotFound.propTypes = {
    message: PropTypes.string
}

export default NotFound;