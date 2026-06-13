import { useEffect } from "react";
import "../css/Header.css";

function Header() {

    // A transform effect when do content is loaded 
    useEffect(() => {
        const titleImg = document.getElementById("title-img");
        const logoTitleText = document.querySelector(".logo-title-text");

        titleImg.style.transform = "translateY(0)";
        titleImg.style.opacity = "1";
        logoTitleText.style.transform = "translateY(0)";
        logoTitleText.style.opacity = "1";
    }, []);

    return (
        <header className="header-container">
            <div className="technoinc-logo">
                <div id="linear-bg"></div>
                <img id="title-img" src="/assets/icons/technoinc-logo.png"></img>
                <div className="logo-title-text">
                    <h1>A World of TechnoInc</h1>
                    <p className="unchanged">
                        The story of someone's Minecraft survival world since 2021 with much experience
                        built on diplomacy, warfare, and player-driven storytelling. Whether you're 
                        founding a civilization, mastering foreigner's language, or carving your legacy 
                        into history, TechnoInc offers a dynamic experience where your actions matter.
                    </p>
                </div>
            </div>
        </header>
    );
}

export default Header;