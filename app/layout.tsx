import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Aegis",
  description: "AI-powered ruthless PR and codebase review tool built with FastAPI & Next.js",
  icons: {
    icon: "/dp.png"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider defaultTheme="system" storageKey="aegis-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

