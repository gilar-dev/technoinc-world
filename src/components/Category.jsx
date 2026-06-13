import { Link, useParams } from "react-router-dom";

import Menu from "./Menu.jsx";

function Category() {

    const param = useParams();
    console.log(param);

    return (
        <>
            <Menu wikiTitle={param.categoryName.charAt(0).toUpperCase() + param.categoryName.slice(1)} />
        </>
    );
}

export default Category;