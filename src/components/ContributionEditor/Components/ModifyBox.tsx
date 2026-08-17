import SearchMatches from "./SearchMatches";
import Loading from "../../Loading";
import { ReactElement, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Schema, ResObject, API } from "../../../utils/typesUtils";
import { sterilizedWord } from "../../../utils/articleUtils";
import { searchArticle } from "../../../utils/databaseUtils";

interface propTypes {
    search: boolean;
}

function ModifyBox({ search }: propTypes): ReactElement {

    const [input, setInput] = useState<string>(""); // User article search input
    const [loading, setLoading] = useState<boolean>(false);
    const [matches, setMatches] = useState<Schema>([]);

    // Get the ref to specific html tags
    const inputTag = useRef<HTMLInputElement>(null);

    // Get all articles from db when loaded
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setLoading(true)

            try {
                // Fetch request to backend
                const response: Response = await fetch(`${API}/api/v1/wiki/articles`);
                // If response is not ok, throw error
                if (!response.ok) throw new Error(`${response}`);
                // Get the successful fetch response data
                const result: ResObject = await response.json();

                if (input === "") setMatches(result.data);
                
                setLoading(false);

            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        }

        fetchData();
    }, []);
    
    // Set the specific article matches with user input
    useEffect(() => {
        if (!input.trim()) {
            setMatches([]);
            return;
        }
        setMatches([]);
        setLoading(true);

        // Add delay before searching
        const delayed: number = setTimeout(async () => {
            const process: ResObject = await searchArticle(input);
            setMatches(process.matches);
            setLoading(false);
        }, 700);

        // Clear tiemout delay as input changes
        return () => clearTimeout(delayed);
    }, [input]);
    
    useEffect(() => {
        setInput("");
        document.body.style.overflow = search ? "hidden" : "visible";
        if (inputTag.current) inputTag.current.focus();
    }, [search]);

    return (
        <div className={`w-full h-full ${search ? "translate-y-[0%]" : "-translate-y-full"} fixed z-1 bg-black/70 backdrop-blur-lg transition-transform duration-75 ease-in-out`}>
            <div className="mt-3 flex items-center relative min-[1200px]:w-[calc(100%-350px)]">
                <input
                    type="text"
                    ref={inputTag}
                    placeholder="Search article title"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 text-[1em] outline-none border-l-0 border-t-0 border-r-0 text-white bg-transparent" />
                <button
                    title="Delete"
                    className="h-[90%] aspect-square cursor-pointer text-[1.2em] absolute top-0 right-0 border-none rounded-[5px] text-white bg-transparent"
                    onClick={() => setInput("")}>
                    <i className="fa-solid fa-delete-left"></i>
                </button>
            </div>

            <Loading show={loading} />

            <div className="h-[85%] py-3 overflow-auto">
                <p className={`mx-3 ${!loading ? "block" : "hidden"} text-white`}>
                    <span style={{display: input === "" && matches.length > 0 ? "inline" : "none"}}>All Articles </span>
                    <span style={{display: input !== "" && matches.length > 0 ? "inline" : "none"}}>Found Matches </span>
                    <span style={{display: input !== "" && matches.length === 0 ? "inline" : "none"}}>No Matches Found</span>
                    {matches.length > 0 && `(${matches.length})`}
                </p>

                {matches.map((item: ResObject, index: number) => (
                    <div
                        key={index}
                        className="mt-10 mx-3 flex justify-between hover:bg-white/10
                                    min-[1200px]:w-[calc(100%-350px-20px)]">
                        <div className="group w-[30%] aspect-square overflow-hidden border border-[rgb(85,85,85)] min-[1200px]:w-[20%]">
                            <img 
                                alt={item.title}
                                src={item.cover || null}
                                className="w-full h-full group-hover:scale-[110%] transition-transform duration-75 ease-in-out"/>
                        </div>

                        <div className="w-[60%] flex flex-col text-white min-[1200px]:w-[70%]">
                            <SearchMatches title={item.title} input={input} />
                            <p className="text-[.9em]">{item.id}</p>
                            <p className="text-[.9em] flex items-center gap-1 text-white/50">{item.category} | {item.visited} <i className="fa-regular fa-eye"></i></p>

                            <div className="mt-auto flex items-center gap-5 self-end
                                            [&>button]:cursor-pointer [&>button]:text-[1.3em] [&>button]:border-none [&>button]:bg-transparent">
                                <Link
                                    title="Edit"
                                    to={`/contribution/edit/${item.id}`}
                                    replace
                                    onClick={() => document.body.style.overflow = "visible"}
                                    className="p-1 rounded-[3px] border-b-2 border-white text-white hover:bg-white/30">
                                    Edit Article
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ModifyBox;