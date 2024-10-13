"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true';
        }
        return false;
    });

    useEffect(() => {
        const themeSelector = isDarkMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", themeSelector);
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
        localStorage.setItem('darkMode', isDarkMode);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={toggleDarkMode}
                className="p-2 focus:outline-none text-content"
            >
                {isDarkMode ? (
                    <SunIcon className="w-6 h-6 text-content" />
                ) : (
                    <MoonIcon className="w-6 h-6 text-content" />
                )}
            </button>
        </div>
    );
};

export { ThemeToggle };
