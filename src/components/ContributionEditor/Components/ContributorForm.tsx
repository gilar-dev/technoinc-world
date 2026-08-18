import { Contributor } from "../ContributionPage";
import { SetState } from "../../../utils/typesUtils";
import { Config } from "../../../utils/contextUtils";
import { useRef, useEffect, useContext } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    setState: [Contributor, SetState<Contributor>];
    uploadProcess?: () => Promise<void>;
    updateProcess?: () => Promise<void>;
}

interface ContextTypes {
    light: boolean;
}

function ContributorForm({ setState, uploadProcess, updateProcess }: PropTypes): React.JSX.Element {

    const [contributor, setContributor] = setState;
    const { light } = useContext<ContextTypes>(Config);
    const userName = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setContributor({ ...contributor, user: localStorage.getItem("temporary-user") || "" });
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center fixed top-0">
            <div className={`m-3 p-3 font-['Inter'] flex flex-col gap-3 border border-white bg-white shadow-2xs shadow-black ${!light && "bg-gray-700!"}`}>
                <h2>Contributor validation</h2>
                <div>We need your name or alias to continue modifying this article</div>
                <input ref={userName} id="user-input" placeholder="Your name or alias" value={contributor.user}
                    className="p-1 border-solid border-white"
                    onChange={(e) => setContributor({ ...contributor, user: e.target.value })}
                    onFocus={(e) => e.target.style.backgroundColor = "#fff"} />
                <textarea placeholder="Summary (optional)" value={contributor.summary}
                    className="w-ful p-1 font-['Inter'] field-sizing-content resize-none"
                    onChange={(e) => setContributor({ ...contributor, summary: e.target.value })} />
                <button
                    className="p-1 font-semibold"
                    onClick={() => {
                        if (contributor.user === "") {
                            if (userName.current) {
                                userName.current.placeholder = "Please write your name or alias";
                                userName.current.style.backgroundColor = "rgba(255,0,0,.3)";
                            }
                            return;
                        }
                        localStorage.setItem("temporary-user", contributor.user);
                        setContributor({ ...contributor, show: false });

                        if (uploadProcess) uploadProcess();
                        else if (updateProcess) updateProcess();
                    }}
                >Submit</button>
            </div>
        </div>
    );
}

export default ContributorForm;