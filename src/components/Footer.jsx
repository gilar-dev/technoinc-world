import "../css/Footer.css";
import PropTypes from "prop-types";

function Footer({ effect="" }) {

    return (
        <footer>
            <p className={`${effect} unchanged`}>&copy; Copyright {new Date().getFullYear()} <strong>TechnoInc</strong>. All rights reserved.</p>
            <span className={effect}>
                <a href="https://www.instagram.com/_glrin?igsh=MW5vMWhlMXZqZmJvNA==" target="_blank" title="Instagram">
                    <i className="fa-brands fa-instagram"></i>
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

Footer.propTypes = {
    effect: PropTypes.string
}

export default Footer;