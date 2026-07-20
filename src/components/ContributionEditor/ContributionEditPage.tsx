// Sub components
import Menu from "../Menu";
import Loading from "../Loading";
import NotFound from "../NotFound";
import ContentBlock from "./Components/ContentBlock"; 
import ContentToolbar from "./Components/ContentToolbar";
import Footer from "../Footer";

// Supporting utilites
import { PublicID, ResObject, API } from "../../utils/typesUtils";
import { handleInputChange, getCategoryById } from "../../utils/articleUtils";
import updateArticleInit from "../../utils/ArticleOperations/updateUtils";
import deleleArticleInit from "../../utils/ArticleOperations/deleteUtils";
import "../../css/DynamicPage.css";

// React built-in utilities
import { Activity, useState, useEffect, ReactElement } from "react";
import { Link, Params, useParams } from "react-router-dom";
import { Id, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContributionEditPage(): ReactElement {

    const { contentId }: Params<string> = useParams<string>(); // Get dynamic 'contentid' url
    const splitedId: string[] = (contentId as string).split("-"); // Split text with '-' separator

    // Set state variables
    const [data, setData] = useState<ResObject>({}); // Article informations
    const [schema, setSchema] = useState<ResObject[]>([]); // Array of article schema to be edited
    const [loading, setLoading] = useState<boolean>(false);
    const [isExist, setIsExist] = useState<boolean | undefined>(undefined); // Check if article id is exist
    const [toDelete, setToDelete] = useState<PublicID>([]); // Array of assets to be deleted
    const [deleteInput, setDeleteInput] = useState<string>(""); // Confirmation before deleting
    const [deleteContainer, setDeleteContainer] = useState<boolean>(false); // Show delete confirmation container

    // Get the site main theme from browser local storage
    const [light, setLight] = useState<boolean>("light" === localStorage.getItem("technoinc-theme"));

    // Toast success
    const successToastNotify = (message: string): Id => toast.success(message, {
        className: `!shadow-2xs !shadow-black ${light ? "!text-black !bg-white" : "!text-white !bg-gray-700"}`
    });
    // Toast error
    const errorToastNotify = (message: string): Id => toast.error(message, {
        className: `!shadow-2xs !shadow-black ${light ? "!text-black !bg-white" : "!text-white !bg-gray-700"}`
    });
    

    // Modify image type content from database
    const modifiedSchema = (rawData: ResObject[]) => {
        for (let index: number = 0; index < rawData.length; index++) {
            if (rawData[index].type === "image-type") {
                rawData[index] = { ...rawData[index], raw_file: "", prev_url: "" }
            }
        }
        return rawData;
    }

    useEffect(() => {
        // Get wiki article from db
        const fetchData = async () => {
            const category: string = getCategoryById(splitedId[splitedId.length - 1]).toLowerCase();

            try {
                // Get article from category & article is
                const response: Response = await fetch(`${API}/api/v1/wiki/${category}/${contentId}`)
                if (!response.ok) throw new Error(`${response}`);

                const result: ResObject = await response.json();
                const articleFront: ResObject = { ...result.article };
                delete articleFront["wiki_content"];

                // Set data from fetch result to state variables
                setIsExist(true);
                setData(articleFront);
                setSchema(modifiedSchema(result.article.wiki_content));

            } catch (error) {
                setIsExist(false);
                console.log(error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // Reset delete input valiidation when delete container is false
        if (!deleteContainer) setDeleteInput("");
        // Set body overflow property
        document.body.style.overflow = deleteContainer || loading ? "hidden" : "visible";
    }, [deleteContainer, loading]);

    return (
        <>
            <Menu wikiTitle="Contribution" setLight={setLight} />
            <div className="w-full mb-[5em] p-3 flex justify-between items-center sticky top-[3.7em] text-white bg-yellow-600">
                <p className="font-bold">Edit Mode</p>
                <Link title="Exit edit mode" to="/contribution" replace className="cursor-pointer text-white">
                    <i className="fa-solid fa-xmark"></i>
                </Link>
            </div>
            <Activity mode={isExist !== undefined && !isExist ? "visible" : "hidden"}>
                <NotFound />
            </Activity>
            <div className={`w-full p-3 flex-col items-center justify-center gap-3 rounded-[5px] shadow-2xs shadow-black text-black
                            [&_h3,&_p]:text-center
                            ${isExist ? "flex" : "hidden"}
                            ${light ? "bg-white/70" : "text-white bg-gray-700/50"}`}>
                <img
                    src={data.cover || null}
                    alt={data.title}
                    className="w-[80%] border border-white" />
                <h3>{data.title}</h3>
                <p>{data.id}</p>
                <p className="text-[.8em]">{data.category}</p>
            </div>
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
                        onChangeHandler={handleInputChange}
                        setToDelete={setToDelete} />
                ))}
            </div>

            <Loading show={loading} position="fixed" />

            <button
                title="Update article"
                onClick={async () => {
                    setLoading(true);
                    const update: any = await updateArticleInit(contentId as string, getCategoryById(contentId as string), {
                        schema: schema,
                        pendingDelete: toDelete
                    });
                    if (update.passed) {
                        successToastNotify(update.message);
                        setTimeout(() => {
                            setLoading(false);
                            window.location.replace(`/wiki/Category:${getCategoryById(contentId as string, true)}/${contentId}`);
                        }, 3000);
                    } else {
                        errorToastNotify(update.message);
                        setLoading(false);
                    }
                }}
                className={`${schema.length === 0 ? "hidden" : "block"}
                            w-[40%] mt-5 mx-auto p-2 font-bold text-[1.2em] block rounded-[5px]
                            text-white border-none bg-yellow-600
                            hover:bg-yellow-500 active:text-yellow-600 active:bg-white
                            transition-colors duration-150 ease-in-out`}>
                Update
            </button>

            <button
                title="Delete article"
                onClick={() => setDeleteContainer(true)}
                className={`w-[40%] mt-5 mx-auto p-3 font-bold text-[1em] block outline-none rounded-[5px] border border-red-500 text-white bg-red-500/50
                            hover:bg-red-600 active:text-red-500 active:bg-white transition-colors duration-150 ease-in-out
                            ${isExist ? "block" : "hidden"}`}>
                Delete
            </button>

            <div className={`w-full h-full ${deleteContainer ? "flex" : "hidden"} justify-center items-center fixed top-0 z-100 bg-blue-300/30`}>
                <div className={`max-w-[90%] min-h-[5em] p-7 relative rounded-[10px] shadow-2xs shadow-black1
                                ${light ? "text-black bg-white" : "text-white bg-gray-800"}`}>
                    <span
                        onClick={() => {
                            if (loading) return;
                            setDeleteContainer(false);
                        }}
                        className="text-[1.3em] absolute top-1 right-1">
                        <i className="fa-solid fa-xmark"></i>
                    </span>
                    <h2 className="inline-flex items-center gap-3">
                        <span className={`p-2 text-[.6em] rounded-full ${light ? "text-red-400 bg-red-500/30" : "text-white bg-red-800"}`}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </span>
                        Delete Article?
                    </h2>
                    <p className="mt-5 font-medium text-[.9em]">Are you sure you want to delete this article?</p>
                    <p className="mt-5 text-[.9em]">Type <strong>"{contentId}"</strong> to confirm your action</p>
                    <input
                        name="delete-input"
                        type="text"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        className="w-full mt-5 p-2 outline-blue-500 rounded-[5px]" />
                    <Loading show={loading} position="static" />
                    <div className="w-full mt-5 flex justify-end items-center gap-3
                                    [&>button]:p-2 [&>button]:font-bold [&>button]:outline-none [&>button]:rounded-[5px]
                                    [&>button]:border-solid [&>button]:text-white">
                        <button
                            onClick={() => setDeleteContainer(false)}
                            className="border-gray-300 bg-gray-500 transition-colors duration-150 ease-in-out hover:bg-gray-400">Cancel</button>
                        <button
                            onClick={async () => {
                                if (deleteInput !== contentId) return;
                                if (loading) return;

                                setLoading(true)
                                const result: any = await deleleArticleInit(contentId, getCategoryById(splitedId[splitedId.length - 1]).toLowerCase());

                                if (result.passed) {
                                    successToastNotify(result.message)
                                    setTimeout(() => {
                                        setLoading(false);
                                        setDeleteContainer(false);
                                        window.location.replace(`/wiki/Category:${getCategoryById(splitedId[splitedId.length - 1], true)}`);
                                    }, 3000);
                                } else {
                                    errorToastNotify(result.message)
                                    setLoading(false);
                                    setDeleteContainer(false);
                                }
                            }}
                            className={`${deleteInput !== contentId && "cursor-not-allowed"} border-gray-300 bg-gray-300
                                        ${deleteInput === contentId && "border-red-700 bg-red-500 hover:bg-red-400"} transition-colors duration-150 ease-in-out`}>Delete Article</button>
                    </div>
                </div>
            </div>

            <Activity mode={isExist ? "visible" : "hidden"}>
                <ContentToolbar setSchema={setSchema} light={light} />
            </Activity>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                stacked={true}
                limit={1}
                pauseOnFocusLoss
                pauseOnHover />
            <Footer />
        </>
    );
}

export default ContributionEditPage;