import Menu from "../Menu";
import ContentBlock from "./ContentBlock"; 
import ContentToolbar from "./ContentToolbar";
import NotFound from "../NotFound";
import Footer from "../Footer";
import { Activity, useState, useEffect, ReactElement } from "react";
import { Link, Params, useParams } from "react-router-dom";
import { handleInputChange, getCategory, updateArticle, deleteCloudAssets, deleteArticleWiki } from "./ContributionUtils";
import "../../css/DynamicPage.css";

function ContributionEditPage(): ReactElement {

    const { contentId }: Params<string> = useParams();
    const splitedId: string[] = (contentId as string).split("-"); // Split text with '-' separator

    // Set state variables
    const [data, setData] = useState<Record<string, any>>({}); // Article informations
    const [schema, setSchema] = useState<Record<string, any>[]>([]); // Array of article schema to be edited
    const [isExist, setIsExist] = useState<boolean>(false); // Check if article id is exist
    const [toDelete, setToDelete] = useState<Record<string, any>[]>([]); // Array of assets to be deleted
    const [deleteInput, setDeleteInput] = useState<string>(""); // Confirmation before deleting
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false); // Loading after pressing delete button
    const [deleteContainer, setDeleteContainer] = useState<boolean>(false); // Show delete confirmation container

    // Get the site main theme from browser local storage
    const [light, setLight] = useState<boolean>("light" === localStorage.getItem("technoinc-theme"));

    // Modify image type content from db
    const modifiedSchema = (rawData: Record<string, any>[]) => {
        for (let i: number = 0; i < rawData.length; i++) {

            if (rawData[i].type === "image-type") {
                rawData[i] = { ...rawData[i], raw_file: "", prev_url: "" }
            }
        }

        return rawData;
    }

    useEffect(() => {
        // Get wiki article from db
        const fetchData = async () => {
            const API: string = import.meta.env.VITE_API;
            const category: string = getCategory(splitedId[splitedId.length - 1]).toLowerCase();

            try {
                // Get article from category & article is
                const response: Response = await fetch(`${API}/api/v1/wiki/${category}/${contentId}`)
                const result: Record<string, any> = await response.json();
                const articleFront: Record<string, any> = { ...result.article };
                delete articleFront["wiki_content"];

                setIsExist(true);
                setData(articleFront);
                setSchema(modifiedSchema(result.article.wiki_content));

            } catch (error) {
                setIsExist(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        setDeleteInput("")
        // Set body overflow property
        document.body.style.overflow = deleteContainer ? "hidden" : "visible";
    }, [deleteContainer]);

    return (
        <>
            <Menu wikiTitle="Contribution" setLight={setLight} />

            <div className="w-full mb-[5em] p-3 flex justify-between items-center sticky top-0 text-white bg-yellow-600">
                <p className="font-bold">Edit Mode</p>
                <Link title="Exit edit mode" to="/contribution" replace className="cursor-pointer text-white">
                    <i className="fa-solid fa-xmark"></i>
                </Link>
            </div>

            {!isExist && <NotFound />}

            <div className={`w-full p-3 flex-col items-center justify-center gap-3 rounded-[5px] shadow-2xs shadow-black text-black
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
                        editMode={true}
                        setToDelete={setToDelete} />
                ))}
            </div>

            <button
                title="Update article"
                onClick={async () => {
                    const update: any = await updateArticle(getCategory(splitedId[splitedId.length - 1]).toLowerCase(), data.id, schema);

                    if (update) {
                        window.location.replace(`/wiki/Category:${getCategory(splitedId[splitedId.length - 1], true)}/${contentId}`);
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
                        onClick={() => setDeleteContainer(false)}
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
                    <div className="w-full mt-5 flex justify-end items-center gap-3
                                    [&>button]:p-2 [&>button]:font-bold [&>button]:outline-none [&>button]:rounded-[5px]
                                    [&>button]:border-solid [&>button]:text-white">
                        <button
                            onClick={() => setDeleteContainer(false)}
                            className="border-gray-300 bg-gray-500 transition-colors duration-150 ease-in-out hover:bg-gray-400">Cancel</button>
                        <button
                            onClick={async () => {
                                if (deleteInput !== contentId) return;
                                if (deleteLoading) return;

                                setDeleteLoading(true);
                                await deleteCloudAssets(data.public_id, schema.filter(item => item.type === "image-type"));
                                await deleteArticleWiki(getCategory(splitedId[splitedId.length - 1]).toLowerCase(), contentId);

                                setDeleteLoading(false);
                                setDeleteContainer(false);
                                window.location.replace(`/wiki/Category:${getCategory(splitedId[splitedId.length - 1], true)}`);
                            }}
                            className={`${deleteInput !== contentId && "cursor-not-allowed"} border-gray-300 bg-gray-300
                                        ${deleteInput === contentId && "border-red-700 bg-red-500 hover:bg-red-400"} transition-colors duration-150 ease-in-out`}>Delete Article</button>
                    </div>
                </div>
            </div>

            <Activity mode={isExist ? "visible" : "hidden"}>
                <ContentToolbar setSchema={setSchema} light={light} />
            </Activity>
            <Footer />
        </>
    );
}

export default ContributionEditPage;