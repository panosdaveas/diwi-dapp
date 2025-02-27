import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const MarkdownComponent = () => {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch("/Documentation.md") // Ensure the markdown file is in the `public` folder
            .then((res) => res.text())
            .then((text) => setMarkdown(text));
    }, []);

    return (
        <div className="prose max-w-none p-4 pt-7">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
};

export { MarkdownComponent };
