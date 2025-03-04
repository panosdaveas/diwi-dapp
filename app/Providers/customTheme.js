"use client";

import { ThemeProvider } from "@material-tailwind/react";
import { useMemo } from "react";

export function CustomThemeProvider({ children }) {
  const customTheme = useMemo(() => ({
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
            // variant: "small",
            color: "text-blue-gray-900",
            // color: localStorage.getItem('darkMode') === 'false' ? 'text-blue-gray-900' : 'text-white',
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
              bg: "hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80",
              color:
                "hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900",
              outline: "outline-none",
            },
            selected: {
              bg: "bg-blue-gray-50/50",
              color: "text-blue-gray-900",
            },
            disabled: {
              opacity: "opacity-50",
              cursor: "cursor-not-allowed",
              pointerEvents: "pointer-events-none",
              userSelect: "select-none",
              bg: "hover:bg-transparent focus:bg-transparent active:bg-transparent",
              color:
                "hover:text-blue-gray-500 focus:text-blue-gray-500 active:text-blue-gray-500",
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
  }), []);

  return <ThemeProvider value={customTheme}>{children}</ThemeProvider>;
}
