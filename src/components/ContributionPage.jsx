import Menu from "./Menu";
import Footer from "./Footer";
import BlockContent from "./BlockContent";
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

    const handleInputChange = (index, property, target) => {
        setSchema(prev => {
            const updatedSchema = [...prev];

            updatedSchema[index][property] = target.value;

            return updatedSchema;
        });
    }

    const uploadArticle = () => {
        if (template.title === "" || template.id === "") return;

        console.log(template, document.getElementById("image").value);
    }

    // Article content editor tools
    const addNewContent = (block) => {
        setSchema(prev => ([...prev, block]));
    }

    // Function for moving content to up-down and reordering
    const moveContent = (currentIndex, direction) => {

        let targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        setSchema((prev) => {
            const updatedSchema = [...prev];
            const currentContent = updatedSchema[currentIndex];

            if (targetIndex < 0) targetIndex = updatedSchema.length - 1;
            else if (targetIndex > updatedSchema.length - 1) targetIndex = 0;

            updatedSchema[currentIndex] = updatedSchema[targetIndex];
            updatedSchema[targetIndex] = currentContent;

            return updatedSchema;
        });
    }

    const deleteContent = (index) => {
        setSchema((prev) => ([...prev].toSpliced(index, 1)));
    }

    const operationalButtons = (currentIndex) => (
        <div className="w-full flex justify-center gap-1
                        [&>button]:p-2 [&>button]:text-[1em] [&>button]:rounded-[5px] [&>button]:border-none [&>button]:text-white">
            <button
                title="Delete content"
                onClick={() => moveContent(currentIndex, "up")}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
                title="Delete content"
                onClick={() => moveContent(currentIndex, "down")}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-down"></i>
            </button>
            <button
                title="Delete content"
                onClick={() => deleteContent(currentIndex)}
                className="ml-auto bg-[rgb(255,0,0)] hover:bg-[rgb(235,0,0)] active:text-[rgb(255,0,0)] active:bg-white">
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );

    useEffect(() => {
        console.log(schema);
    }, [schema]);

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

        <div id="content-container" className="mt-[3em] flex flex-col gap-[2em] rounded-[10px] bg-[rgb(220,220,220)]">
            {schema.map((block, idx) => (
                <BlockContent
                    key={idx}
                    index={idx}
                    block={block}
                    buttons={operationalButtons}
                    onChangeHandler={handleInputChange} />  
            ))}
        </div>

        <div
            id="additional-container"
            className="mt-[3em] p-[1em] flex gap-[1em] overflow-auto rounded-[10px] bg-[rgb(220,220,220)] shadow-2xs shadow-black
                        [&>button]:p-[.2em] [&>button]:border-none [&>button]:text-3xl [&>button]:rounded-[5px]
                        [&>button]:text-white [&>button]:bg-[rgb(0,175,255)] [&>button]:hover:bg-[rgb(0,155,235)]
                        [&>button]:active:text-[rgb(0,155,235)] [&>button]:active:bg-white">

            <button
                title="Add new table heading"
                onClick={() => addNewContent({
                    type: "heading-type",
                    restore: false,
                    data: ""
                })}>
                <i className="fa-solid fa-heading"></i>
            </button>

            <button
                title="Add new table content"
                onClick={() => addNewContent({
                    type: "table-type",
                    restore: false,
                    headData: "",
                    contentData: ""
                })}>
                <i className="fa-solid fa-table-list"></i>
            </button>

            <button
                title="Add new paragraph"
                onClick={() => addNewContent({
                    type: "paragraph-type",
                    restore: false,
                    title: "",
                    data: ""
                })}>
                <i className="fa-solid fa-paragraph"></i>
            </button>

            <button
                title="Add new image"
                onClick={() => null}>
                <i className="fa-solid fa-image"></i>
            </button>
        </div>

        <Footer />
        </>
    )
}

export default ContributionPage;