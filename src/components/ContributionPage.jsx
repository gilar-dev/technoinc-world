import Menu from "./Menu";
import Footer from "./Footer";
import { addBlock } from "./AddBlock";
import { useState, useEffect } from "react";
import "../css/DynamicPage.css";

function ContributionPage() {

    // Set template for writing wiki content
    const [template, setTemplate] = useState({
        id: "",
        title: "",
        category: "Civilization",
        wiki_content: [

        ]
    });
    const [schema, setSchema] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setTemplate(prev => ({ ...prev, [name]: value }));
    }

    const uploadArticle = () => {
        if (template.title === "" || template.id === "") return;

        console.log(template, document.getElementById("image").value);
    }

    const getContainer = () => document.getElementById("content-container");

    // Article content editor tools
    const addNewContent = (type) => {
        setSchema(prev => ([...prev, type]));
    }

    const moveContent = (element, direction) => {

        [...getContainer().children].forEach((e, idx) => {
            if (element.closest(".content-box") === e) {
                switch (direction) {
                    case "up":
                        getContainer().insertBefore(e, getContainer().children[idx-1]);
                        break;

                    case "down":
                        if (getContainer().children[idx+1] === undefined) {
                            getContainer().insertBefore(e, getContainer().children[0]);
                        } else getContainer().insertBefore(getContainer().children[idx+1], e);
                        break;

                    default:
                        return null;
                }
            }
        });
    }

    const deleteContent = (e) => {
        [...getContainer().children].forEach((element, idx) => {
            if (element === e.target.closest(".content-box")) {
                setSchema(prev => ([...prev].toSpliced(idx, 1)));
            }
        });
    }

    const operationalButtons = (
        <div className="w-full flex justify-center gap-1
                        [&>button]:p-2 [&>button]:text-[1em] [&>button]:rounded-[5px] [&>button]:border-none [&>button]:text-white">
            <button
                title="Delete content"
                onClick={(e) => moveContent(e.target, "up")}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
                title="Delete content"
                onClick={(e) => moveContent(e.target, "down")}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-down"></i>
            </button>
            <button
                title="Delete content"
                onClick={deleteContent}
                className="ml-auto bg-[rgb(255,0,0)] hover:bg-[rgb(235,0,0)] active:text-[rgb(255,0,0)] active:bg-white">
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );

    return (
        <>
        <Menu wikiTitle="Contribution" contribution={false} />

        <div id="wiki-title-container" className="mt-[3em] p-[1em] flex flex-col gap-[2em] rounded-[10px] border-t-10
                                                    shadow-2xs shadow-black border-[rgb(0,175,255)] bg-[rgb(220,220,220)]">
            <input
                name="title"
                type="text"
                placeholder="Article title"
                onChange={handleInputChange}
                className="p-1 font-bold text-3xl outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />

            <input
                name="id"
                type="text"
                placeholder="Article id"
                onChange={handleInputChange}
                className="p-1 font-bold outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />

            <div className="flex items-centers gap-3">
                <h3 className="text-black">Select category:</h3>
                <select
                    name="category"
                    onChange={handleInputChange}
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

            <input
                type="submit"
                value="Upload"
                title="Upload article"
                onClick={() => createArticle()}
                className="w-[40%] p-2 font-bold text-[1.2em] block rounded-[5px] text-white border-none bg-[rgb(0,175,255)] active:text-[rgb(0,175,255)] active:bg-white" />
        </div>

        <div id="content-container" className="mt-[3em] p-[1em] flex flex-col gap-[2em] rounded-[10px] bg-[rgb(220,220,220)]">
            {schema.map((block, idx) => {
                switch (block) {
                    case "heading-type":
                        return (
                            <div key={idx} className="content-box pl-1 pb-1 flex flex-col items-center gap-3 border-l-5 border-[rgb(0,175,255)]">
                                <input
                                    placeholder="Table title"
                                    className="w-full text-[20px] text-center outline-none border-l-0 border-t-0 border-r-0 bg-transparent"></input>
                                {operationalButtons}
                            </div>
                        )
                        break;

                    case "paragraph-type":
                        return (
                            <div key={idx} className="content-box pl-1 pb-1 flex flex-col items-center gap-3 border-l-5 border-[rgb(0,175,255)]">
                                <input
                                    type="text"
                                    placeholder="Paragraph title"
                                    className="w-full p-1 text-[1.3em] outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />
                                <textarea
                                    placeholder="Paragraph content"
                                    className="w-full h-25 p-1 resize-none outline-none border-none" />
                                {operationalButtons}
                            </div>
                        )
                        break;

                    case "table-type":
                        return (
                            <div key={idx} className="content-box pl-1 pb-1 flex flex-col items-center gap-3 border-l-5 border-[rgb(0,175,255)]">
                                <div className="flex border-black [&>input]:text-[15px] [&>input]:p-1 [&>input]:outline-none [&>input]:bg-transparent">
                                    <input type="text" placeholder="Table head" className="font-bold" />
                                    <input type="text" placeholder="Table data" />
                                </div>
                                {operationalButtons}
                            </div>
                        )
                        break;
                }
            })}
        </div>

        <div
            id="additional-container"
            className="mt-[3em] p-[1em] flex gap-[1em] overflow-auto rounded-[10px] bg-[rgb(220,220,220)] shadow-2xs shadow-black
                        [&>button]:p-[.2em] [&>button]:border-none [&>button]:text-3xl [&>button]:rounded-[5px]
                        [&>button]:text-white [&>button]:bg-[rgb(0,175,255)] [&>button]:hover:bg-[rgb(0,155,235)]
                        [&>button]:active:text-[rgb(0,155,235)] [&>button]:active:bg-white">

            <button title="Add new table heading" onClick={() => addNewContent("heading-type")}>
                <i className="fa-solid fa-heading"></i>
            </button>

            <button title="Add new table content" onClick={() => addNewContent("table-type")}>
                <i className="fa-solid fa-table-list"></i>
            </button>

            <button title="Add new paragraph" onClick={() => addNewContent("paragraph-type")}>
                <i className="fa-solid fa-paragraph"></i>
            </button>

            <button title="Add new image" onClick={() => addParagraph("image-type")}>
                <i className="fa-solid fa-image"></i>
            </button>
        </div>

        <Footer />
        </>
    )
}

export default ContributionPage;