import type { Metadata } from "next";
import { Amiri, Gentium_Book_Plus, Inter } from "next/font/google";
import "./globals.css";
import { HTML_FLAGS } from "@/lib/flags";

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

// Applies saved display preferences (see useHtmlFlag) before first paint to avoid a flash.
const initScript = `try{${JSON.stringify(HTML_FLAGS)}.forEach(function(n){if(localStorage.getItem(n)==="true")document.documentElement.dataset[n]="true"})}catch(e){}`;

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
