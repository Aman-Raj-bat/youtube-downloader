import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
    return (
        <header className="app-header">
            <div className="header-title-group">
                <h1 className="header-title">Media Stream Analyzer</h1>
                {/* <span className="header-badge">BETA</span> */}
            </div>
            <ThemeToggle />
        </header>
    );
}

export default Header;
