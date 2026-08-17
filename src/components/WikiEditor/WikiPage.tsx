import Menu from "../Menu";
import Loading from "../Loading";
import NotFound from "../NotFound";
import TitleBox from "./Components/TitleBox";
import ActionToolbar from "./Components/ActionToolbar";
import ContentParser from "./Components/ContentParser";
import WikiParser from "./Components/WIkiParser";
import ImageGallery from "./Components/ImageGallery";
import WikiInfo from "./Components/WikiInfo";
import Footer from "../Footer";

import { Schema, ResObject, API, ArticleConfig, ArticleTemplate } from "../../utils/typesUtils";
import { Config } from "../../utils/contextUtils";
import { checkAndRegisterViewWithCookie } from "../../utils/articleUtils";
import { increaseArticleVisited } from "../../utils/databaseUtils";

import { Activity, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "../../css/DynamicPage.css";

function WikiPage(): React.JSX.Element {

    // get the category name and content id
    const { contentID } = useParams<string>();

    // Set state variables
    const [articleData, setArticleData] = useState<ArticleConfig>(ArticleTemplate);
    const [showed, setShowed] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isExist, setIsExist] = useState<boolean | undefined>(undefined);

    // Get only paragraph type contents
    const menuContent = useMemo<Schema>(() => {
        const headings: Schema = articleData.wiki_content.filter((block: ResObject) => block.type.includes("heading"));
        return headings;
    }, [articleData]);

    // Get only image types content
    const getImages = useMemo<Schema>(() => {
        const imageArray: Schema = articleData.wiki_content.filter((block: ResObject) => block.type.includes("image"));
        return imageArray;
    }, [articleData]);


    // Boolean state variables
    const [imageGallery, setImageGallery] = useState<boolean>(false);
    const [light, setLight] = useState<boolean>("light" === localStorage.getItem("technoinc-theme"));

    const processToIncreaseView = async (): Promise<void> => {
        // Check if content id is not undefined and its value is not empty
        if (contentID) {
            // Check and register view with cookie if not exist
            const isNewVisit: boolean = checkAndRegisterViewWithCookie(contentID);
            if (isNewVisit) {
                // If new visit, increase the visited value of current article
                await increaseArticleVisited(contentID.toLowerCase());
            }
        }
    }

    useEffect(() => {
        if (!contentID) return;
        const filteredContentId = contentID.replaceAll("_", " ").toLowerCase();

        const fetchData = async () => {
            setLoading(true);
            await processToIncreaseView(); // Check if article is already visited and process increasing visited value
            try {
                // Fetch request to backend server
                const response: Response = await fetch(`${API}/api/v1/wiki/get/${filteredContentId}`);
                // If response is not ok, throw error
                if (!response.ok) throw new Error(`${response}`);

                // Initialize successful response data in json object
                const result: ResObject = await response.json();
                const titleTag: HTMLTitleElement = document.getElementsByTagName("title")[0];
                titleTag.textContent = `${result.article.title} - TechnoInc MC Wiki`;

                // Check if contentId does not equal to article title then redirected
                if (contentID.replaceAll("_", " ") !== result.article.title) {
                    window.location.replace(`/wiki/${result.article.title.replaceAll(" ", "_")}`);
                }

                setIsExist(true);
                setLoading(false);
                setArticleData(result.article);

            } catch (error) {
                setIsExist(false);
                setLoading(false);
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <Config.Provider value={{ light, menuContent, setShowed, setImageGallery }}>
            <Menu wikiTitle={articleData && articleData.title} menuContent={menuContent} setLight={setLight} />
            <Loading show={loading} position={"static"} />
            <Activity mode={!isExist && isExist !== undefined ? "visible" : "hidden"}>
                <NotFound />
            </Activity>
            <Activity mode={isExist ? "visible" : "hidden"}>
                <TitleBox article={articleData} />
                <ActionToolbar visited={articleData.visited} />
            </Activity>
            {articleData.wiki_content.map((block: ResObject, index: number) => (
                <ContentParser
                    key={index}
                    index={index}
                    content={articleData.wiki_content}
                    block={block}
                    menuContent={menuContent}
                    setShowed={setShowed}
                    setImageContainer={setImageGallery} />
            ))}
            <WikiParser schema={articleData.wiki_content} />
            <ImageGallery
                images={getImages}
                showed={showed}
                setShowed={setShowed}
                display={imageGallery}
                setDisplay={setImageGallery} />
            {articleData.history.length !== 0 &&
                <WikiInfo
                    articleTitle={articleData.title}
                    categories={articleData.category}
                    modifyInfo={articleData.history[articleData.history.length - 1]} />}
            <Footer />
        </Config.Provider>
    );
}

export default WikiPage;