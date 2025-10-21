import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Text } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const serif = DM_Serif_Text({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UI Lab",
  description: "Library of components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="px-6">
            <main className="mx-auto flex min-h-[calc(100dvh_-_var(--footer-height))] max-w-(--content-width) flex-col">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
