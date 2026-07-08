import ContributionEditPage from "./ContributionEditPage";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sterilizedWord } from "./ContributionUtils";

function ModifyBox({ search }) {

    const [input, setInput] = useState("");
    const [data, setData] = useState([]);
    const [specific, setSpecific] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            const API = import.meta.env.VITE_API;
            
            try {
                const response = await fetch(`${API}/api/v1/wiki/articles`);
                const results = await response.json();

                setData(results.data);

            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (input === "") setSpecific([]);
    }, [input]);

    if (search) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "visible";

    return (
        <div className={`w-full h-full ${search ? "translate-y-[0%]" : "-translate-y-full"} fixed z-1 bg-black transition-transform duration-75 ease-in-out`}>
            <div className="mt-3 flex items-center relative min-[1200px]:w-[calc(100%-350px)]">
                <input
                    type="text"
                    placeholder="Search article name"
                    value={input}
                    onChange={e => {
                        setInput(e.target.value);

                        const filter = data.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
                        setSpecific(filter);
                    }}
                    className="w-full h-10 pl-3 pr-10 text-[1em] outline-none border-l-0 border-t-0 border-r-0 text-white bg-transparent" />
                <button
                    title="Delete"
                    className="h-[90%] aspect-square cursor-pointer text-[1.2em] absolute top-0 right-0 border-none rounded-[5px] text-white bg-transparent"
                    onClick={() => setInput("")}>
                    <i className="fa-solid fa-delete-left"></i>
                </button>
            </div>

            <div className="h-[85%] py-3 overflow-auto">

                <p className={`mx-3 ${specific.length > 0 ? "block" : "hidden"}`}>Found Match ({specific.length})</p>

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
                                item.title.replace(new RegExp(`(${sterilizedWord(input)})`, "gi"), word => (
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

ModifyBox.propTypes = {
    search: PropTypes.bool
}

export default ModifyBox;