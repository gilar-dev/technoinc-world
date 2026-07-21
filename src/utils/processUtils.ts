import { ResObject } from "./typesUtils";

export function processMessage(passed: boolean, message: string, index: number | undefined=undefined): ResObject {
    return {
        passed: passed,
        message: message,
        index: index
    }
}