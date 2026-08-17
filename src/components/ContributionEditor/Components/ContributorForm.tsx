import { Contributor } from "../ContributionPage";
import { SetState } from "../../../utils/typesUtils";
import { useEffect } from "react";
import "../../../css/DynamicPage.css";

interface PropTypes {
    setState: [Contributor, SetState<Contributor>];
}

function ContributorForm({ setState }: PropTypes): React.JSX.Element {

    const [contributor, setContributor] = setState;

    useEffect(() => {
        setContributor({ ...contributor, user: localStorage.getItem("temporary-user") || "" });
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center fixed top-0">
            <div className="m-3 p-3 font-['Inter'] flex flex-col gap-3 border border-white bg-white shadow-2xs shadow-black">
                <h2>Contributor validation</h2>
                <div>We need your name or alias to continue modifying this article</div>
                <input id="user-input" placeholder="Your name or alias" value={contributor.user}
                    className="p-1"
                    onChange={(e) => setContributor({ ...contributor, user: e.target.value })} />
                <textarea placeholder="Summary (optional)" value={contributor.summary}
                    className="w-ful p-1 font-['Inter'] field-sizing-content resize-none"
                    onChange={(e) => setContributor({ ...contributor, summary: e.target.value })} />
                <button
                    className="p-1 font-semibold"
                    onClick={() => {
                        localStorage.setItem("temporary-user", contributor.user);
                        setContributor({ ...contributor, show: false });
                    }}
                >Submit</button>
            </div>
        </div>
    );
}

export default ContributorForm;