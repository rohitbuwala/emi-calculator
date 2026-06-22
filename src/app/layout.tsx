import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EMI Calculator — Smart Loan Planning Tool",
  description:
    "Calculate your Equated Monthly Installment (EMI) instantly. Get detailed amortization schedule, visual breakdowns, and compare multiple loan scenarios side by side.",
  keywords: "EMI calculator, loan calculator, mortgage calculator, interest calculator, amortization schedule",
  openGraph: {
    title: "EMI Calculator — Smart Loan Planning Tool",
    description: "Calculate EMI, view amortization schedules, and compare loan scenarios instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
