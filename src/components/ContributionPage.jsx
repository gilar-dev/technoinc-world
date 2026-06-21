import Menu from "./Menu";
import Footer from "./Footer";
import ContentBlock from "./ContentBlock";
import { useState, useEffect } from "react";
import "../css/DynamicPage.css";
import js from "@eslint/js";

function ContributionPage() {

    // Set template for writing wiki content
    const [article, setArticle] = useState({
        id: "",
        title: "",
        category: "Civilization",
        wikiContent: []
    });

    // Generate an article id
    const generateId = (value, category) => {
        const modifiedTitle = value
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        .toLowerCase();

        const idNames = {
            Civilization: "civ" ,
            Character: "char" ,
            Ideology: "ide" ,
            Organization: "org" ,
            Party: "party" ,
            Town: "town" ,
            Lore: "lore" 
        };

        return modifiedTitle + "-" + idNames[category];
    }

    // Schema for making dynamic content block
    const [schema, setSchema] = useState([]);

    const handleInputChange = (index, property, value) => {
        setSchema(prev => {
            const updatedSchema = [...prev];

            updatedSchema[index][property] = value;

            return updatedSchema;
        });
    }

    // Upload selected image to cloud storage
    const uploadToCloudStorage = async (index, rawFile, folder) => {
        if (!rawFile) return;

        // Create a binary data package
        const dataPackage = new FormData();
        dataPackage.append("file", rawFile);
        dataPackage.append("folder", folder);
        dataPackage.append("upload_preset", "technoinc_preset");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dqxtu5f0a/upload", {
                method: "POST",
                body: dataPackage
            });
    
            const jsonResult = await response.json();
            setSchema(prev => {
                const updatedSchema = [...prev];

                updatedSchema[index]["url"] = jsonResult.secure_url;
                updatedSchema[index]["rawFile"] = "";

                return updatedSchema;
            });

            console.log(jsonResult.secure_url);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Validate all values of all inputs
    const checkAllValues = async () => {

        if (article.title === "") return alert("Article title can't be empty");
        if (schema.length === 0) return alert("You haven't add any content!");

        let containImage = false;

        for (let i = 0; i < schema.length; i++) {
            
            const block = schema[i];
            const rejectionMessage = "These can't be empty at content " + (i + 1);

            switch (block.type) {

                case "heading-type":
                    if (block.data === "") return alert(rejectionMessage);
                    break;

                case "table-type":
                    if (block.headData === "" || block.contentData === "") return alert(rejectionMessage);
                    break;

                case "paragraph-type":
                    if (block.title === "" || block.data === "") return alert(rejectionMessage);
                    break;

                case "image-type":
                    if (block.url === "" || block.title === "" || block.description === "") return alert(rejectionMessage);
                    containImage = true;
                    break;

                default:
                    return null;
            }
        }

        if (containImage) {
            for (let i = 0; i < schema.length; i++) {
                const imageContent = schema[i];

                if (imageContent.type === "image-type") {
                    const uploadProcess = await uploadToCloudStorage(i, imageContent.rawFile, article.category);

                    if (!uploadProcess) return alert("Failed to upload to cloud storage");
                }
            }
        }

        console.log(schema);
    }

    // Add new content to list of content blocks
    const addNewContent = (block) => {
        setSchema(prev => [...prev, block]);
        scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    // Add new table block for table-typed content only
    const addNewTable = (index, block) => {
        setSchema(prev => [...prev].toSpliced(index + 1, 0, block));
    }

    // Move content to up-down and reordering
    const moveContent = (currentIndex, direction) => {
        if (schema.length <= 1) return;

        // Get the targeted index
        let targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        setSchema((prev) => {
            // Store current schema and content
            const updatedSchema = [...prev];
            const currentContent = updatedSchema[currentIndex];

            // Check if index out of range
            if (targetIndex < 0) targetIndex = updatedSchema.length - 1;
            else if (targetIndex > updatedSchema.length - 1) targetIndex = 0;

            // Reordering contents by swaping contents
            updatedSchema[currentIndex] = updatedSchema[targetIndex];
            updatedSchema[targetIndex] = currentContent;

            return updatedSchema;
        });
    }

    // Delete content from list of content blocks
    const deleteContent = (index) => {
        setSchema((prev) => ([...prev].toSpliced(index, 1)));
    }

    // Template for operational buttons in content block
    const operationalButtons = (currentIndex, addButton=false) => (
        <div className="w-full flex justify-center items-center gap-1
                        [&>button]:p-2 [&>button]:text-[1em] [&>button]:rounded-[5px] [&>button]:border-none [&>button]:text-white">
            <button
                title="Move up"
                onClick={() => moveContent(currentIndex, "up")}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
                title="Move down"
                onClick={() => moveContent(currentIndex, "down")}
                className="bg-[rgb(0,175,255)] hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white">
                <i className="fa-solid fa-arrow-down"></i>
            </button>
            <button
                title="Add new table"
                style={{display: addButton ? "block" : "none"}}
                onClick={() => addNewTable(currentIndex, {
                    type: "table-type",
                    headData: "",
                    contentData: ""
                })}
                className="bg-green-500 hover:bg-green-600 active:text-green-500 active:bg-white">
                <i className="fa-solid fa-plus"></i>
            </button>

            <span className="ml-auto mr-auto font-bold text-black/20">
                {currentIndex + 1}
            </span>

            <button
                title="Delete content"
                onClick={() => deleteContent(currentIndex)}
                className="delete-btn bg-[rgb(255,0,0)] hover:bg-[rgb(235,0,0)] active:text-[rgb(255,0,0)] active:bg-white">
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );

    return (
        <>
        <Menu wikiTitle="Contribution" contribution={false} />

        <div className="mt-[3em] p-[1em] flex flex-col gap-[2em] rounded-[10px] border-t-10
                        shadow-2xs shadow-black border-[rgb(0,175,255)] bg-[rgb(220,220,220)]">
            <textarea
                type="text"
                placeholder="Article title"
                onChange={e => setArticle(prev => (
                    {
                        ...prev,
                        id: generateId(e.target.value, prev.category), 
                        title: e.target.value
                    }
                ))}
                className="p-1 min-h-2 font-['Montserrat'] font-bold text-3xl field-sizing-content resize-none outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />

            <input
                type="text"
                placeholder="Article id"
                value={article.id}
                readOnly
                className="p-1 font-bold outline-none border-l-0 border-t-0 border-r-0 bg-transparent" />

            <div className="flex items-centers gap-3">
                <h3 className="text-black">Select category:</h3>
                <select onChange={e => setArticle(prev => (
                            {
                                ...prev,
                                id: generateId(prev.title, e.target.value),
                                category: e.target.value
                            }
                        ))}
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
                onClick={() => checkAllValues()}
                className="w-[40%] p-2 font-bold text-[1.2em] block rounded-[5px] text-white border-none bg-[rgb(0,175,255)]
                        hover:bg-[rgb(0,155,235)] active:text-[rgb(0,175,255)] active:bg-white" />
        </div>

        <div className="mt-[3em] flex flex-col gap-[2em] rounded-[10px] bg-[rgb(220,220,220)]
                        [&>.content-box]:m-[1em] [&>.content-box]:pl-[1em] [&>.content-box]:flex [&>.content-box]:flex-col [&>.content-box]:items-center [&>.content-box]:gap-3
                        [&>.content-box]:border-l-5 [&>.content-box]:border-[rgb(0,175,255)] [&>.content-box]:has-[.delete-btn:hover]:bg-red-200">
            {schema.map((block, idx) => (
                <ContentBlock
                    key={idx}
                    index={idx}
                    block={block}
                    buttons={operationalButtons}
                    cloudStorage={uploadToCloudStorage}
                    onChangeHandler={handleInputChange} />
            ))}
        </div>

        <div className="mt-[3em] mx-[1em] p-[1em] flex gap-[1em] overflow-auto rounded-[10px] bg-[rgb(220,220,220)]
                        sticky bottom-0 shadow-2xs shadow-black
                        [&>button]:p-[.2em] [&>button]:border-none [&>button]:text-3xl [&>button]:rounded-[5px]
                        [&>button]:text-white [&>button]:bg-[rgb(0,175,255)] [&>button]:hover:bg-[rgb(0,155,235)]
                        [&>button]:active:text-[rgb(0,155,235)] [&>button]:active:bg-white">

            <button
                title="Add new table heading"
                onClick={() => addNewContent({
                    type: "heading-type",
                    data: ""
                })}>
                <i className="fa-solid fa-heading"></i>
            </button>

            <button
                title="Add new table content"
                onClick={() => addNewContent({
                    type: "table-type",
                    headData: "",
                    contentData: ""
                })}>
                <i className="fa-solid fa-table-list"></i>
            </button>

            <button
                title="Add new paragraph"
                onClick={() => addNewContent({
                    type: "paragraph-type",
                    title: "",
                    data: ""
                })}>
                <i className="fa-solid fa-paragraph"></i>
            </button>

            <button
                title="Add new image"
                onClick={() => addNewContent({
                    type: "image-type",
                    url: "",
                    rawFile: "",
                    title: "",
                    description: ""
                })}>
                <i className="fa-solid fa-image"></i>
            </button>
        </div>

        <Footer />
        </>
    )
}

export default ContributionPage;