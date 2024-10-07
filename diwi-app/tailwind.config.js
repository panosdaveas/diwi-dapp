import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./workspaces/DiWi-DApp/diwi-app/node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./workspaces/DiWi-DApp/diwi-app/node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Define your custom colors here
        primary: {
          light: "white",
          dark: "#212121",
        },
        background: {
          light: "white",
          dark: "#1a1a1a",
        },
        text: {
          light: "#212121",
          dark: "#F5F5F5",
        },
        border: {
          light: "#CFD8DC",
          dark: "#616161",
        },
        card: {
          light: "#F5F5F5",
          dark: "#212121",
        },
      },
      borders: {
        card: "4",
      },
    },
  },
  plugins: [],
});
