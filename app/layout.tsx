import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { StoreProvider } from "@/components/StoreProvider/StoreProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Skypro Music",
  description: "Training project homepage for Skypro Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.className}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
