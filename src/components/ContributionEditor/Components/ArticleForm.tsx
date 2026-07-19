import { ReactElement } from "react";
import { generateId } from "../../../utils/articleUtils";
import { ArticleConfig, SetState } from "../../../utils/typesUtils";

interface PropTypes {
    article: ArticleConfig;
    light: boolean;
    states: {
        setArticle: SetState<ArticleConfig>;
    }
}

function ArticleForm({ article, light=false, states }: PropTypes): ReactElement {

    return (
        <div className={`mt-[3em] p-[1em] flex flex-col gap-[2em] rounded-[10px] border-t-10
                        shadow-2xs shadow-black border-[rgb(0,175,255)]
                        ${light ? "bg-white/70" : "bg-gray-700/50 [&>textarea,&>input,&>div>h3,&>div>h2]:text-white"}`}>
                <textarea
                    placeholder="Article title"
                    value={article.title}
                    onChange={e => states.setArticle(prev => {
                        const value: string = e.target.value;
                        return { ...prev, id: generateId(value, prev.category), title: value }
                    })}
                    className={`p-1 min-h-2 font-['Montserrat'] font-bold text-3xl field-sizing-content resize-none
                                outline-none border-l-0 border-t-0 border-r-0 bg-transparent`} />
                <input
                    type="text"
                    placeholder="Article id"
                    value={article.id}
                    readOnly
                    className="p-1 font-bold outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                <div className="flex items-centers gap-3">
                    <h3 className="text-black">Select category:</h3>
                    <select
                        onChange={e => states.setArticle(prev => {
                            const value: string = e.target.value;
                            return { ...prev, id: generateId(prev.title, value), category: value }
                        })}
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
                {article.cover &&
                    <img
                        src={article.cover}
                        className="w-full rounded-[5px]" />}
                <input
                    id="article-cover"
                    type="file"
                    accept="image/jpeg, image/png, image/webp, .jpg, .jpeg, .png, .webp"
                    style={{display: "none"}}
                    onChange={(e) => {
                        const selectedFile: File = e.target.files?.[0] as File;
                        if (!selectedFile) return;
                        const preview: string = URL.createObjectURL(selectedFile);
                        states.setArticle((prev: any) => (
                            { ...prev, cover: preview, raw_cover: selectedFile }
                        ));
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
    );
}

export default ArticleForm;