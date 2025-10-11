import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aegis",
  description: "AI-powered ruthless PR and codebase review tool built with FastAPI & Next.js",
  icons: {
    icon: "/dp.png"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #000000 100%)",
        minHeight: "100%",
      }}
    >
      <body
        className="min-h-screen text-white bg-transparent"
        style={{
          fontFamily: "Inter, sans-serif",
          overflowX: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  )
}
