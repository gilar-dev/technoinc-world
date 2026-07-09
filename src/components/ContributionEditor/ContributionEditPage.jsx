import Menu from "../Menu";
import ContentBlock from "./ContentBlock"; 
import ContentToolbar from "./ContentToolbar";
import Footer from "../Footer";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { handleInputChange, getCategory, uploadToCloudStorage, updateArticle, deleteArticle } from "./ContributionUtils";
import PropTypes from "prop-types";
import "../../css/DynamicPage.css";

function ContributionEditPage() {

    const { contentId } = useParams();
    const splitedId = contentId.split("-");
    const [data, setData] = useState({});
    const [schema, setSchema] = useState([]);
    const [deleteInput, setDeleteInput] = useState("");
    const [deleteContainer, setDeleteContainer] = useState(false);

    useEffect(() => {
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

        <div className={`w-full h-full ${deleteContainer ? "flex" : "hidden"} justify-center items-center fixed top-0 z-100 bg-red-300/30`}>
            <div className="max-w-[90%] min-h-[5em] p-7 relative rounded-[10px] border border-white bg-white shadow-2xs shadow-black">
                <span
                    onClick={() => setDeleteContainer(false)}
                    className="text-[1.3em] absolute top-1 right-1">
                    <i className="fa-solid fa-xmark"></i>
                </span>
                <h2>Delete Article?</h2>
                <p className="mt-5 font-medium text-[.9em]">Are you sure you want to delete this article?</p>
                <p className="mt-5 text-[.9em]">Type <strong>"{contentId}"</strong> to confirm your action</p>
                <input
                    name="delete-input"
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="w-full mt-5 p-2 outline-blue-500 rounded-[5px]" />
                <div className="w-full mt-5 flex justify-end items-center gap-3
                                [&>button]:p-2 [&>button]:cursor-pointer [&>button]:font-bold [&>button]:outline-none [&>button]:rounded-[5px]
                                [&>button]:border-solid [&>button]:text-white">
                    <button
                        onClick={() => setDeleteContainer(false)}
                        className="border-gray-300 bg-gray-500">Cancel</button>
                    <button
                        onClick={() => {
                            if (deleteInput !== contentId) return;
                            deleteArticle(data.public_id, schema);
                        }}
                        className={`border-gray-300 bg-gray-300 ${deleteInput === contentId && "border-red-700 bg-red-500"} transition-colors duration-75 ease-in-out`}>Delete Article</button>
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