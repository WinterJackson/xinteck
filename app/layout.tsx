import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Xinteck | Premium Software Development",
    template: "%s | Xinteck",
  },
  description: "Xinteck provides high-performing web, mobile, and custom software solutions for modern businesses. Premium design meets engineering excellence.",
  metadataBase: new URL("https://xinteck.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Xinteck | Premium Software Development",
    description: "High-performing software solutions for modern businesses.",
    url: "https://xinteck.com",
    siteName: "Xinteck",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xinteck | Premium Software Development",
    description: "High-performing software solutions for modern businesses.",
  },
  // icons: handled by app/icon.png
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${outfit.variable} font-sans antialiased text-foreground transition-colors duration-300`}
      >
        <NextTopLoader 
          color="#B8860B"
          initialPosition={0.08}
          crawlSpeed={50}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={50}
          shadow="0 0 10px #B8860B,0 0 5px #B8860B"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider gaId={gaId}>
             {children}
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
