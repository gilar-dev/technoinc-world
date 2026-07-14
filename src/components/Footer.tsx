import { ReactElement } from "react";
import "../css/Footer.css";

interface propTypes {
    effect?: string;
}

function Footer({ effect="" }: propTypes): ReactElement {

    return (
        <footer>
            <p className={`${effect} unchanged`}>&copy; Copyright {new Date().getFullYear()} <strong>TechnoInc</strong>. All rights reserved.</p>
            <span className={effect}>
                <a href="https://www.instagram.com/_glrin?igsh=MW5vMWhlMXZqZmJvNA==" target="_blank" title="Instagram">
                    <i className="fa-brands fa-instagram"></i>
                </a>
            </span>
            <span className={effect}>
                <a href="https://www.linkedin.com/in/gilar-hafizh-indarto-b1891941a?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" title="LinkedIn">
                    <i className="fa-brands fa-linkedin"></i>
                </a>
            </span>
            <span className={effect}>
                <a href="https://www.github.com/gilar-dev" target="_blank" title="GitHub">
                    <i className="fa-brands fa-github"></i>
                </a>
            </span>
        </footer>
    );
}

export default Footer;