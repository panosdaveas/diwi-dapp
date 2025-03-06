import AppProvider from "./Context/context";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./Providers/providers";
import { CustomThemeProvider } from "./Providers/customTheme";
import "./globals.css";

export const metadata = {
  title: "DiWi",
  description: "A Web3 Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>
          <AppProvider>
            <Providers>{children}</Providers>
          </AppProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
