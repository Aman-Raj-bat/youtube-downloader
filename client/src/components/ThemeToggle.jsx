import { useState, useEffect } from 'react';
import './ThemeToggle.css';

function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <label className="theme-toggle-switch" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <input
                type="checkbox"
                checked={theme === 'light'}
                onChange={toggleTheme}
            />
            <span className="slider round">
                <span className="icon-wrapper">
                    {/* Subtle icon placement */}
                    <span className="icon moon">🌙</span>
                    <span className="icon sun">☀️</span>
                </span>
            </span>
        </label>
    );
}

export default ThemeToggle;
