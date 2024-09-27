import AppProvider from "./Context/context"

export const metadata = {
  title: 'DiWi',
  description: 'A Web3 Project',
}

export default function RootLayout({ children, }) {
  return (
    <html lang="en">
      <body>
      <AppProvider>
        {children}
      </AppProvider>
      </body>
    </html>
  )
}
