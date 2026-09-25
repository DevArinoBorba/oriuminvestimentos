import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, resolveSocialIcon } from "@/components/ui/SocialIcons";
import { buildWhatsappUrlFor } from "@/lib/site-config";
import type { ResolvedSiteConfig } from "@/lib/services/settingsService";
import { scCities } from "./nav-data";

const institutionalLinks = [
  { label: "Sobre a ORIUM", href: "/sobre" },
  { label: "Conteúdo", href: "/conteudo" },
  { label: "Venda seu imóvel", href: "/venda-seu-imovel" },
  { label: "Contato", href: "/contato" },
];

const legalLinks = [
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Preferências de cookies", href: "/cookies" },
  { label: "Termos de uso", href: "/termos" },
];

interface FooterProps {
  config: ResolvedSiteConfig;
}

export function Footer({ config }: FooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = [
    { icon: InstagramIcon, url: config.instagramUrl, label: "Instagram" },
    { icon: FacebookIcon, url: config.facebookUrl, label: "Facebook" },
    ...config.socialLinks.map((link) => ({
      icon: resolveSocialIcon(link.label),
      url: link.url,
      label: link.label,
    })),
  ].filter((s) => s.url);
  const whatsappUrl = buildWhatsappUrlFor(
    config.whatsappNumber,
    "Olá, gostaria de falar com um especialista da ORIUM sobre oportunidades imobiliárias.",
  );

  return (
    <footer className="border-t border-areia/60 bg-white text-graphite">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Image
            src="/brand/orium-logo-horizontal.svg"
            alt="ORIUM Imóveis & Investimentos"
            width={200}
            height={44}
            className="h-9 w-auto"
          />
          <p className="text-[13px] leading-relaxed text-graphite/70">{config.tagline}</p>
          {socialLinks.length > 0 ? (
            <div className="flex gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={`${s.label}-${s.url}`}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-areia text-graphite/70 transition-colors hover:border-mineral hover:text-mineral hover:bg-offwhite"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-mineral">Regiões</h3>
          <Link href="/empreendimentos" className="focus-ring text-[14px] text-graphite/75 hover:text-mineral transition-colors">
            Empreendimentos SC
          </Link>
          {scCities.slice(1).map((city) => (
            <Link
              key={city.href}
              href={city.href}
              className="focus-ring pl-3 text-[13px] text-graphite/65 hover:text-mineral transition-colors"
            >
              {city.label}
            </Link>
          ))}
          <Link href="/imoveis/campo-grande" className="focus-ring text-[14px] text-graphite/75 hover:text-mineral transition-colors">
            Campo Grande
          </Link>
          <Link href="/rural" className="focus-ring text-[14px] text-graphite/75 hover:text-mineral transition-colors">
            Rural — MS e MT
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-mineral">Institucional</h3>
          {institutionalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="focus-ring text-[14px] text-graphite/75 hover:text-mineral transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-mineral">
            Contato
          </h3>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="whatsapp_click"
              className="focus-ring flex items-center gap-2 text-[14px] text-graphite/80 hover:text-mineral transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-mineral" />
              {config.whatsappDisplay}
            </a>
          ) : null}

          {config.contactPhone ? (
            <a
              href={`tel:${config.contactPhone.replace(/\D/g, "")}`}
              className="focus-ring flex items-center gap-2 text-[14px] text-graphite/80 hover:text-mineral transition-colors"
            >
              <Phone className="h-4 w-4 text-mineral" />
              {config.contactPhone}
            </a>
          ) : null}

          {config.contactEmail ? (
            <a
              href={`mailto:${config.contactEmail}`}
              className="focus-ring flex items-center gap-2 text-[14px] text-graphite/80 hover:text-mineral transition-colors"
            >
              <Mail className="h-4 w-4 text-mineral" />
              {config.contactEmail}
            </a>
          ) : null}

          {config.address ? (
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-graphite/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
              {config.address}
            </p>
          ) : null}

          {!whatsappUrl &&
          !config.contactPhone &&
          !config.contactEmail ? (
            <p className="text-[13px] text-graphite/40">
              Canais de contato a configurar.
            </p>
          ) : null}
        </div>
      </Container>

      <div className="border-t border-areia/50 bg-offwhite/50">
        <Container className="flex flex-col gap-4 py-6 text-[12px] text-graphite/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} ORIUM Imóveis & Investimentos. Todos os direitos reservados.
            {config.cnpj ? ` · CNPJ ${config.cnpj}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex gap-5">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="focus-ring hover:text-mineral transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <a
              href="https://www.oriumdigital.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-2 text-graphite/50 transition-colors hover:text-mineral group"
              title="Desenvolvido por Orium Digital"
              aria-label="Desenvolvido por Orium Digital"
            >
              <span className="text-[11px] tracking-wide">Desenvolvido por</span>
              <Image
                src="/brand/orium-digital-logo-horizontal.svg"
                alt="Orium Digital"
                width={100}
                height={22}
                className="h-4.5 w-auto opacity-75 transition-opacity group-hover:opacity-100"
              />
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
