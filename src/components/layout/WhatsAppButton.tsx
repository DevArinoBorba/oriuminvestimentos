import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsappUrlFor } from "@/lib/site-config";
import type { ResolvedSiteConfig } from "@/lib/services/settingsService";

interface WhatsAppButtonProps {
  config: ResolvedSiteConfig;
}

export function WhatsAppButton({ config }: WhatsAppButtonProps) {
  const url = buildWhatsappUrlFor(
    config.whatsappNumber,
    "Olá, gostaria de falar com um especialista da ORIUM Investimentos sobre oportunidades imobiliárias.",
  );

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      data-analytics-event="whatsapp_click"
      className="focus-ring fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-6px_rgba(37,211,102,0.45)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
