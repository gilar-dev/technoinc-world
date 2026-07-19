import Menu from "./components/Menu";
import Header from "./components/Header";
import Article from "./components/Article";
import Content from "./components/Content";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import { ReactElement, useEffect } from "react";

function App(): ReactElement {
    
    // Apply a show-up effect to element with specific class
    useEffect(() => {

        const scrollShowUp = () => {
            [...document.querySelectorAll(".scroll-effect")].forEach((item: Element) => {
                const itemRect: DOMRect = item.getBoundingClientRect();

                if (itemRect.top - (itemRect.height / 2) <= window.innerHeight) {
                    (item as HTMLElement).style.opacity = "1";
                    (item as HTMLElement).style.transform = "translateY(0)";
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