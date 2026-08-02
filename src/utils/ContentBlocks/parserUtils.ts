import { ResObject, Schema } from "../typesUtils";

export function contentGrouper(content: Schema): Schema {

    const group: Schema = [];

    for (let index: number = 0; index < content.length; index++) {
        const block: ResObject = content[index];
        const last: number = group.length - 1;

        if (block.type === "gen-heading-type") {
            group.push([block]);
            continue;
        }

        if (block.type.includes("ib")) {
            if (Array.isArray(group[last])) {
                // If last index collection contains 'ib', means it's infobox collection
                if (group[last][0].type.includes("ib")) {
                    group[last].push(block);
                    continue;
                } else if (group[last][0].type === "gen-heading-type") {
                    if (Array.isArray(group[last][group[last].length - 1])) {
                        if (group[last][group[last].length - 1][0].type.includes("ib")) {
                            group[last][group[last].length - 1].push(block);
                            continue;
                        } else {
                            group[last].push([block]);
                            continue;
                        }
                    } else {
                        group[last].push([block]);
                        continue;
                    }
                } else {
                    group.push([block]);
                    continue;
                }
            } else {
                group.push([block]);
                continue;
            }
        }

        if (!Array.isArray(group[last])) group.push(block);
        else if (Array.isArray(group[last])) {
            if (group[last].some((item: ResObject) => !item.type.includes("ib"))) {
                group[last].push(block);
            }
        }
    }

    return group;
}