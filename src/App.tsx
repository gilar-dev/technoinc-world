import Menu from "./components/Menu";
import Header from "./components/Header";
import Article from "./components/Article";
import Content from "./components/Content";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import InspireBox from "./components/ContributionEditor/Components/InspireBox";
import { ReactElement, useEffect } from "react";

function App(): ReactElement {
    
    useEffect(() => {
        // Apply a show-up effect to element with specific class
        const scrollShowUp = () => {
            [...document.querySelectorAll(".scroll-effect")].forEach(item => {
                const itemRect: DOMRect = item.getBoundingClientRect();

                if (itemRect.top - (itemRect.height / 2) <= window.innerHeight) {
                    const itemStyle: HTMLElement = item as HTMLElement;
                    itemStyle.style.opacity = "1";
                    itemStyle.style.transform = "translateY(0)";
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