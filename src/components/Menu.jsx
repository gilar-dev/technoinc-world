import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Menu.css";

function Menu({ wikiTitle }) {

    // Set the status of sidebar menu
    const [isActive, setIsActive] = useState("");

    // Define the website theme color
    const [theme, setTheme] = useState(
        localStorage.getItem("technoinc-theme") || "light"
    );

    // Function to switch to different theme
    const themeToggle = () => {
        setTheme(theme === "light" ? "dark" : "light");
        setIsActive(isActive === "active" ? "" : "active")
    }

    // Set the value of isActive for sidebar menu
    const sidebarMenuClicked = () => setIsActive(isActive === "" ? "active" : "");

    const wikiTitleCheck = wikiTitle !== undefined && <h6 id="wiki-title">{wikiTitle}</h6>;

    // Read the value of theme when changes
    useEffect(() => {
        localStorage.setItem("technoinc-theme", theme);
        document.body.classList.remove(theme === "light" ? "dark" : "light");
        document.body.classList.add(theme);
    }, [theme]);

    // Menu effect when the page is being scrolled
    useEffect(() => {
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

    // List of category in sidebar menu
    const categoryList = [
        "Civilizations",
        "Characters",
        "Ideologies",
        "Organizations",
        "Parties",
        "Towns",
    ];

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
                    <h6 id="title">TechnoInc MC Wiki</h6>
                </div>
            </div>

            <div
                className="close-area-btn"
                onClick={sidebarMenuClicked}>
            </div>

            <div className={`sidebar-menu ${isActive}`}>
                <div className="sidebar-panel">
                    <h6>TechnoInc MC Wiki</h6>
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
                        <ul>{
                            categoryList.map(item =>
                            <Link 
                                key={item}
                                to={`/category/${item.toLowerCase()}`}
                                onClick={sidebarMenuClicked}
                                style={{textDecoration: "none"}}>
                                <li>{item}</li>
                            </Link>)
                        }</ul>
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

export default Menu;