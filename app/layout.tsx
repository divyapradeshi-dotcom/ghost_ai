import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Collaborative system design workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              borderRadius: "var(--radius)",
              colorBackground: "var(--bg-elevated)",
              colorBorder: "var(--border-default)",
              colorDanger: "var(--state-error)",
              colorForeground: "var(--text-primary)",
              colorInput: "var(--bg-elevated)",
              colorInputForeground: "var(--text-primary)",
              colorMuted: "var(--bg-subtle)",
              colorMutedForeground: "var(--text-secondary)",
              colorPrimary: "var(--accent-primary)",
              colorPrimaryForeground: "var(--bg-base)",
              colorRing: "var(--accent-primary)",
              colorSuccess: "var(--state-success)",
              colorWarning: "var(--state-warning)",
              fontFamily: "var(--font-geist-sans)",
              fontFamilyButtons: "var(--font-geist-sans)",
              fontFamilyMono: "var(--font-geist-mono)",
            },
            elements: {
              cardBox: {
                boxShadow: "0 24px 80px var(--accent-primary-dim)",
              },
              card: {
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-default)",
                borderStyle: "solid",
                borderWidth: "1px",
                fontFamily: "var(--font-geist-sans)",
              },
              formFieldInput: {
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-geist-sans)",
              },
              headerTitle: {
                color: "var(--text-primary)",
                fontFamily: "var(--font-geist-sans)",
              },
              headerSubtitle: {
                color: "var(--text-secondary)",
                fontFamily: "var(--font-geist-sans)",
              },
              socialButtonsBlockButton: {
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-geist-sans)",
              },
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
