import { useEffect } from "react";
import "../css/Menu.css";

function Menu({ theme, themeToggle, sidebarStats }) {

    // Set the value of isActive for sidebar menu
    const sidebarMenuClicked = () => sidebarStats[1](sidebarStats[0] === "active" ? "" : "active");

    useEffect(() => {
        const menuBox = document.querySelector(".menu-box");
        
        const scrollMovement = () => {
            if (window.scrollY === 0) menuBox.style.padding = "1em";
            else menuBox.style.padding = ".8em";
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
            <h6>TechnoInc MC Wiki</h6>
            </div>

            <div
                className="close-area-btn"
                onClick={sidebarMenuClicked}>
            </div>

            <div className={`sidebar-menu ${sidebarStats[0] ? "active" : ""}`}>
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
                        <ul>
                            <li><a href="#">Civilizations</a></li>
                            <li><a href="#">Characters</a></li>
                            <li><a href="#">Ideologies</a></li>
                            <li><a href="#">Organizations</a></li>
                            <li><a href="#">Parties</a></li>
                            <li><a href="#">Towns</a></li>
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
                                <a href="#">Interactive map</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default Menu;