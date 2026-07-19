// Sub components
import Menu from "../Menu";
import Loading from "../Loading";
import ModifyBox from "./Components/ModifyBox";
import ArticleForm from "./Components/ArticleForm";
import InspireBox from "./Components/InspireBox";
import ContentBlock from "./Components/ContentBlock";
import ContentToolbar from "./Components/ContentToolbar";
import Footer from "../Footer";

// Supporting utilities
import { ArticleConfig, ResObject } from "../../utils/typesUtils";
import { getCategoryById, handleInputChange } from "../../utils/articleUtils";
import uploadArticleInit from "../../utils/ArticleOperations/uploadUtils";
import "../../css/DynamicPage.css";

// React built-in utilities
import { ReactElement, Activity, useState, useEffect } from "react";
import { Id, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContributionPage(): ReactElement {

    // Template for creating new article
    const [article, setArticle] = useState<ArticleConfig>({
        id: "", // Article id
        title: "", // Article title
        category: "Civilization", // Default value
        cover: "", // Article image cover
        public_id: "", // Article image cover public id
        raw_cover: undefined, // Temporary
        visited: 0,
        wiki_content: [] // Array of article contents
    });

    const [schema, setSchema] = useState<ResObject[]>([]); // Schema that contains object of contents
    const [search, setSearch] = useState<boolean>(false); // If search button in Menu component is clicked
    const [loading, setLoading] = useState<boolean>(false); // Loading state to wait validating something

    // State varble for getting current site theme from local storage
    const [light, setLight] = useState<boolean>("light" === localStorage.getItem("technoinc-theme"));

    // Toast success
    const successToastNotify = (): Id => toast.success("Sussess!", {
        className: `!shadow-2xs !shadow-black ${light ? "!text-black !bg-white" : "!text-white !bg-gray-700"}`
    });
    // Toast warning
    const errorToastNotify = (content: string): Id => toast.error(content, {
        className: `!shadow-2xs !shadow-black ${light ? "!text-black !bg-white" : "!text-white !bg-gray-700"}`
    });

    useEffect(() => {
        document.body.style.overflow = loading ? "hidden" : "visible";
    }, [loading]);

    return (
        <>
            <Menu wikiTitle="Contribution" contribution={false} search={search} setSearch={setSearch} setLight={setLight} />
            <ModifyBox search={search} />
            <Loading show={loading} position="fixed" />
            <ArticleForm article={article} light={light} states={{setArticle}} />
            <Activity mode={schema.length === 0 ? "visible" : "hidden"}>
                <InspireBox />
            </Activity>
            <div className={`mt-[3em] flex flex-col gap-[2em] rounded-[10px]
                            [&>.content-box]:m-[1em] [&>.content-box]:pl-[1em] [&>.content-box]:flex
                            [&>.content-box]:flex-col [&>.content-box]:items-center [&>.content-box]:gap-3
                            [&>.content-box]:border-l-5 [&>.content-box]:border-[rgb(0,175,255)]
                            [&>.content-box]:has-[.delete-btn:hover]:bg-red-200
                            [&>.content-box]:transition-colors [&>.content-box]:duration-200 [&>.content-box]:ease-in-out
                            ${light ? "bg-white/70 [&_span]:text-black/20"
                                    : `bg-gray-700/50 [&_span]:text-white/20 [&_label]:border-white [&_textarea]:text-white
                                    [&_label]:bg-gray-700 [&_textarea]:bg-gray-700 [&_button]:text-white`}`}>
                {schema.map((block, idx) => (
                    <ContentBlock
                        key={idx}
                        index={idx}
                        block={block}
                        schema={schema}
                        setSchema={setSchema}
                        onChangeHandler={handleInputChange} />
                ))}
            </div>
            <button
                title="Upload article"
                style={{display: schema.length === 0 ? "none" : "block"}}
                onClick={async () => {
                    setLoading(true); // Set loading to true
                    // Await to validate all things before uploading
                    const validate: any = await uploadArticleInit(article, schema, { setArticle, setSchema });
                    if (validate.passed) { // If all validation is success
                        successToastNotify();
                        setTimeout(() => {
                            setLoading(false);
                            window.location.replace(`/wiki/Category:${getCategoryById(article.id, true)}/${article.id}`);
                        }, 3000);
                    } else { // If something isn't valid when validating
                        errorToastNotify(validate.message);
                        setLoading(false);
                    }
                }}
                className="w-[40%] mt-5 mr-auto ml-auto p-2 font-bold text-[1.2em] block rounded-[5px]
                            text-white border-none bg-[rgb(0,175,255)]
                            hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                Upload
            </button>

            <ContentToolbar setSchema={setSchema} light={light} />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                stacked={false}
                limit={1}
                pauseOnFocusLoss
                pauseOnHover />
            <Footer />
        </>
    )
}

export default ContributionPage;