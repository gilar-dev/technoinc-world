// Export types
export type Schema = ArticleObject<string, any>[];
export type PublicID = string[];
export type ResObject = Record<string, any>;

// Export interfaces
export interface UploadConfig {
    folder: string; // Cloudinary folder name
    uploadPreset: string; // Cloudinary upload preset
}

export interface ArticleConfig {
    id: string;
    title: string;
    category: string;
    cover: string;
    public_id: string;
    wiki_content: ResObject[];
}

// Export essential variables
export const API: string = import.meta.env.VITE_API;

// Internal configurations
type ArticleObject<Key extends string, Value> = { [K in Key]: Value; }