const API = import.meta.env.VITE_API;

// Handle value from article inputs
export const handleInputChange = (
    index: number,
    property: string,
    value: Record<string, any>,
    setSchema: React.Dispatch<React.SetStateAction<any[]>>
): any => {
    setSchema(prev => {
        const updatedSchema: Record<string, any>[] = [...prev];

        updatedSchema[index][property] = value;

        return updatedSchema;
    });
}

// Add new content to list of content blocks
export const addNewContent = (
    block: Record<string, any>,
    setSchema: React.Dispatch<React.SetStateAction<any[]>>
): void => {
    setSchema(prev => [...prev, block]);
    scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// Add new table block for table-typed content only
export const addNewTable = (
    index: number,
    block: Record<string, any>,
    setSchema: React.Dispatch<React.SetStateAction<any[]>>
): void => {
    setSchema(prev => [...prev].toSpliced(index + 1, 0, block));
}

// Move content to up-down and reordering
export const moveContent = (
    currentIndex: number,
    direction: string,
    schema: Record<string, any>[] | [] = [],
    setSchema: React.Dispatch<React.SetStateAction<any[]>>
): any => {
    if (schema.length <= 1) return;

    // Get the targeted index
    let targetIndex: number = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    setSchema((prev) => {
        // Store current schema and content
        const updatedSchema: Record<string, any>[] = [...prev];
        const currentContent: Record<string, any> = updatedSchema[currentIndex];

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
export const deleteContent = (
    index: number,
    setSchema: React.Dispatch<React.SetStateAction<any[]>>
): void => {
    setSchema((prev) => ([...prev].toSpliced(index, 1)));
}

// Generate article id
export const generateId = (
    title: string,
    category: string
): string => {
    const modifiedTitle: string = title
    .replaceAll(" ", "-")
    .replaceAll("'", "")
    .toLowerCase();

    const idNames: Record<string, any> = {
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
export const getCategory = (
    cat: string,
    plural: boolean = false
): string => {

    const categories: Record<string, any> = {
        char:  !plural ? "Character"    : "Characters",
        civ:   !plural ? "Civilization" : "Civilizations",
        ide:   !plural ? "Ideology"     : "Ideologies",
        lore:  !plural ? "Lore"         : "Lores",
        org:   !plural ? "Organization" : "Organizations",
        party: !plural ? "Party"        : "Parties",
        town:  !plural ? "Town"         : "Towns"
    }

    return categories[cat] === undefined ? " " : categories[cat];
}

// Check if article id existence
export const checkArticleId = async (
    category: string,
    articleId: string
): Promise<boolean | void> => {

    if (articleId === "" || category === "") return;

    try {
        const getId: Response = await fetch(`${API}/api/v1/wiki/${category}/${articleId}/exist`);

        if (!getId.ok) return console.error(getId);
            
        const result: Record<string, any> = await getId.json();

        return result.is_exist;

    } catch(error) {
        console.error(error);
    }
}

// Upload selected image to cloud storage
export const uploadToCloudStorage = async (
    rawFile: File,
    folder: string
): Promise<Record<string, any> | void> => {
    if (!rawFile) return;

    // Create a binary data package
    const dataPackage: FormData = new FormData();
    dataPackage.append("file", rawFile);
    dataPackage.append("folder", folder);
    dataPackage.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
        const response: Response = await fetch(`${API}/api/v1/cloudinary/upload`, {
            method: "POST",
            body: dataPackage
        });
    
        const result: Record<string, any> = await response.json();

        return result;

    } catch (error) {
        console.error(error);
    }
}

// Validate all values of all inputs
export const checkAllValues = async (
    schema: Record<string, any>[],
    setSchema: React.Dispatch<React.SetStateAction<any[]>>,
    article: Record<string, any>,
    setArticle: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<any> => {

    // Check if article contains images
    let containImages: boolean = false;
    // Check article id existence
    const checkId: boolean = await checkArticleId(article.category, article.id) as boolean;

    if (article.title === "") return alert("Article title can't be empty");
    if (checkId) return alert("Article id is already exist!");
    if (article.cover === "") return alert("Article cover can't be empty!");
    if (schema.length === 0) return alert("You haven't add any content!");

    for (let i: number = 0; i < schema.length; i++) {
            
        const block: Record<string, any> = schema[i];
        const rejectionMessage: string = "These can't be empty at content " + (i + 1);

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
                containImages = true;
                break;

            default:
                return null;
        }
    }

    // Upload article cover to cloud storage
    const getCoverURL: Record<string, any> = await uploadToCloudStorage(article.raw_cover, "Cover") as Record<string, any>;
    // Clone current schema contents to modified
    const cloneSchema: Record<string, any>[] = [...schema];

    // Start converting local url to cloud storage url
    if (containImages) {
        for (let i: number = 0; i < cloneSchema.length; i++) {
            const imageContent: Record<string, any> = cloneSchema[i];

            if (imageContent.type === "image-type") {
                const getCloudURL: Record<string, any> = await uploadToCloudStorage(imageContent.raw_file, article.category) as Record<string, any>;

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
    const finalArticle: Record<string, any> = {
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
            const processUploading: Response = await fetch(`${API}/api/v1/contribution/upload`, {
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

            const splitedId: string[] = article.id.split("-");
            window.location.replace(`/wiki/Category:${getCategory(splitedId[splitedId.length - 1], true)}/${article.id}`);

            return true;

        } catch (error) {
            console.error(error);
        }
    }
}

// Sterilized user input to prevent XSS probability
export const sterilizedWord = (word: string): string => {

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
export const updateArticle = async (
    category: string,
    id: string,
    schema: Record<string, any>[]
): Promise<any> => {

    const images: Record<string, any>[] = schema.filter(img => img.type === "image-type");
    const cloneSchema: Record<string, any>[] = [...schema];

    if (images.length > 0) {

        const imagesToDelete: Record<string, any>[] = [];
        for (let i: number = 0; i < images.length; i++) {

            if (images[i].prev_url !== undefined && images[i]?.prev_url !== "") imagesToDelete.push(images[i]);
        }

        deleteCloudAssets("", imagesToDelete);

        const category: string[] = id.split("-");
        for (let i: number = 0; i < schema.length; i++) {

            const image = schema[i];
            if (image.type === "image-type" && image?.prev_url !== undefined && image?.prev_url !== "") {

                const getCloudURL: Record<string, any> = await uploadToCloudStorage(image.raw_file, getCategory(category[category.length - 1])) as Record<string, any>;

                if (getCloudURL) {
                    cloneSchema[i]["url"] = getCloudURL.secure_url;
                    cloneSchema[i]["public_id"] = getCloudURL.public_id;
                    delete cloneSchema[i]["raw_file"];
                    delete cloneSchema[i]["prev_url"];
                }
            }
        }
    }

    // Create final article data before updating
    const finalArticleUpdate: Record<string, any> = {
        id: id,
        wiki_content: cloneSchema
    }

    try {
        // Fetch request to backend API endpoint to update
        const response: Response = await fetch(`${API}/api/v1/contribution/update/${category}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(finalArticleUpdate)
        })
        const results: Record<string, any> = await response.json();

        alert("Successfully updated article!")
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

// Delete cloud storage assets based on article images
export const deleteCloudAssets = async (coverPublicId: string="", assets: Record<string, any>[]): Promise<any> => {
    
    const imagePublicIds: string[] = [];
    if (coverPublicId !== "") imagePublicIds.push(coverPublicId);

    for (let i = 0; i < assets.length; i++) {
        imagePublicIds.push(assets[i].public_id);
    }

    if (imagePublicIds.length > 0) {

        const publicIdsJSON: Record<string, any> = { public_ids: imagePublicIds }

        try {
            const response: Response = await fetch(`${API}/api/v1/cloudinary/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(publicIdsJSON)
            });
            const result: Record<string, any> = await response.json();

            if (!response.ok) return;

            return result;

        } catch (error) {
            console.error(error);
        }
    }
}

// Delete the article wiki
export const deleteArticleWiki = async (category: string, article_id: string): Promise<any> => {
    try {
        const response: Response = await fetch(`${API}/api/v1/wiki/${category}/${article_id}`, {
            method: "DELETE"
        })

        if (!response.ok) throw new Error(`Error: ${response}`);

        return true;

    } catch (error) {
        console.error(error);
    }
}