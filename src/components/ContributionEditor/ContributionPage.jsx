import Menu from "../Menu";
import Footer from "../Footer";
import ContentBlock from "./ContentBlock";
import ContentToolbar from "./ContentToolbar";
import ModifyBox from "./ModifyBox";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { generateId, checkArticleId, uploadToCloudStorage, checkAllValues } from "./ContributionUtils";
import "../../css/DynamicPage.css";

function ContributionPage() {

    // Template for creating new article
    const [article, setArticle] = useState({
        id: "",
        title: "",
        category: "Civilization",
        cover: "",
        raw_cover: "", // Temporary
        wiki_content: []
    });

    // Schema for making dynamic content block
    const [schema, setSchema] = useState([]);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (index, property, value) => {
        setSchema(prev => {
            const updatedSchema = [...prev];

            updatedSchema[index][property] = value;

            return updatedSchema;
        });
    }

    // Add new content to list of content blocks
    const addNewContent = (block) => {
        setSchema(prev => [...prev, block]);
        scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    // Add new table block for table-typed content only
    const addNewTable = (index, block) => {
        setSchema(prev => [...prev].toSpliced(index + 1, 0, block));
    }

    // Move content to up-down and reordering
    const moveContent = (currentIndex, direction) => {
        if (schema.length <= 1) return;

        // Get the targeted index
        let targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        setSchema((prev) => {
            // Store current schema and content
            const updatedSchema = [...prev];
            const currentContent = updatedSchema[currentIndex];

            // Check if index out of range
            if (targetIndex < 0) targetIndex = updatedSchema.length - 1;
            else if (targetIndex > updatedSchema.length - 1) targetIndex = 0;

            // Reordering contents by swaping contents
            updatedSchema[currentIndex] = updatedSchema[targetIndex];
            updatedSchema[targetIndex] = currentContent;

            return updatedSchema;
        });
    }

    // Delete content from list of content blocks
    const deleteContent = (index) => {
        setSchema((prev) => ([...prev].toSpliced(index, 1)));
    }

    return (
        <>
        <Menu wikiTitle="Contribution" contribution={false} search={search} setSearch={setSearch} />
        <ModifyBox search={search} />

        <div
            style={{display: loading ? "flex" : "none"}}
            className="w-full h-screen flex justify-center items-center fixed z-1 bg-black/30">
            <div className="w-[50%] p-3 flex flex-col items-center justify-center gap-y-5 rounded-[5px] bg-black/50">
                <div className="w-[20%] aspect-square bg-[url('/assets/icons/loading-pixel.gif')] bg-center bg-cover bg-no-repeat"></div>
                <h3 className="font-['Pixelify_Sans'] text-center text-white">Uploading your article!</h3>
            </div>
        </div>

        <div className="mt-[3em] p-[1em] flex flex-col gap-[2em] rounded-[10px] border-t-10
                        shadow-2xs shadow-black border-[rgb(0,175,255)] bg-[rgb(220,220,220)]">
            <textarea
                type="text"
                placeholder="Article title"
                value={article.title}
                onChange={e => setArticle(prev => (
                    {
                        ...prev,
                        id: generateId(e.target.value, prev.category), 
                        title: e.target.value
                    }
                ))}
                className="p-1 min-h-2 font-['Montserrat'] font-bold text-3xl field-sizing-content resize-none
                            outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />

            <input
                type="text"
                placeholder="Article id"
                value={article.id}
                readOnly
                className="p-1 font-bold outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />

            <div className="flex items-centers gap-3">
                <h3 className="text-black">Select category:</h3>
                <select
                    onChange={e => setArticle(prev => (
                        {
                            ...prev,
                            id: generateId(prev.title, e.target.value),
                            category: e.target.value
                        }
                    ))}
                    className="w-full pl-2.5 font-bold outline-none rounded-2xl border-none [&>option]:font-bold">
                    <option value="Civilization">Civilization</option>
                    <option value="Character">Character</option>
                    <option value="Ideology">Ideology</option>
                    <option value="Organization">Organization</option>
                    <option value="Party">Party</option>
                    <option value="Town">Town</option>
                    <option value="Lore">Lore</option>
                </select>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
                <h2 className="text-black/40">Article Cover</h2>
                <img
                    src={article.cover || null}
                    className="w-full rounded-[5px]" />
                <input
                    id="article-cover"
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (!selectedFile) return;

                        const preview = URL.createObjectURL(selectedFile);

                        setArticle(prev => ({
                            ...prev,
                            cover: preview,
                            raw_cover: selectedFile
                        }));
                    }} />
                <label
                    htmlFor="article-cover"
                    className="p-3 font-bold self-start rounded-2xl text-white bg-[rgb(0,175,255)]
                                hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                    Select Cover
                </label>
            </div>
        </div>

        <div
            style={{display: schema.length === 0 ? "block" : "none"}}
            className="mt-[3em] mx-3 p-3 font-['Pixelify_Sans'] text-center flex flex-col
                        items-center justify-center rounded-[10px] border-3
                        text-white border-purple-600 bg-purple-800/50">
            <h1>The Story is All Yours!</h1>
            <p>Click tools bellow to start creating your own story!</p>
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
                    buttons={{
                        moveContent: moveContent,
                        addNewTable: addNewTable,
                        deleteContent: deleteContent
                    }}
                    cloudStorage={uploadToCloudStorage}
                    onChangeHandler={handleInputChange} />
            ))}
        </div>
        
        <button
            title="Upload article"
            style={{display: schema.length === 0 ? "none" : "block"}}
            onClick={() => {
                setLoading(true);
                checkAllValues(schema, setSchema, article, setArticle, setLoading);
            }}
            className="w-[40%] mt-5 mr-auto ml-auto p-2 font-bold text-[1.2em] block rounded-[5px]
                        text-white border-none bg-[rgb(0,175,255)]
                        hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
            Upload
        </button>

        <ContentToolbar addNewContent={addNewContent} />
        <Footer />
        </>
    )
}

export default ContributionPage;