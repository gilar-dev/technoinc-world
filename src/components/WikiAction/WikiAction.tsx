import Menu from "../Menu";
import Footer from "../Footer";
import { ArticleConfig, API } from "../../utils/typesUtils";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const actions: string[] = ["history", "info"];

function WikiAction(): React.JSX.Element {

    const { contentID, actionName } = useParams<string>();

    const [articleData, setArticleData] = useState<ArticleConfig | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!contentID) return;
        const filteredContentID: string = contentID.replaceAll("_", " ").toLowerCase();
        let ignore: boolean = false;

        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                const response: Response = await fetch(`${API}/api/v1/wiki/get/${"sdade"}`);
                const json: any = await response.json();
                console.log(json);

                if (!ignore) {
                    setArticleData(json.article);

                    if (actionName && actions.includes(actionName.toLowerCase())) {
                        if (contentID.replaceAll("_", " ") !== json.article.title || !actions.includes(actionName)) {
                            window.location.replace(`/wiki/${json.article.title.replaceAll(" ", "_")}/${actionName.toLowerCase()}`);
                        }
                    }
                }
            } catch (error) {
                console.error("Unable to fetch data:", error);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        fetchData();

        return () => { ignore = true; }
    }, []);

    return (
        <>
            <Menu />
            <Footer />
        </>
    );
}

export default WikiAction;