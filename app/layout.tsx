export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #000000 100%)"}}>
      <body>{children}</body>
    </html>
  )
}
