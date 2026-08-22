import { History, TimeAndDate } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { createDate, parseDate } from "../../../utils/articleUtils";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../css/DynamicPage.css";

interface PropTypes {
    articleTitle: string;
    categories: string[];
    modifyInfo: History;
}

interface ContextTypes {
    light: boolean;
}

function WikiInfo({ articleTitle, categories, modifyInfo }: PropTypes): React.JSX.Element {

    const { light } = useContext<ContextTypes>(Config);

    // History date informations
    const modifiedStatus: string = modifyInfo.status;
    const modifiedDate: TimeAndDate = parseDate(modifyInfo.date);
    const currentDate: TimeAndDate = parseDate(createDate());

    // Check if latest modify date is still within a week
    const getDateInfo = (): string => {
        const dateRange: number = currentDate.date[2] - modifiedDate.date[2];
        const months: string[] = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novermber", "December"
        ];
        if (!currentDate.date.some((item: number, index: number) => item !== modifiedDate.date[index])) return "today";
        else if (currentDate.date[1] === modifiedDate.date[1]) return `${dateRange === 1 ? "yesterday" : `${dateRange} days ago`}`;
        else return `on ${modifiedDate.date[2]} ${months[modifiedDate.date[1] - 1]} ${modifiedDate.date[0]}`;
    }

    return (
        <div className={`pb-3 bg-gray-300 ${!light && "bg-gray-700"}`}>
            <Link to={`/wiki/${articleTitle.replaceAll(" ", "_")}/history`}
                className={`group p-3 cursor-pointer font-['Inter'] leading-relaxed flex items-center gap-3 border-t border-b border-gray-500 text-black
                    ${!light && "text-white"} ${getDateInfo() === "today" && "text-white bg-blue-500"}`}
            >
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span className="group-hover:underline font-medium text-[14px]">
                    This page was {modifiedStatus === "created" ? "created" : "last edited"} {getDateInfo()}, at {`${modifiedDate.time[0]}.${modifiedDate.time[1] < 10 ? "0" : ""}${modifiedDate.time[1]}`}.
                </span>
                <i className="fa-solid fa-angle-right ml-auto"></i>
            </Link>
            <div className={`m-3 p-3 font-['Inter'] text-[14px] border border-gray-500 bg-gray-700/10 [&_a]:hover:underline ${!light && "bg-gray-800/30"}`}>
                <ul className="list-none flex items-center flex-wrap">
                    <span>Categories:</span>
                    {categories.map((category: string, index: number) => (
                        <li key={index} className={`my-1 px-3 border-l border-gray-500 ${index === 0 && "border-l-0"}`}>
                            <Link to={`/category/${category.replaceAll(" ", "_")}`} className={`${!light && "text-blue-400 border-white visited:text-purple-400"}`}>{category}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={`mx-3 font-['Inter'] border-b border-gray-500 ${!light && "bg-gray-500/50"}`}><img src="/assets/icons/technoinc-wiki-logo.png" className="w-[50%]"></img></div>
            <div className={`m-3 font-['Inter'] text-[14px leading-relaxed] [&_span]:text-[14px] [&_a]:hover:underline ${!light && "[&_a]:text-blue-400 [&_a]:visited:text-purple-400"}`}>
                <span>Page was rendered with internal <a href="/wiki/WikiRenderer">WikiRenderer</a>.</span><br />
                <span>From <a href="/">TechnoInc</a>, a free Minecraft encyclopedia.</span><br /><br />
                <ul className={`list-none text-[14px] flex items-center gap-3 ${!light && "**:text-blue-400 **:visited:text-purple-400"}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><span className="w-1 aspect-square block rounded-[100%] bg-purple-400"></span></li>
                    <li><Link to="#">About</Link></li>
                    <li><span className="w-1 aspect-square block rounded-[100%] bg-purple-400"></span></li>
                    <li><Link to="/contribution">Contribution</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default WikiInfo;