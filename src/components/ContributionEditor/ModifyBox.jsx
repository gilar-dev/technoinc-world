import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import API from "../../API";

function ModifyBox({ search }) {

    const [input, setInput] = useState("");
    const [data, setData] = useState([]);
    const [specific, setSpecific] = useState([]);

    const sterilizedWord = (word) => {

        if (!word) return "";

        const replaced = word.toLowerCase().trim()
            .replace(/&/g, "&amp")
            .replace(/</g, "&lt")
            .replace(/>/g, "&gt")
            .replace(/"/g, "&quot")
            .replace(/'/g, "&#x27")
            .replace(/\//g, "&#x2f")

        return replaced.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    useEffect(() => {
        const fetchData = async () => {
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

                        <div className="w-[60%] relative min-[1200px]:w-[70%]">
                            <h4 dangerouslySetInnerHTML={{__html:
                                item.title.replace(new RegExp(`(${sterilizedWord(input)})`, "gi"), word => (
                                    `<span style="background-color: blue;">${word}</span>`
                                ))
                            }}></h4>
                            <p className="text-[.9em]">{item.id}</p>
                            <p className="text-[.9em] text-white/50">{item.category}</p>

                            <div className="flex items-center gap-5 absolute bottom-0 right-0
                                            [&>button]:cursor-pointer [&>button]:text-[1.3em] [&>button]:border-none [&>button]:bg-transparent">
                                <button
                                    title="Edit"
                                    className="text-white">
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button
                                    title="Delete"
                                    className="text-red-500">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
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