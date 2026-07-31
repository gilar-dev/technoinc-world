// Sub components
import Menu from "../Menu";
import Loading from "../Loading";
import ModifyBox from "./Components/ModifyBox";
import ArticleForm from "./Components/ArticleForm";
import TextEditor from "./Components/TextEditor";
import InspireBox from "./Components/InspireBox";
import ContentBlock from "./Components/ContentBlock";
import ContentToolbar from "./Components/ContentToolbar";
import BlockMenu from "./Components/BlockMenu";
import Footer from "../Footer";
import "../../css/DynamicPage.css";

// Supporting utilities
import { ArticleConfig, ResObject, Schema } from "../../utils/typesUtils";
import { Config } from "../../utils/contextUtils";
import { getCategoryById, handleInputChange } from "../../utils/articleUtils";
import uploadArticleInit from "../../utils/ArticleOperations/uploadUtils";

// React built-in utilities
import { ReactElement, Activity, useState, useEffect, useRef } from "react";
import { Id, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContributionPage(): ReactElement {

    // Template for creating new article
    const [article, setArticle] = useState<ArticleConfig>({
        id: "", // Article id
        title: "", // Article title
        description: "", // Brief article description
        category: "Civilization", // Article category default value
        cover: "", // Article image cover
        public_id: "", // Article image cover public id
        raw_cover: undefined, // Temporary
        visited: 0, // Article total visited (0 as start)
        wiki_content: [] // Array of article contents
    });

    const [schema, setSchema] = useState<Schema>([]); // Schema that contains object of contents
    const [search, setSearch] = useState<boolean>(false); // If search button in Menu component is clicked
    const [loading, setLoading] = useState<boolean>(false); // Loading state to wait validating something
    const [blockMenu, setBlockMenu] = useState<boolean>(false);
    const [blockIndex, setBlockIndex] = useState<number | undefined>(undefined);
    const [blockUsed, setBlockUsed] = useState<ResObject[]>([]);

    // Create reference to schema div element
    const schemaElement = useRef<HTMLDivElement | null>(null);

    // State variable for getting current site theme from local storage
    const [light, setLight] = useState<boolean>("light" === localStorage.getItem("technoinc-theme"));

    // Toast success
    const successToastNotify = (content: string): Id => toast.success(content, {
        className: `shadow-2xs! shadow-black! ${light ? "text-black! bg-white!" : "text-white! bg-gray-700!"}`
    });
    // Toast warning
    const errorToastNotify = (content: string): Id => toast.error(content, {
        className: `shadow-2xs! shadow-black! ${light ? "text-black! bg-white!" : "text-white! bg-gray-700!"}`
    });

    useEffect(() => {
        // Set body overflow style property based on loading state
        document.body.style.overflow = loading ? "hidden" : "visible";
    }, [loading]);

    useEffect(() => {
        const titleTag: HTMLTitleElement = document.getElementsByTagName("title")[0];
        titleTag.textContent = "Contribution - TechnoInc MC Wiki";
    }, []);

    return (
        <Config.Provider value={{ light, setSchema, blockMenu, setBlockMenu, blockIndex, setBlockIndex, blockUsed, setBlockUsed }}>
            <Menu wikiTitle="Contribution" contribution={false} search={search} setSearch={setSearch} setLight={setLight} />
            <ModifyBox search={search} />
            <Loading show={loading} position="fixed" />
            <ArticleForm article={article} light={light} states={{setArticle}} />
            <Activity mode={schema.length === 0 ? "visible" : "hidden"}>
                <InspireBox />
            </Activity>
            <div
                ref={schemaElement}
                className={`schema mt-[3em] flex flex-col gap-[2em] rounded-[10px]
                            [&>.content-box]:m-[1em] [&>.content-box]:pl-[1em] [&>.content-box]:flex
                            [&>.content-box]:flex-col [&>.content-box]:items-center [&>.content-box]:gap-3
                            [&>.content-box]:border-l-5 [&>.content-box]:border-[rgb(0,175,255)]
                            [&>.content-box]:has-[.delete-btn:hover]:bg-red-200
                            [&>.content-box]:transition-colors [&>.content-box]:duration-200 [&>.content-box]:ease-in-out
                            ${light ? "bg-white/70 [&_span]:text-black/20"
                                    : `bg-gray-700/50 [&_span]:text-white/20 [&_label]:border-white [&_textarea]:text-white
                                    [&_label]:bg-gray-700 [&_textarea]:bg-gray-700 [&_button]:text-white`}`}>
                {schema.map((block: ResObject, index: number) => (
                    <ContentBlock
                        key={index}
                        index={index}
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
                    if (loading) return; // If it's still in loading process, return
                    setLoading(true); // Set loading to true
                    // Await to validate all things before uploading
                    const validate: any = await uploadArticleInit(article, schema, { setArticle, setSchema });
                    if (validate.passed) { // If all validation is success
                        successToastNotify(validate.message);
                        // Set delay before redirecting to the page
                        setTimeout(() => {
                            setLoading(false);
                            // Redirect to created article
                            window.location.replace(`/wiki/Category:${getCategoryById(article.id, true)}/${article.id}`);
                        }, 3000);
                    } else { // If something isn't valid when validating
                        setLoading(false);
                        if (validate.index === undefined) errorToastNotify(validate.message);
                        else {
                            if (!schemaElement.current) return; // Check if schema element ref is undefined and return
                            errorToastNotify(`${validate.message} at content ${validate.index + 1}`);
                            // Get all children of schema container parent element
                            const children: HTMLCollection = schemaElement.current.children;
                            // Scroll to invalid content value index
                            children[validate.index].scrollIntoView({ behavior: "smooth", block: "center" });
                            // Set the invalid content 'is_empty' property to true
                            handleInputChange(validate.index, "is_empty", true, setSchema);
                        }
                    }
                }}
                className="w-[40%] mt-5 mr-auto ml-auto p-2 font-bold text-[1.2em] block rounded-[5px]
                            text-white border-none bg-[rgb(0,175,255)]
                            hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                Upload
            </button>

            <ContentToolbar setSchema={setSchema} light={light} />
            <BlockMenu />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                stacked={false}
                limit={1}
                pauseOnFocusLoss
                pauseOnHover />
            <Footer />
        </Config.Provider>
    )
}

export default ContributionPage;