import { useState, useEffect } from "react";

// Import custom components
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import Article from "./components/Article.jsx";
import Content from "./components/Content.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";

// Import another file
import data from "./data/civilization.json";

function App() {

  // Set the status of sidebar menu
  const [isActive, setIsActive] = useState();
    
  // Set the theme of website
  const[theme, setTheme] = useState(() => {
    return localStorage.getItem("technoinc-theme") || "light";
  });
  
  // A switch to move to different theme
  const themeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setIsActive(isActive === "active" ? "" : "active")
  }

  // Read the value of theme when changing
  useEffect(() => {

    localStorage.setItem("technoinc-theme", theme);
    document.body.classList.remove(theme === "light" ? "dark" : "light");
    document.body.classList.add(theme);
  }, [theme]);

  // Apply a show-up effect to element with specific class
  useEffect(() => {

    const scrollShowUp = () => {
      [...document.querySelectorAll(".scroll-effect")].forEach(item => {
        const itemRect = item.getBoundingClientRect();

        if (itemRect.top - (itemRect.height / 2) <= window.innerHeight) {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }
      });
    }

    window.addEventListener("scroll", scrollShowUp);

    return () => {
      window.removeEventListener("scroll", scrollShowUp);
    }
  }, []);

  return (
    <>
      <Menu theme={theme} themeToggle={themeToggle} sidebarStats={[isActive, setIsActive]} />
      <Header />
      <Content />
      <Faq />
      <Footer />
    </>
  );
}

export default App;