"use client";

import { ThemeProvider } from "@material-tailwind/react";
import { useEffect, useState, useMemo, createContext, useContext } from "react";

// Create context for theme state
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export function CustomThemeProvider({ children }) {
  // Using a neutral initial state to prevent immediate re-renders
  const [isDarkMode, setIsDarkMode] = useState(null);

  // Initialize theme only once on mount
  useEffect(() => {
    // Only run once on mount
    if (isDarkMode === null) {
      // Check for saved preference or system preference
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const shouldUseDarkMode =
        savedTheme === "dark" || (!savedTheme && systemPrefersDark);

      // Set initial state
      setIsDarkMode(shouldUseDarkMode);

      // Apply initial theme
      if (shouldUseDarkMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, [isDarkMode]);

  // Toggle theme function - uses functional update to avoid dependency issues
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;

      // Update DOM and localStorage
      if (newValue) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }

      return newValue;
    });
  };

  // We don't need a separate effect for theme changes now - it's handled in toggleTheme

  // Material Tailwind theme - only recompute when isDarkMode changes
  const customTheme = useMemo(() => {
    // Default to light theme if isDarkMode is still null
    const darkMode = isDarkMode === null ? false : isDarkMode;

    return {
      list: {
        defaultProps: {
          ripple: true,
          className: "",
        },
        styles: {
          base: {
            list: {
              display: "flex",
              flexDirection: "flex-col",
              gap: "gap-1",
              minWidth: "min-w-[240px]",
              p: "p-2",
              fontFamily: "font-sans",
              fontSize: "text-sm",
              fontWeight: "font-normal",
              color: darkMode ? "text-white" : "text-blue-gray-900",
              className: "leading-none",
            },
            item: {
              initial: {
                display: "flex",
                alignItems: "items-center",
                width: "w-full",
                padding: "p-3",
                borderRadius: "rounded-lg",
                textAlign: "text-start",
                lightHeight: "leading-tight",
                transition: "transition-all",
                // Adapt hover/focus states based on theme
                bg: darkMode
                  ? "hover:bg-blue-gray-800 focus:bg-blue-gray-800 active:bg-blue-gray-800"
                  : "hover:bg-blue-gray-50 focus:bg-blue-gray-50 active:bg-blue-gray-50",
                color: darkMode
                  ? "hover:text-white focus:text-white active:text-white"
                  : "hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900",
                outline: "outline-none",
              },
              selected: {
                bg: darkMode ? "bg-blue-gray-800/50" : "bg-blue-gray-50/50",
                color: darkMode ? "text-white" : "text-blue-gray-900",
              },
              disabled: {
                opacity: "opacity-50",
                cursor: "cursor-not-allowed",
                pointerEvents: "pointer-events-none",
                userSelect: "select-none",
                bg: "hover:bg-transparent focus:bg-transparent active:bg-transparent",
                color: darkMode
                  ? "hover:text-gray-400 focus:text-gray-400 active:text-gray-400"
                  : "hover:text-blue-gray-500 focus:text-blue-gray-500 active:text-blue-gray-500",
              },
            },
            itemPrefix: {
              display: "grid",
              placeItems: "place-items-center",
              marginRight: "mr-4",
            },
            itemSuffix: {
              display: "grid",
              placeItems: "place-items-center",
              marginRight: "ml-auto justify-self-end",
            },
          },
        },
      },
      // Add more component theming here
    };
  }, [isDarkMode]);

  // Don't render until isDarkMode is initialized
  if (isDarkMode === null) {
    return null; // Or a loading indicator if needed
  }

  // Provide both theme context and Material Tailwind theme
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider value={customTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
