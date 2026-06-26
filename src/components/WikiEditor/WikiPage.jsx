import Menu from "../Menu";
import Footer from "../Footer";
import ContentParser from "./ContentParser";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../API.jsx";
import "../../css/DynamicPage.css";

function WikiPage() {

    // get the category name and content id
    const { categoryName, contentId } = useParams();
    const getCategory = categoryName.split(":")[1];
    
    // State variables
    const [article, setArticle] = useState({});
    const [content, setContent] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchData = async () => {
            setLoading(true);
            let convertedName = getCategory.toLowerCase();

            // Convert plural name to singular name
            if (convertedName.includes("ies")) convertedName = convertedName.replaceAll("ies", "y");
            else convertedName = convertedName.slice(0, convertedName.length - 1);

            try {
                // Fetch request to backend server
                const response = await fetch(`${API}/api/v1/wiki/${convertedName}/${contentId}`);
                const results = await response.json();

                // Set state based on the results
                setLoading(false);
                setArticle(results.article);
                setContent(results.article.wiki_content);

            } catch(error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <Menu wikiTitle={article.title} selected={getCategory} />

            <div
                style={{display: loading ? "flex" : "none"}}
                className="w-full min-h-[50vh] flex justify-center items-center">
                <div className="w-[20%] aspect-square bg-[url('/assets/icons/loading-pixel.gif')] bg-center bg-cover bg-no-repeat"></div>
            </div>

            <div className="mt-4 mb-[6em] flex flex-col items-center">
                <h2 className="text-center">
                    <span className="highlight">{article.title}</span>
                </h2>
                <p className="mt-2 text-[small]">{`${article.category} Page`}</p>
                <div className="mt-3 flex justify-center items-center gap-1 [&>p]:text-[.7em]">
                    <p>VISITED</p>
                    <p>{article.visited}</p>
                </div>
            </div>

            <div
                style={{
                    borderBottom: content[0]?.type.includes("heading-type") && "0px" ||
                    content[0]?.type.includes("table-type") && "0px"
                }}
                className="box mx-3 p-5 border">
                <img
                    src={article.cover || null}
                    alt={article.title}
                    className="w-full" />
            </div>

            <div>
                {content.map((item, idx) => (
                    <ContentParser
                        key={idx}
                        index={idx}
                        content={content}
                        block={item} />
                ))}
            </div>

            <Footer />
        </>
    );
}

export default WikiPage;