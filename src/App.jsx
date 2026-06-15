import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import Article from "./components/Article.jsx";
import Content from "./components/Content.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";

import { useState, useEffect } from "react";

function App() {

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

    // Add event listener to handle scroll event
    window.addEventListener("scroll", scrollShowUp);

    return () => {
      // Remove event listener from window when component is unbounded
      window.removeEventListener("scroll", scrollShowUp);
    }
  }, []);

  return (
    <>
      <Menu />
      <Header />
      <Article />
      <Content />
      <Faq />
      <Footer effect="scroll-effect" />
    </>
  );
}

export default App;