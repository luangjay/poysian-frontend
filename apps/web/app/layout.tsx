import { Geist_Mono, Google_Sans } from "next/font/google";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";

const googleSans = Google_Sans({
  subsets: ["latin", "thai"],
  variable: "--font-sans",
  weight: "variable",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
        googleSans.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
