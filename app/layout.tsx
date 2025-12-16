import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
const dnSans=DM_Sans({
    subsets:["latin"]
})


export const metadata: Metadata = {
  title: "Dunzo App",
  description: "Dunzo Super App",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dunzo",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`${ dnSans.className} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
