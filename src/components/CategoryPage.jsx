import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";
import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../css/DynamicPage.css";

function CategoryPage() {

    // Get the id of dynamic route url
    const { categoryName } = useParams();
    const getCategory = categoryName.split(":")[1];
    
    // Get data from database
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get data based on the chosen category
    useEffect(() => {
        setData([]);

        const fetchData = async () => {

            const API = import.meta.env.VITE_API;
            
            try {
                setLoading(true);
                let convertedName = getCategory.toLowerCase();

                // Convert plural name to singular name
                if (convertedName.includes("ies")) convertedName = convertedName.replaceAll("ies", "y");
                else convertedName = convertedName.slice(0, convertedName.length - 1);

                // Fetch request to backend
                const response = await fetch(`${API}/api/v1/wiki/${convertedName}/articles`);
                const articles = await response.json();

                setLoading(false);
                setData(articles.articles);

            } catch(error) {
                console.error(error);
            }
        }

        fetchData();
    }, [categoryName]);

    return (
        <>
            <Menu wikiTitle={getCategory} selected={getCategory} setReplace={true} />

            <div className="mt-4 mb-[6em] flex flex-col items-center">
                <h2>
                    <span className="highlight">{getCategory}</span>
                </h2>
                <p className="mt-2 text-[small]">Category Page</p>
            </div>

            <div
                style={{display: loading ? "flex" : "none"}}
                className="w-full min-h-[50vh] flex justify-center items-center">
                <div className="w-[20%] aspect-square bg-[url('/assets/icons/loading-pixel.gif')] bg-center bg-cover bg-no-repeat"></div>
            </div>

            <p
                style={{display: !loading && data.length === 0 ? "block" : "none"}}
                className="text-center">
                Seems like this category does not have articles yet.
            </p>
            
            <div className="flex justify-evenly flex-wrap gap-y-[1em]">
                {data.map((item, idx) => {
                    return (
                        <Link key={idx} to={`/wiki/${categoryName}/${item.id}`} className="group w-[45%] aspect-square overflow-hidden cursor-pointer relative border border-[rgb(85,85,85)] transition-[border] ease-in-out duration-500 hover:border-white md:w-75">
                            <img src={item.cover} alt={item.title} className="w-full h-full absolute group-hover:scale-[110%] transition-transform ease-in-out duration-500" />
                            <div className="w-full h-full absolute bg-linear-to-t from-black to-black/0"></div>
                            <p className="w-full p-[.5em] font-bold text-[.8em] text-center text-white absolute bottom-0 bg-linear-to-t from-black/50 to-black/0">{item.title}</p>
                        </Link>
                    )
                })
            }
            </div>

            <Footer />
        </>
    );
}

export default CategoryPage;