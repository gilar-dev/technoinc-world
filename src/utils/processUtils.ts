import { ResObject } from "./typesUtils";

export function processMessage(passed: boolean, message: string): ResObject {
    return {
        passed: passed,
        message: message
    }
}