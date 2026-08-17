// Export types
export type Schema = ArticleObject<string, any>[];
export type PublicID = string[];
export type ResObject = Record<string, any>;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type MoveDirections = "up" | "down";

// Export interfaces
export interface UploadConfig {
    folder: string; // Cloudinary folder name
    uploadPreset: string; // Cloudinary upload preset
}

export interface ArticleConfig {
    title: string;
    id: number;
    description: string;
    raw_cover: File | undefined; // Temporary
    cover: string;
    public_id: string;
    visited: number;
    classification: Classification;
    category: Category[];
    history: History[];
    wiki_content: Schema;
}

export interface TimeAndDate {
    hour: string;
    minute: string;
    date: string;
    month: string;
    year: string;
}

export interface History {
    status: "created" | "edited";
    user: string;
    summary: string;
    time: [string, string];
    date: [string, string, string];
    modify_logs: ModifyAction[];
}

export interface ModifyAction {
    action: "add" | "move" | "delete";
    block: string;
}

// Export essential variables
export const API: string = import.meta.env.VITE_API;
export const ArticleTemplate: ArticleConfig = {
    title: "",
    id: 0,
    description: "",
    raw_cover: undefined, // Temporary
    cover: "",
    public_id: "",
    visited: 0,
    classification: "Start",
    category: [],
    history: [],
    wiki_content: []
}

// Internal configurations
// Article object type annotations
type ArticleObject<Key extends string, Value> = { [K in Key]: Value };
type Category = string;
type Classification = "Start" | "GA" | "FA";