const API = import.meta.env.VITE_API;

// Handle value from article inputs
export const handleInputChange = (index, property, value, setSchema) => {
    setSchema(prev => {
        const updatedSchema = [...prev];

        updatedSchema[index][property] = value;

        return updatedSchema;
    });
}

// Add new content to list of content blocks
export const addNewContent = (block, setSchema) => {
    setSchema(prev => [...prev, block]);
    scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// Add new table block for table-typed content only
export const addNewTable = (index, block, setSchema) => {
    setSchema(prev => [...prev].toSpliced(index + 1, 0, block));
}

// Move content to up-down and reordering
export const moveContent = (currentIndex, direction, schema=[], setSchema) => {
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
export const deleteContent = (index, setSchema) => {
    setSchema((prev) => ([...prev].toSpliced(index, 1)));
}

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

// Get article category from category shortcut
export const getCategory = (cat, plural=false) => {

    const categories = {
        char:  !plural ? "Character"    : "Characters",
        civ:   !plural ? "Civilization" : "Civilizations",
        ide:   !plural ? "Ideology"     : "Ideologies",
        lore:  !plural ? "Lore"         : "Lores",
        org:   !plural ? "Organization" : "Organizations",
        party: !plural ? "Party"        : "Parties",
        town:  !plural ? "Town"         : "Towns"
    }

    return categories[cat];
}

// Check if article id existence
export const checkArticleId = async (category, articleId) => {

    if (articleId === "" || category === "") return;

    try {
        const getId = await fetch(`${API}/api/v1/wiki/${category}/${articleId}/exist`);

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
    dataPackage.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
        const response = await fetch(`${API}/api/v1/cloudinary/upload`, {
            method: "POST",
            body: dataPackage
        });
    
        const result = await response.json();
        console.log(result);

        return result;

    } catch (error) {
        console.error(error);
    }
}

// Validate all values of all inputs
export const checkAllValues = async (schema, setSchema, article, setArticle, setLoading) => {

    // Check if article contains images
    let containsImage = false;
    // Check article id existence
    const checkId = await checkArticleId(article.category, article.id);

    if (article.title === "") return alert("Article title can't be empty");
    if (checkId) return alert("Article id is already exist!");
    if (article.cover === "") return alert("Article cover can't be empty!");
    if (schema.length === 0) return alert("You haven't add any content!");

    for (let i = 0; i < schema.length; i++) {
            
        const block = schema[i];
        const rejectionMessage = "These can't be empty at content " + (i + 1);

        // Check the type of block
        switch (block.type) {

            case "heading-type":
                if (block.data === "") return alert(rejectionMessage);
                break;

            case "table-type":
                if (block.head_data === "" || block.content_data === "") return alert(rejectionMessage);
                break;

            case "paragraph-type":
                if (block.title === "" || block.data === "") return alert(rejectionMessage);
                break;

            case "image-type":
                if (block.url === "" || block.description === "") return alert(rejectionMessage);
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
                    cloneSchema[i]["url"] = getCloudURL.secure_url;
                    cloneSchema[i]["public_id"] = getCloudURL.public_id;
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
        cover: getCoverURL.secure_url,
        public_id: getCoverURL.public_id,
        visited: 0,
        wiki_content: cloneSchema
    }

    // Make fetch request to backend then send it to database
    if (finalArticle) {

        try {
            const processUploading = await fetch(`${API}/api/v1/contribution/upload`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalArticle)
            });

            if (!processUploading.ok) return console.error(processUploading);

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

            const splitedId = article.id.split("-");
            window.location.replace(`/wiki/Category:${getCategory(splitedId[splitedId.length - 1], true)}/${article.id}`);

            return true;

        } catch (error) {
            console.error(error);
        }
    }
}

// Sterilized user input to prevent XSS probability
export const sterilizedWord = (word) => {

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

// Update article after edited
export const updateArticle = async (category, id, schema) => {
    // Create final article data before updating
    const finalArticleUpdate = {
        id: id,
        wiki_content: [...schema]
    }

    try {
        // Fetch request to backend API endpoint to update
        const response = await fetch(`${API}/api/v1/contribution/update/${category}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finalArticleUpdate)
        })
        const results = await response.json();

        alert("Successfully updated article!")
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}