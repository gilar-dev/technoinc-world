import Menu from "../Menu";
import Footer from "../Footer";
import ContentBlock from "./ContentBlock";
import ContentToolbar from "./ContentToolbar";
import ModifyBox from "./ModifyBox";
import { useState, useEffect } from "react";
import { handleInputChange, generateId, checkAllValues } from "./ContributionUtils";
import "../../css/DynamicPage.css";
import Loading from "../Loading";

function ContributionPage() {

    // Template for creating new article
    const [article, setArticle] = useState<Record<string, any>>({
        id: "",
        title: "",
        category: "Civilization", // Default value
        cover: "",
        public_id: "",
        raw_cover: "", // Temporary
        wiki_content: []
    });

    // Schema for making dynamic content block
    const [schema, setSchema] = useState<any[]>([]);
    const [search, setSearch] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [light, setLight] = useState<boolean>("light" === localStorage.getItem("technoinc-theme"));

    useEffect(() => {
        document.body.style.overflow = loading ? "hidden" : "visible";
    }, [loading]);

    return (
        <>
        <Menu wikiTitle="Contribution" contribution={false} search={search} setSearch={setSearch} setLight={setLight} />
        <ModifyBox search={search} />
        <Loading show={loading} />

        <div className={`mt-[3em] p-[1em] flex flex-col gap-[2em] rounded-[10px] border-t-10
                        shadow-2xs shadow-black border-[rgb(0,175,255)]
                        ${light ? "bg-white/70" : "bg-gray-700/50 [&>textarea,&>input,&>div>h3,&>div>h2]:text-white"}`}>
            <textarea
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
                    className={`w-full pl-2.5 font-bold outline-none rounded-2xl border-none [&>option]:font-bold
                                ${!light && "text-white bg-gray-700 [&>option]:text-white [&>option]:bg-gray-700"}`}>
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
                {article.cover && <img
                    src={article.cover}
                    className="w-full rounded-[5px]" />}
                <input
                    id="article-cover"
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={(e) => {
                        const selectedFile = (e.target as HTMLInputElement).files?.[0];
                        if (!selectedFile) return;

                        const preview = URL.createObjectURL(selectedFile);

                        setArticle((prev: any) => ({
                            ...prev,
                            cover: preview,
                            raw_cover: selectedFile
                        }));
                    }} />
                <label
                    htmlFor="article-cover"
                    className={`p-3 font-bold self-start rounded-2xl border-2 text-black
                                hover:bg-gray-400/70 active:text-[rgb(0,175,255)] active:bg-white
                                transition-colors duration-150 ease-in-out
                                ${!light && "text-white border-gray-500"}`}>
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
                setLoading(true);

                const validate = await checkAllValues(schema, setSchema, article, setArticle, setLoading);
                if (!validate) setLoading(false);
            }}
            className="w-[40%] mt-5 mr-auto ml-auto p-2 font-bold text-[1.2em] block rounded-[5px]
                        text-white border-none bg-[rgb(0,175,255)]
                        hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
            Upload
        </button>

        <ContentToolbar setSchema={setSchema} light={light} />
        <Footer />
        </>
    )
}

export default ContributionPage;