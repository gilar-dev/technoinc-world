import Loading from "../../Loading";
import { ArticleConfig, ResObject, SetState } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { searchCategory, createCategory } from "../../../utils/databaseUtils";
import { Activity, useState, useEffect, useContext } from "react";
import "../../../css/DynamicPage.css";

// Configure type interfaces
interface PropTypes {
    addToggle: SetState<boolean>;
}

interface ConfigTypes {
    light: boolean;
    article: ArticleConfig;
    setArticle: SetState<ArticleConfig>;
}

// Main component function
function ArticleCategory({ addToggle }: PropTypes): React.JSX.Element {

    const { light, article, setArticle } = useContext<ConfigTypes>(Config);

    const [search, setSearch] = useState<string>("");
    const [matches, setMatches] = useState<ResObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [newCat, setNewCat] = useState<string>("");
    const [createNewCat, setCreateNewCat] = useState<boolean>(false);

    useEffect(() => {
        if (search.trim() === "") return () => { setLoading(false); setMatches([]); }

        setLoading(true);
        setMatches([]);

        const delayed: number = setTimeout(async () => {
            await fetchData();
        }, 700);

        const fetchData = async (): Promise<void> => {
            const filtratedSearch: string = search.trim();
            const result: ResObject = await searchCategory(filtratedSearch);
            if (result) setMatches(result.data);
            else setMatches([]);
            setLoading(false);
        }

        return () => clearTimeout(delayed);
    }, [search]);

    return (
        <div className={`w-full mx-3 p-3 border border-[rgb(85,85,85)] outline-blue-500 shadow-2xs shadow-black
                        ${light ? "bg-white" : "bg-gray-700"}`}>
            <Activity mode={createNewCat ? "visible" : "hidden"}>
                <div className="mb-3">
                    <div className="font-semibold">Category: {newCat}</div>
                    <em className="font-medium text-[.8em]">New category must have parent category</em>
                </div>
            </Activity>
            <div className="mb-3 flex items-center">
                <input id="search-input" type="text" placeholder="Search category" value={search}
                    className={`w-full p-1 text-[1.2em] ${!light && "border-white text-white bg-transparent"}`}
                    onChange={(e) => setSearch(e.target.value)} />
                <button className="p-1 font-semibold text-[1.2em] border-solid border-red-500 text-red-500 bg-red-500/30" onClick={() => {
                    addToggle(false);
                    setSearch("");
                    setMatches([]);
                    setNewCat("");
                    setCreateNewCat(false);
                }}>
                    Cancel
                </button>
            </div>
            <div className="relative">
                <Loading show={loading} position="absolute" />
                <div className={`flex flex-col items-center
                                ${!loading && search !== "" && matches.length === 0 ? "block" : "hidden"}`}>
                    <span>Category of "{search}" is not exist.</span>
                    <span className="mb-3">Would you like to create this category?</span>
                    <button className="p-1 font-semibold" onClick={() => {
                        setNewCat(search);
                        setCreateNewCat(true);
                        setSearch("");
                    }}>
                        Create category
                    </button>
                </div>
                <ul className="min-h-[15em] max-h-[22em] overflow-auto list-none flex flex-col gap-2">
                    {matches.map((data: ResObject, index: number) => (
                        <li key={index} className="p-1 flex justify-between items-center border border-[rgb(85,85,85)]">
                            <div>
                                <h4>{data.category}</h4>
                                <span className="font-medium text-[.9em]">{data.hierarchy}</span>
                            </div>
                            <div>
                                <button className={`text-[1.3em] ${!createNewCat && article.category.some((cat: string) => cat === data.category) && "hidden"}`}
                                    onClick={async () => {
                                        if (createNewCat) {
                                            const result: ResObject = await createCategory(newCat, data.category);
                                            if (result.status === "Error") console.log("Error");
                                            setSearch("");
                                            setMatches([]);
                                            addToggle(false);
                                            return setArticle((prev: ArticleConfig) => ({ ...prev, category: [...prev.category, newCat] }));
                                        }
                                        if (article.category.some((cat: string) => cat === data.category)) return;
                                        setSearch("");
                                        setMatches([]);
                                        addToggle(false);
                                        return setArticle((prev: ArticleConfig) => ({ ...prev, category: [...prev.category, data.category] }));
                                    }}
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ArticleCategory;