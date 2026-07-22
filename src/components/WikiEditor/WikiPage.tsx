import Menu from "../Menu";
import Loading from "../Loading";
import NotFound from "../NotFound";
import TitleBox from "./Components/TitleBox";
import PageImageCover from "./Components/PageImageCover";
import ContentParser from "./Components/ContentParser";
import ImageContainer from "./Components/ImageContainer";
import Footer from "../Footer";

import { Schema, ResObject, API } from "../../utils/typesUtils";
import { getCategoryById, checkAndRegisterViewWithCookie } from "../../utils/articleUtils";
import { increaseArticleVisited } from "../../utils/databaseUtils";

import { ReactElement, Activity, useState, useEffect, useMemo } from "react";
import { Params, useParams } from "react-router-dom";
import "../../css/DynamicPage.css";

function WikiPage(): ReactElement {

    // get the category name and content id
    const { categoryName, contentId }: Params<string> = useParams<string>();
    const getCategory: string = (categoryName as string).split(":")[1];
    
    // Essential data variables
    const [article, setArticle] = useState<ResObject>({});
    const [content, setContent] = useState<Schema>([]);

    // Get only image types content
    const images: Schema = useMemo<Schema>(() => {
        const imgArray: ResObject[] = content.filter((img: ResObject) => img.type === "image-type");
        imgArray.unshift({ url: article.cover, description: article.title });
        return imgArray;
    }, [content]);
    // Get only paragraph type contents
    const menuContent: Schema = useMemo<Schema>(() => content.filter((para: ResObject) => para.type === "paragraph-type"), [content]);

    // Boolean state variables
    const [loading, setLoading] = useState<boolean>(true);
    const [isExist, setIsExist] = useState<boolean | undefined>(undefined);
    const [imageContainer, setImageContainer] = useState<boolean>(false);

    const [showed, setShowed] = useState<string>("");

    const processToIncreaseView = async (): Promise<void> => {
        const splitedId: string[] = (contentId as string).split("-"); // Split content id to get its category id
        const getCat: string = getCategoryById(splitedId[splitedId.length - 1]); // Get category in the last index of splited id

        // Check if content id is not undefined and its value is not empty
        if (contentId) {
            // Check and register view with cookie if not exist
            const isNewVisit: boolean = checkAndRegisterViewWithCookie(contentId as string);
            if (isNewVisit) {
                // If new visit, increase the visited value of current article
                await increaseArticleVisited(contentId as string, getCat.toLowerCase());
            }
        }
    }

    useEffect(() => {
        
        const fetchData = async () => {
            setLoading(true);
            await processToIncreaseView(); // Check if article is already visited and process increasing visited value

            let convertedName: string = getCategory.toLowerCase();
            // Convert plural name to singular name
            if (convertedName.includes("ies")) convertedName = convertedName.replaceAll("ies", "y");
            else convertedName = convertedName.slice(0, convertedName.length - 1);

            try {
                // Fetch request to backend server
                const response: Response = await fetch(`${API}/api/v1/wiki/${convertedName}/${contentId}`);
                // If response is not ok, throw error
                if (!response.ok) throw new Error(`${response}`);

                // Initialize successful response data in json object
                const result: ResObject = await response.json();

                setIsExist(true);
                setLoading(false);
                setArticle((prev: ResObject) => {
                    const cloneArticle: ResObject = { ...result.article } // Clone article object from response result
                    delete cloneArticle["wiki_content"]; // Delete article wiki content because it already has its own state variable
                    return cloneArticle; // Return the filtered clone article
                });
                setContent(result.article.wiki_content); // Set the content state with schema from result article contents

            } catch(error) {
                setIsExist(false);
                setLoading(false);
                console.error(error);
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
            <TitleBox isExist={isExist} article={article} />
            <PageImageCover isExist={isExist} article={article} content={content[0]} states={{ setShowed, setImageContainer }} />
            <div className="whitespace-pre-wrap">
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