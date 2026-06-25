// Generate article id
export const generateId = (title, category) => {
    const modifiedTitle = title
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

// Check if article id existence
export const checkArticleId = async (category, articleId) => {
    try {
        const getId = await fetch(`https://technoinc-api.vercel.app/api/v1/wiki/${category}/${articleId}/exist`);

        if (!getId.ok) return console.error(getId);
            
        const result = await getId.json();

        return result.is_exist;

    } catch(error) {
        console.error(error);
    }
}

// Upload selected image to cloud storage
export const uploadToCloudStorage = async (rawFile, folder) => {
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

        return jsonResult.secure_url;

    } catch (error) {
        console.error(error);
    }
}

// Validate all values of all inputs
export const checkAllValues = async (schema, setSchema, article, setArticle) => {

    const checkId = await checkArticleId(article.category, article.id);

    if (article.title === "") return alert("Article title can't be empty");
    if (checkId) return alert("Article id is already exist!");
    if (article.url === "") return alert("Article cover can't be empty!");
    if (schema.length === 0) return alert("You haven't add any content!");

    // Check if article contains images
    let containsImage = false;

    for (let i = 0; i < schema.length; i++) {
            
        const block = schema[i];
        const rejectionMessage = "These can't be empty at content " + (i + 1);

        // Check the type of block
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
                // Set true if containsImage
                containsImage = true;
                break;

            default:
                return null;
        }
    }

    // Upload article cover to cloud storage
    const getCoverURL = await uploadToCloudStorage(article.raw_cover, "Cover");
    // Clone current schema contents to modified
    const cloneSchema = [...schema];

    // Start converting local url to cloud storage url
    if (containsImage) {
        for (let i = 0; i < cloneSchema.length; i++) {
            const imageContent = cloneSchema[i];

            if (imageContent.type === "image-type") {
                const getCloudURL = await uploadToCloudStorage(imageContent.raw_file, article.category);

                if (getCloudURL) {
                    cloneSchema[i]["url"] = getCloudURL;
                    delete cloneSchema[i]["raw_file"];
                }
            }
        }
        // Set current schema value with modified cloneSchema
        setSchema(cloneSchema);
    }

    // Create final article data
    const finalArticle = {
        id: article.id,
        title: article.title,
        category: article.category,
        cover: getCoverURL,
        visited: 0,
        wiki_content: cloneSchema
    }

    // Make fetch request to backend then send it to database
    if (finalArticle) {
        const local = "http://127.0.0.1:8000";
        const vercel = "https://technoinc-api.vercel.app";

        try {
            const processUploading = await fetch(`${vercel}/api/v1/wiki/upload`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalArticle)
            });

            if (!processUploading.ok) return console.error(processUploading);
                
            const result = await processUploading.json();

            console.log(result);

            setArticle({
                id: "",
                title: "",
                category: "Civilization",
                cover: "",
                raw_cover: "",
                wiki_content: []
            });
            setSchema([]);
            alert("Your article is sucessfully uploaded!");

        } catch (error) {
            console.error(error);
        }
    }
}