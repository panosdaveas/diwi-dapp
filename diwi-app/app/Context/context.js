"use client";

import { createContext, useState } from "react";

export const CustomContext = createContext(null);

export default function AppProvider({ children }) {
    const [data, setData] = useState([]);

    return (
        <CustomContext.Provider value={{ data, setData }}>
            {children}
        </CustomContext.Provider>
    );
}
