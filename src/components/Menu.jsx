import Loading from "./Loading";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes, { func } from "prop-types";
import "../css/Menu.css";

function Menu({ wikiTitle="", selected="", setReplace=false, contribution=true, search=false, setSearch, menuContent=[], setLight }) {

    // Set the status of sidebar menu
    const [isActive, setIsActive] = useState("");
    const [loading, setLoading] = useState(false);

    // Define the website theme color
    const [theme, setTheme] = useState(
        localStorage.getItem("technoinc-theme") || "light"
    );

    // List of categories bucket
    const [categories, setCategories] = useState([]);

    // Function to switch to different theme
    const themeToggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
        setIsActive(isActive === "active" ? "" : "active");
    }

    // Set the value of isActive for sidebar menu
    const sidebarMenuClicked = () => {
        setIsActive(isActive === "" ? "active" : "");
    }

    const wikiTitleCheck = wikiTitle !== "" && <h6 id="wiki-title">{wikiTitle}</h6>;

    // Menu effect when the page is being scrolled
    useEffect(() => {
        
        const API = import.meta.env.VITE_API;
        const menuBox = document.querySelector(".menu-box");

        for (let inputBox of document.querySelectorAll(".sidebar-checkbox")) {
            inputBox.checked = true; 
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API}/api/v1/wiki/categories`);
                const result = await response.json();

                setCategories(result.category_list);
                setLoading(false);
                 
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        
        const scrollMovement = () => {
            if (window.scrollY === 0) menuBox.style.padding = ".7em";
            else menuBox.style.padding = ".5em";
        }

        fetchData();
    
        // Add event listener to component
        window.addEventListener("scroll", scrollMovement);
        
        // Remove event listener from component
        return () => {
            window.removeEventListener("scroll", scrollMovement);
        }
    }, []);

    // Read the value of theme when changes
    useEffect(() => {
        localStorage.setItem("technoinc-theme", theme);
        document.body.classList.remove(theme === "light" ? "dark" : "light");
        document.body.classList.add(theme);
        if (setLight) setLight("light" === theme);
    }, [theme]);

    useEffect(() => {
        document.body.style.overflow = isActive === "active" ? "hidden" : "visible";
    }, [isActive]);

    return (
        <section className={`menu-panel ${theme}`}>

            <div className="menu-box">
                <button 
                    id="menu-btn"
                    title="Open sidebar menu"
                    onClick={() => sidebarMenuClicked()}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div>
                    {wikiTitleCheck}
                    <h6 id="title" className="unchanged">TechnoInc MC Wiki</h6>
                </div>
                <a href="/contribution" title="Contribution" style={{display: !contribution && "none"}}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </a>
                <a
                    title="Search article to modify"
                    style={{display: contribution && "none" || search && "none"}}
                    onClick={() => setSearch(true)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </a>
                <a
                    title="Close"
                    style={{display: !search && "none"}}
                    onClick={() => setSearch(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </a>
            </div>

            <div
                className="close-area-btn"
                onClick={() => sidebarMenuClicked()}>
            </div>

            <div className={`sidebar-menu ${isActive}`}>
                <div className="sidebar-panel">
                    <a href="/" title="Home">
                        <h6>TechnoInc MC Wiki</h6>
                    </a>
                    <button 
                        id="sidebar-close-btn"
                        title="Close sidebar menu"
                        onClick={() => sidebarMenuClicked()}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="sidebar-list">
                    <input id="list-category" className="sidebar-checkbox" type="checkbox"></input> 
                    <label className="list-title" htmlFor="list-category">
                        <span className="title">Categories</span>
                        <span className="dropdown-icon">
                            <i className="fa-solid fa-angle-down"></i>
                        </span>
                    </label>
                    <div className="list-box">

                        <Loading show={loading} />

                        <ul>
                            {categories.map((item, idx) =>
                                <Link key={idx} replace={setReplace} to={`/wiki/Category:${item}`} onClick={() => sidebarMenuClicked()}>
                                    <li className={selected === item ? "selected" : ""}>{item}</li>
                                </Link>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="sidebar-list">
                    <input id="list-featured" className="sidebar-checkbox" type="checkbox"></input> 
                    <label className="list-title" htmlFor="list-featured">
                        <span className="title">Featured</span>
                        <span className="dropdown-icon">
                            <i className="fa-solid fa-angle-down"></i>
                        </span>
                    </label>
                    <div className="list-box featured">
                        <ul>
                            <li onClick={() => themeToggle()}>
                                <i className={`fa-solid ${theme === "light" ? "fa-sun" : "fa-moon"}`}></i>
                                <p>Switch theme</p>
                            </li>
                            <li>
                                <i className="fa-regular fa-map"></i>
                                <p>Interactive map</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    style={{display: menuContent.length === 0 ? "none" : "block"}}
                    className="sidebar-list">
                    <input id="list-contents" className="sidebar-checkbox" type="checkbox"></input> 
                    <label className="list-title" htmlFor="list-contents">
                        <span className="title">Contents</span>
                        <span className="dropdown-icon">
                            <i className="fa-solid fa-angle-down"></i>
                        </span>
                    </label>
                    <div className="list-box">
                        <ul>
                            {menuContent.map((content, index) => (
                                <li
                                    key={index}
                                    className="content"
                                    onClick={() => sidebarMenuClicked()}>
                                    <a
                                        href={`#content${index + 1}`}
                                        onClick={(e) => {
                                            e.preventDefault();

                                            history.replaceState(null, "", `content${index + 1}`);

                                            const target = document.getElementById(`content${index + 1}`);
                                            if (target) {
                                                target.scrollIntoView({ behavior: "smooth" });
                                            }
                                        }}>
                                        {content.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </section>
    );
}

// Define the Menu props data type
Menu.PropTypes = {
    wikiTitle: PropTypes.string,
    selected: PropTypes.string,
    setReplace: PropTypes.bool,
    contribution: PropTypes.bool,
    search: PropTypes.bool,
    setSearch: PropTypes.func,
    menuContent: PropTypes.array,
    setLight: PropTypes.func
}

export default Menu;