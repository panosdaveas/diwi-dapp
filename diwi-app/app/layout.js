// import { ThemeProvider } from "@material-tailwind/react";
// const {SidebarWithContentSeparator} = require("../Components/sidebar");
// import { SidebarWithContentSeparator } from "@/Components/sidebar"
// import { Button } from "@material-tailwind/react";

// import { SidebarWithContentSeparator } from "@/Components/sidebar"

export const metadata = {
  title: 'DiWi',
  description: 'A Web3 Project',
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
        {children}
    </body>
      </html>
  )
}
