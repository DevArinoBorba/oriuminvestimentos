import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";
import { fetchAnalyticsSettings } from "@/lib/services/settingsService";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://orioninvestimentos.com.br";

export const viewport: Viewport = {
  themeColor: "#09090c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ÓRION Investimentos | Litoral SC, Campo Grande & Mato Grosso",
    template: "%s | ÓRION Investimentos",
  },
  description:
    "Curadoria imobiliária de alto padrão em Santa Catarina (Balneário Camboriú, Itapema, Porto Belo), imóveis selecionados em Campo Grande/MS e investimentos rurais de escala no Centro-Oeste.",
  keywords: [
    "imóveis alto padrão",
    "investimento imobiliário",
    "Balneário Camboriú",
    "Itapema",
    "Porto Belo",
    "Campo Grande",
    "fazendas Mato Grosso",
    "ÓRION Investimentos",
  ],
  authors: [{ name: "ÓRION Investimentos" }],
  creator: "ÓRION Investimentos",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "ÓRION Investimentos",
    title: "ÓRION Investimentos | Alto Padrão & Inteligência Patrimonial",
    description:
      "Curadoria imobiliária de alto padrão no litoral de SC, Campo Grande e agronegócio no Centro-Oeste.",
    images: [
      {
        url: "/brand/orion-logo-horizontal.svg",
        width: 1200,
        height: 630,
        alt: "ÓRION Investimentos",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const analytics = await fetchAnalyticsSettings();

  return (
    <html lang="pt-BR" className={`${sora.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AnalyticsScripts settings={analytics} />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
