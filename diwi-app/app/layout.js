import AppProvider from "./Context/context";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./Providers/providers";
// import { TableProvider } from "./Providers/tableDataProvider";
import { TableDataProvider } from "./Context/TableDataContext";

export const metadata = {
  title: "DiWi",
  description: "A Web3 Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Providers>
            <TableDataProvider>
              {children}
              </TableDataProvider>
          </Providers>
        </AppProvider>
      </body>
    </html>
  );
}
