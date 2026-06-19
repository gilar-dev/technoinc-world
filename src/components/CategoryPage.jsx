import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";
import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../css/DynamicPage.css";

function CategoryPage() {

    // Get the id of dynamic route url
    const { categoryName } = useParams();
    
    // Get data from database
    const [data, setData] = useState([]);

    // Get data based on the chosen category
    useEffect(() => {
        fetch("/data/category.json")
        .then(result => result.json())
        .then(value => {
            const getCategory = value.find(item => item.categoryName === categoryName);
            setData(getCategory.list);
        })
        .catch(error => console.error(error));
    }, [categoryName]);

    return (
        <>
            <Menu wikiTitle={categoryName} selected={categoryName} setReplace={true} />

            <div className="mt-4 mb-[6em] flex flex-col items-center">
                <h2 className="highlight">{categoryName}</h2>
                <p className="mt-2 text-[small]">Category Page</p>
            </div>

            <div className="flex justify-evenly flex-wrap gap-y-[1em]">
                {data.map((item, idx) => {
                    return (
                        <Link key={idx} to={item.linkUrl} replace className="group w-[45%] aspect-square overflow-hidden cursor-pointer relative border border-[rgb(85,85,85)] transition-[border] ease-in-out duration-500 hover:border-white md:w-75">
                            <img src={item.imgUrl} alt={item.name} className="w-full h-full absolute group-hover:scale-[110%] transition-transform ease-in-out duration-500" />
                            <div className="w-full h-full absolute bg-linear-to-t from-black to-black/0"></div>
                            <p className="w-full p-[.5em] font-bold text-[.8em] text-center text-white absolute bottom-0 bg-linear-to-t from-black/50 to-black/0">{item.name}</p>
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