import ArticleCategory from "./ArticleCategory";
import { ArticleConfig, SetState } from "../../../utils/typesUtils";
import { useState, useEffect } from "react";

interface PropTypes {
    article: ArticleConfig;
    light: boolean;
    states: {
        setArticle: SetState<ArticleConfig>;
    }
}

function ArticleForm({ article, light, states }: PropTypes): React.JSX.Element {

    const [addCategory, setAddCategory] = useState<boolean>(false);

    useEffect(() => {
        document.body.style.overflow = addCategory ? "hidden" : "visible";
    }, [addCategory]);

    return (
        <div className={`mt-[3em] p-[1em] flex flex-col gap-[2em] relative rounded-[10px] border-t-10
                        shadow-2xs shadow-black border-[rgb(0,175,255)] [&_textarea]:transition-colors [&_textarea]:duration-150
                        [&_textarea]:ease-in-out [&_textarea]:font-['Montserrat'] [&_textarea]:focus:border-[rgb(0,175,255)]
                        ${light ? "bg-white/70" : "bg-gray-700/50 [&>textarea,&>input,&>div>h3,&>div>h2]:text-white"}`}>
            <textarea
                placeholder="Article title"
                value={article.title}
                onChange={(e) => states.setArticle((prev: ArticleConfig) => ({ ...prev, title: e.target.value }))}
                className={`p-1 min-h-2 font-bold text-[25px] field-sizing-content resize-none
                            outline-none border-l-0 border-t-0 border-r-0 bg-transparent`} />
            <textarea
                placeholder="Brief article description"
                value={article.description}
                onChange={(e) => states.setArticle((prev: ArticleConfig) => ({ ...prev, description: e.target.value }))}
                className={`p-1 min-h-2 font-medium field-sizing-content resize-none
                            outline-none border-l-0 border-t-0 border-r-0 bg-transparent`} />
            <div className="font-['Inter'] flex gap-10">
                <div>
                    <div>
                        <ul className="list-none flex items-baseline-last flex-wrap">
                            <li><span className="mr-3 font-semibold">Category:</span></li>
                            {article.category.map((cat: string, index: number) => (
                                <li key={index} className="mr-2 mb-2 flex items-baseline-last gap-1">
                                    <span className="font-normal">{cat}</span>
                                    <button title="Delete category" className={`cursor-pointer border-none bg-transparent ${!light && "text-white"}`} onClick={() => {
                                        states.setArticle((prev: ArticleConfig) => ({ ...prev, category: [...prev.category].toSpliced(index, 1) }))
                                    }}><i className="fa-solid fa-xmark"></i></button>
                                </li>
                            ))}
                            <li className={`${!light && "[&_button]:border-white [&_button]:text-white"}`}>
                                <button title="Add new category" className="mx-auto p-1 cursor-pointer font-semibold border-solid rounded-[3px] bg-transparent"
                                    onClick={() => setAddCategory(true)}
                                >Add category</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={`w-full h-full justify-center items-center fixed top-0 left-0 z-100 ${addCategory ? "flex" : "hidden"}`}>
                <ArticleCategory addToggle={setAddCategory} />
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
                <h2 className="text-black/40">Article Cover</h2>
                {article.cover &&
                    <img
                        src={article.cover}
                        className="w-full rounded-[5px]" />
                }
                <input
                    id="article-cover"
                    type="file"
                    accept="image/jpeg, image/png, image/webp, .jpg, .jpeg, .png, .webp"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0] as File;
                        // If file is undefined or canceled, return
                        if (!selectedFile) return;
                        // Create object url and get url as value to cover source
                        const preview: string = URL.createObjectURL(selectedFile);
                        // Update article state
                        states.setArticle((prev: ArticleConfig) => (
                            { ...prev, cover: preview, raw_cover: selectedFile }
                        ));
                    }} />
                <label
                    htmlFor="article-cover"
                    className={`self-start p-3 font-bold rounded-2xl border-2 text-black
                                transition-colors duration-150 ease-in-out
                                hover:bg-gray-400/70 active:text-[rgb(0,175,255)] active:bg-white
                                ${!light && "text-white border-gray-500"}`}>
                    Choose Cover
                </label>
            </div>
        </div>
    );
}

export default ArticleForm;