import Menu from "../Menu";
import Loading from "../Loading";
import NotFound from "../NotFound";
import Footer from "../Footer";
import ContentParser from "./ContentParser";
import ImageContainer from "./ImageContainer";
import { Activity, useState, useEffect, ReactElement } from "react";
import { Params, useParams } from "react-router-dom";
import "../../css/DynamicPage.css";

function WikiPage(): ReactElement {

    // get the category name and content id
    const { categoryName, contentId }: Params<string> = useParams();
    const getCategory: string = (categoryName as string).split(":")[1];
    
    // Essential data variables
    const [article, setArticle] = useState<Record<string, any>>({});
    const [content, setContent] = useState<Record<string, any>[]>([]);
    const [images, setImages] = useState<Record<string, any>[]>([]);
    const [menuContent, setMenuContent] = useState<Record<string, any>[]>([]);

    // Boolean state variables
    const [loading, setLoading] = useState<boolean>(true);
    const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
    const [imageContainer, setImageContainer] = useState<boolean>(false);

    const [showed, setShowed] = useState<string>("");

    useEffect(() => {
        
        const fetchData = async () => {
            setLoading(true);

            let convertedName: string = getCategory.toLowerCase();
            const API: string = import.meta.env.VITE_API;

            // Convert plural name to singular name
            if (convertedName.includes("ies")) convertedName = convertedName.replaceAll("ies", "y");
            else convertedName = convertedName.slice(0, convertedName.length - 1);

            try {
                // Fetch request to backend server
                const response: Response = await fetch(`${API}/api/v1/wiki/${convertedName}/${contentId}`);
                const results: Record<string, any> = await response.json();

                // Get all image contents
                const getImages: Record<string, any>[] = results.article.wiki_content.filter((img: any) => img.type === "image-type");
                // Add cover image to list
                getImages.unshift({
                    url: results.article.cover,
                    description: results.article.title
                });

                const getParagraph: Record<string, any>[] = results.article.wiki_content.filter((para: any) => para.type === "paragraph-type");

                // Set state based on the results
                setIsExist(true);
                setLoading(false);
                setArticle({...results.article, wiki_content: []});
                setContent(results.article.wiki_content);
                setImages(getImages);
                setMenuContent(getParagraph);

            } catch(error) {
                setIsExist(false);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <Menu wikiTitle={article.title} selected={getCategory} menuContent={menuContent}  />
            <Loading show={loading} position={"static"} />
            <Activity mode={!isExist && isExist !== undefined ? "visible" : "hidden"}>
                <NotFound />
            </Activity>

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

            <div className={`box mx-3 p-5 border
                            ${isExist ? "block" : "hidden"}
                            ${
                                content[0]?.type.includes("heading-type") && "border-b-0" ||
                                content[0]?.type.includes("table-type") && "border-b-0"
                            }`}>
                <img
                    src={article.cover || null}
                    alt={article.title}
                    onClick={() => {
                        setShowed(article.cover);
                        setImageContainer(true);
                    }}
                    className="w-full cursor-pointer" />
            </div>

            <div>
                {content.map((item, idx) => (
                    <ContentParser
                        key={idx}
                        index={idx}
                        content={content}
                        block={item}
                        setImageContainer={setImageContainer}
                        setShowed={setShowed}
                        menuContent={menuContent} />
                ))}
            </div>

            <ImageContainer
                images={images}
                showed={showed}
                setShowed={setShowed}
                display={imageContainer}
                setDisplay={setImageContainer} />
                
            <Footer />
        </>
    );
}

export default WikiPage;