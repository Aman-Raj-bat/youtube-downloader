import './Footer.css';

function Footer() {
    return (
        <footer className="footer-container">
            {/* Top Section: Links & Info (Britannica Style) */}
            <div className="footer-content">

                {/* Column 1: Brand & Disclaimer */}
                <div className="footer-column brand-column">
                    <h3 className="footer-heading">Media Stream Analyser</h3>
                    <p className="footer-text disclaimer-text">
                        This tool is intended for personal and educational use only.
                        Users are solely responsible for complying with YouTube's Terms of Service and applicable copyright laws.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-column">
                    <h3 className="footer-heading">Product</h3>
                    <ul className="footer-links">
                        <li><a href="#">Analyze Video</a></li>
                        <li><a href="#">Supported Formats</a></li>
                        <li><a href="#">How it Works</a></li>
                    </ul>
                </div>

                {/* Column 3: Legal */}
                <div className="footer-column">
                    <h3 className="footer-heading">Legal</h3>
                    <ul className="footer-links">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                    </ul>
                </div>

                {/* Column 4: Stay Connected */}
                <div className="footer-column">
                    <h3 className="footer-heading">Stay Connected</h3>
                    <div className="social-icons">
                        {/* Simple SVG placeholders for social icons */}
                        <a href="#" aria-label="Twitter">
                            <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 4.75 12.92 12.92 0 0 1-9.4-4.75 4.48 4.48 0 0 0 1.4 6 4.48 4.48 0 0 1-2-.56v.05a4.48 4.48 0 0 0 3.6 4.4 4.48 4.48 0 0 1-2 .08 4.48 4.48 0 0 0 4.2 3.1 9 9 0 0 1-6.7 2.3 12.7 12.7 0 0 0 6.9 2 12.7 12.7 0 0 0 12.7-12.7v-.6a9.1 9.1 0 0 0 2.3-2.4z" /></svg>
                        </a>
                        <a href="#" aria-label="GitHub">
                            <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 0 0-3.9 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.5 1.4-3.5-.2-.3-.6-1.6.1-3.5 0 0 1.1-.4 3.6 1.3 1-.3 2.1-.5 3.2-.5 1.1 0 2.2.2 3.2.5 2.5-1.7 3.6-1.3 3.6-1.3.7 1.9.3 3.2.1 3.5.9 1 1.4 2.2 1.4 3.5 0 4.7-2.8 5.7-5.5 6 .5.6.9 1.5.9 3v4.5c0 .4.2.7.8.6A12 12 0 0 0 12 0z" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Legal Links & Copyright */}
            <div className="footer-bottom">
                <div className="footer-bottom-links">
                    <a href="#">About Us & Legal Info</a>
                    <a href="#">Contact Us</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                </div>
                <p className="footer-copyright">© 2025 Aman Raj. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
