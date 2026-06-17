import Menu from "./Menu";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DynamicPage.css";

function ContentPage() {

    // get the category name and content id
    const { categoryName, contentId } = useParams();

    return (
        <>
            <Menu wikiTitle={contentId} selected={categoryName} />

            <div className="mt-4 mb-[6em] flex flex-col items-center">
                <h2 className="highlight">{contentId}</h2>
                <p className="mt-2 text-[small]">{`${categoryName} Page`}</p>
            </div>

            <Footer />
        </>
    );
}

export default ContentPage;