// const withMT = require("@material-tailwind/react/utils/withMT");
import withMT from '@material-tailwind/react/utils/withMT';

// /** @type {import('tailwindcss').Config} */
module.exports = withMT({
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
    },
  },
  plugins: [],
});
