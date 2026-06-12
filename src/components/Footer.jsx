import { useEffect } from "react";
import "../css/Footer.css"

function Footer() {

    useEffect(() => {
        const scrollShow = () => {

        }

        window.addEventListener
    }, []);

    return(
        <footer>
            <p className="scroll-effect unchanged">&copy; Copyright {new Date().getFullYear()} <strong>TechnoInc</strong>. All rights reserved.</p>
            <span className="scroll-effect">
                <a href="https://www.instagram.com/_glrin?igsh=MW5vMWhlMXZqZmJvNA==" target="_blank" title="Instagram">
                    <i className="fa-brands fa-instagram"></i>
                </a>
            </span>
            <span className="scroll-effect">
                <a href="https://www.github.com/gilar-dev" target="_blank" title="GitHub">
                    <i className="fa-brands fa-github"></i>
                </a>
            </span>
        </footer>
    );
}

export default Footer;