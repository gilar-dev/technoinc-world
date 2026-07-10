import Menu from "../Menu";
import ContentBlock from "./ContentBlock"; 
import ContentToolbar from "./ContentToolbar";
import Footer from "../Footer";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { handleInputChange, getCategory, uploadToCloudStorage, updateArticle, deleteCloudAssets, deleteArticleWiki } from "./ContributionUtils";
import PropTypes from "prop-types";
import "../../css/DynamicPage.css";

function ContributionEditPage() {

    const { contentId } = useParams();
    const splitedId = contentId.split("-"); // Split text with '-' separator

    // 'true' if current theme is light, else 'false'
    const light = "light" === localStorage.getItem("technoinc-theme");

    // Set state variables
    const [data, setData] = useState({});
    const [schema, setSchema] = useState([]);
    const [deleteInput, setDeleteInput] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteContainer, setDeleteContainer] = useState(false);

    useEffect(() => {
        // Get wiki article from db
        const fetchData = async () => {
            const API = import.meta.env.VITE_API;
            const category = getCategory(splitedId[splitedId.length - 1]).toLowerCase();

            try {
                // Get article from category & article is
                const response = await fetch(`${API}/api/v1/wiki/${category}/${contentId}`)
                const result = await response.json();
                const articleFront = { ...result.article };
                delete articleFront["wiki_content"];

                setData(articleFront);
                setSchema(result.article.wiki_content);

            } catch (error) {
                console.error(error);
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
        <Menu wikiTitle="Contribution" />

        <div className="w-full p-3 flex justify-between items-center fixed text-white bg-yellow-600">
            <p className="font-bold">Edit Mode</p>
            <Link title="Exit edit mode" to="/contribution" replace className="cursor-pointer text-white">
                <i className="fa-solid fa-xmark"></i>
            </Link>
        </div>

        <div className="w-full mt-[5em] p-3 flex flex-col items-center justify-center gap-3 rounded-[5px] shadow-2xs shadow-black text-black bg-[rgb(220,220,220)]">
            <img
                src={data.cover || null}
                alt={data.title}
                className="w-[80%]" />
            <h3>{data.title}</h3>
            <p>{data.id}</p>
            <p className="text-[.8em]">{data.category}</p>
        </div>

        <div className="mt-[3em] flex flex-col gap-[2em] rounded-[10px] bg-[rgb(220,220,220)]
                        [&>.content-box]:m-[1em] [&>.content-box]:pl-[1em] [&>.content-box]:flex
                        [&>.content-box]:flex-col [&>.content-box]:items-center [&>.content-box]:gap-3
                        [&>.content-box]:border-l-5 [&>.content-box]:border-[rgb(0,175,255)]
                        [&>.content-box]:has-[.delete-btn:hover]:bg-red-200">
            {schema.map((block, idx) => (
                <ContentBlock
                    key={idx}
                    index={idx}
                    block={block}
                    schema={schema}
                    setSchema={setSchema}
                    cloudStorage={uploadToCloudStorage}
                    onChangeHandler={handleInputChange} />
            ))}
        </div>

        <button
            title="Update article"
            style={{display: schema.length === 0 ? "none" : "block"}}
            onClick={async () => {
                const update = await updateArticle(getCategory(splitedId[splitedId.length - 1]).toLowerCase(), data.id, schema);

                if (update) {
                    window.location.replace(`/wiki/Category:${getCategory(splitedId[splitedId.length - 1], true)}/${contentId}`);
                }
            }}
            className="w-[40%] mt-5 mx-auto p-2 font-bold text-[1.2em] block rounded-[5px]
                        text-white border-none bg-yellow-600
                        hover:bg-yellow-500 active:text-yellow-600 active:bg-white">
            Update
        </button>

        <button
            title="Delete article"
            onClick={() => setDeleteContainer(true)}
            className="w-[40%] mt-5 mx-auto p-3 font-bold text-[1em] block outline-none rounded-[5px] border-none text-white bg-red-500
                        hover:bg-red-600 active:text-red-500 active:bg-white">
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
                            await deleteCloudAssets(data.public_id, schema);
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

        <ContentToolbar setSchema={setSchema} />
        <Footer />
        </>
    );
}

ContributionEditPage.propTypes = {
    article: PropTypes.string.isRequired
}

export default ContributionEditPage;