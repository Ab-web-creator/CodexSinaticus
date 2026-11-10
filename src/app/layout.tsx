import type { Metadata } from "next";
import { Amiri, Gentium_Book_Plus, Inter } from "next/font/google";
import "./globals.css";

const ui = Inter({ variable: "--font-ui", subsets: ["latin"] });
const greek = Gentium_Book_Plus({
  variable: "--font-greek",
  subsets: ["greek", "greek-ext", "latin"],
  weight: ["400", "700"],
});
const arabic = Amiri({ variable: "--font-arabic", subsets: ["arabic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Codex Sinaiticus · Arabic",
  description: "The Greek text of Codex Sinaiticus side by side with an Arabic translation.",
};

// Applies the saved Greek script preference before first paint to avoid a flash.
const initScript = `try{if(localStorage.getItem("uncial")==="true")document.documentElement.dataset.uncial="true"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${ui.variable} ${greek.variable} ${arabic.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
