import Menu from "./Menu";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DynamicPage.css";

function WikiPage() {

    // get the category name and content id
    const { categoryName, contentId } = useParams();

    const [content, setContent] = useState({});

    useEffect(() => {
        // Future url for fetching data
        const URL = "https://technoinc-api.vercel.app/api/v1/category/organizations/uceero-org";

        fetch("/data/wiki.json")
        .then(result => result.json())
        .then(data => setContent(data))
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        console.log(content);
    }, [content]);

    return (
        <>
            <Menu wikiTitle={content.title} selected={categoryName} />

            <div className="mt-4 mb-[6em] flex flex-col items-center">
                <h2 className="highlight">{content.title}</h2>
                <p className="mt-2 text-[small]">{`${content.category} Page`}</p>
            </div>

            <div className="p-[2em]">
                {content.wiki_content?.map((item, idx) => {
                    if (item.type === "image") return <img key={idx} src={item.img_url} className="w-full"></img>
                })}
            </div>

            <Footer />
        </>
    );
}

export default WikiPage;