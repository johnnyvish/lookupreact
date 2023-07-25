import "./globals.css";

export const metadata = {
  title: "Look Up",
  description: "Yellow Dot Studios",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
