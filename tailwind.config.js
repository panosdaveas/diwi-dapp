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
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      colors: {
        accent1: "var(--color-accent1)",
        // bkg: "hsl(var(--color-bkg) / <alpha-value»)",
        bkg: "var(--color-bkg)",
        content: "var(--color-content)",
        borderColor: "var(--color-borderColor)",
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
        },
        textareaColor: "var(--color-textareaColor)",
      },
    },
  },
  plugins: [],
});
