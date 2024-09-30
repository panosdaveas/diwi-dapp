import AppProvider from "./Context/context";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./Providers/providers";
import { WalletProvider } from "./Context/WalletContext";

export const metadata = {
  title: "DiWi",
  description: "A Web3 Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Providers>{children}</Providers>
        </AppProvider>
      </body>
    </html>
  );
}
