import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../css/Menu.css";

function Menu({wikiTitle="", selected="", setReplace=false, contribution=true}) {

    // Set the status of sidebar menu
    const [isActive, setIsActive] = useState("");

    // Define the website theme color
    const [theme, setTheme] = useState(
        localStorage.getItem("technoinc-theme") || "light"
    );

    // List of categories bucket
    const [categories, setCategories] = useState([]);

    // Function to switch to different theme
    const themeToggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
        setIsActive(isActive === "active" ? "" : "active")
    }

    // Set the value of isActive for sidebar menu
    const sidebarMenuClicked = () => setIsActive(isActive === "" ? "active" : "");

    const wikiTitleCheck = wikiTitle !== "" && <h6 id="wiki-title">{wikiTitle}</h6>;

    // Read the value of theme when changes
    useEffect(() => {
        localStorage.setItem("technoinc-theme", theme);
        document.body.classList.remove(theme === "light" ? "dark" : "light");
        document.body.classList.add(theme);
    }, [theme]);

    // Menu effect when the page is being scrolled
    useEffect(() => {
        fetch("https://technoinc-api.vercel.app/api/v1/wiki/categories")
        .then(result => result.json())
        .then(data => setCategories(data.category_list))
        .catch(error => console.error(error));

        const menuBox = document.querySelector(".menu-box");
        
        const scrollMovement = () => {
            if (window.scrollY === 0) menuBox.style.padding = ".7em";
            else menuBox.style.padding = ".5em";
        }

        for (let inputBox of document.querySelectorAll(".sidebar-checkbox")) {
            inputBox.checked = true; 
        }
    
        // Add event listener to component
        window.addEventListener("scroll", scrollMovement);
        
        // Remove event listener from component
        return () => {
            window.removeEventListener("scroll", scrollMovement);
        }
    }, []);

    return (
        <section className={`menu-panel ${theme}`}>

            <div className="menu-box">
                <button 
                    id="menu-btn"
                    title="Open sidebar menu"
                    onClick={sidebarMenuClicked}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div>
                    {wikiTitleCheck}
                    <h6 id="title" className="unchanged">TechnoInc MC Wiki</h6>
                </div>
                <a href="/contribution" title="Contribution" style={{display: !contribution && "none"}}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </a>
            </div>

            <div
                className="close-area-btn"
                onClick={sidebarMenuClicked}>
            </div>

            <div className={`sidebar-menu ${isActive}`}>
                <div className="sidebar-panel">
                    <a href="/" title="Home">
                        <h6>TechnoInc MC Wiki</h6>
                    </a>
                    <button 
                        id="sidebar-close-btn"
                        title="Close sidebar menu"
                        onClick={sidebarMenuClicked}>
                        <i className="fa-solid fa-x"></i>
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
                        <ul>
                            {categories.map((item, idx) =>
                                <Link key={idx} replace={setReplace} to={`/wiki/Category:${item}`} onClick={sidebarMenuClicked}>
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
                            <li onClick={themeToggle}>
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
            </div>

        </section>
    );
}

// Define the Menu props data type
Menu.PropTypes = {
    wikiTitle: PropTypes.string,
    selected: PropTypes.string,
    setReplace: PropTypes.bool,
    contribution: PropTypes.bool
}

export default Menu;