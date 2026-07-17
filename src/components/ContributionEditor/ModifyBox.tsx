import Loading from "../Loading";
import { useState, useEffect, ReactElement } from "react";
import { Link } from "react-router-dom";
import { sterilizedWord } from "../../utils/articleUtils";

interface propTypes {
    search: boolean;
}

function ModifyBox({ search }: propTypes): ReactElement {

    const [input, setInput] = useState<string>(""); // User article search input
    const [data, setData] = useState<any[]>([]); // Get all articles from db
    const [specific, setSpecific] = useState<any[]>([]); // Set only specific article matches with input
    const [loading, setLoading] = useState<boolean>(false);

    // Get all articles from db when loaded
    useEffect(() => {
        const fetchData = async (): Promise<void> => {

            const API: string = import.meta.env.VITE_API;
            
            try {
                setLoading(true)

                const response: Response = await fetch(`${API}/api/v1/wiki/articles`);

                const result: Record<string, any> = await response.json();

                setData(result.data);
                setSpecific(result.data.filter((item: any) => item.title.toLowerCase().includes(input.toLowerCase())));
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
        setSpecific(data.filter(item => item.title.toLowerCase().includes(input.toLowerCase())));
        if (input === "") setSpecific([]);
    }, [input]);

    useEffect(() => {
        document.body.style.overflow = search ? "hidden" : "visible";
    }, [search]);

    return (
        <div className={`w-full h-full ${search ? "translate-y-[0%]" : "-translate-y-full"} fixed z-1 bg-black/70 backdrop-blur-lg transition-transform duration-75 ease-in-out`}>
            <div className="mt-3 flex items-center relative min-[1200px]:w-[calc(100%-350px)]">
                <input
                    type="text"
                    placeholder="Search article name"
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

            <div className="h-[85%] py-3 overflow-auto">

                <Loading show={loading} />

                <p className={`mx-3 ${specific.length > 0 ? "block" : "hidden"} text-white`}>
                    <span style={{display: input === "" && specific.length > 0 ? "inline" : "none"}}>All Articles </span>
                    <span style={{display: input !== "" ? "inline" : "none"}}>Found Match </span>
                    ({specific.length})
                </p>

                {specific.map((item, index) => (
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
                            <h4 dangerouslySetInnerHTML={{__html:
                                item.title.replace(new RegExp(`(${sterilizedWord(input)})`, "gi"), (word: any) => (
                                    `<span style="background-color: blue;">${word}</span>`
                                ))
                            }}></h4>
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