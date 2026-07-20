import { API, PublicID, ResObject, UploadConfig } from "./typesUtils";

// Delete assets from cloudinary using array of public ids
export async function deleteAssets(publicIDs: PublicID): Promise<any> {
    try {
        // Fetch request to backend for deleting cloud assets
        const response: Response = await fetch(`${API}/api/v1/cloudinary/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_ids: publicIDs })
        });
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}
// Upload assets to cloudinary cloud storage
export async function uploadToCloud(dataPackage: FormData): Promise<any> {
    try {
        const response: Response = await fetch(`${API}/api/v1/cloudinary/upload`, {
            method: "POST",
            body: dataPackage
        });
        // If response is not ok, throw error
        if (!response.ok) throw new Error(`${response}`);

        // Return the successful fetch response data
        const result: ResObject = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}

// Pack upload file and bundle it to FormData
export function uploadPackage(rawFile: File, config: UploadConfig): FormData {

    const dataPackage: FormData = new FormData();
    dataPackage.append("file", rawFile); // Assets file
    dataPackage.append("folder", config.folder); // Cloud storage folder
    dataPackage.append("upload_preset", config.uploadPreset); // Cloud storage upload preset

    // Return created final data package
    return dataPackage;
}