import { type Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/**
 * Defaults for the routes that do not name themselves — `/`, the error screen
 * and the 404. `/design` overrides all of this per view. `metadataBase` is what
 * resolves the file-convention Open Graph image to an absolute URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Poysian — คลังทีมแก้",
  description: "คลังทีมแก้ของกิลด์ PANDOARA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
