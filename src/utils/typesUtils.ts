// Export types
export type Schema = ArticleObject<string, any>[];
export type PublicID = string[];
export type ResObject = Record<string, any>;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Export interfaces
export interface UploadConfig {
    folder: string; // Cloudinary folder name
    uploadPreset: string; // Cloudinary upload preset
}

export interface ArticleConfig {
    id: string;
    title: string;
    category: string;
    raw_cover: File | undefined; // Temporary
    cover: string;
    public_id: string;
    wiki_content: ResObject[];
}

// Export essential variables
export const API: string = import.meta.env.VITE_API;

// Internal configurations
type ArticleObject<Key extends string, Value> = { [K in Key]: Value; }