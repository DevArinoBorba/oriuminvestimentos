import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { siteConfig } from "@/lib/site-config";
import { generateUUID } from "@/lib/utils";

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface ResolvedSiteConfig {
  name: string;
  tagline: string;
  secondaryTagline: string;
  manifesto: string;
  address: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  contactEmail: string;
  contactPhone: string;
  phoneScDisplay: string;
  phoneMsDisplay: string;
  cnpj: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  socialLinks: SocialLink[];
}

const DEFAULT_SITE_CONFIG: ResolvedSiteConfig = { ...siteConfig, socialLinks: [] };

/**
 * Campos editáveis em /admin/configuracoes. Os demais campos de
 * ResolvedSiteConfig (address, instagramHandle, etc.) não têm campo no
 * formulário e sempre vêm do padrão estático.
 */
type EditableSiteConfigFields = Pick<
  ResolvedSiteConfig,
  | "name"
  | "tagline"
  | "address"
  | "whatsappNumber"
  | "whatsappDisplay"
  | "contactEmail"
  | "contactPhone"
  | "cnpj"
  | "instagramUrl"
  | "facebookUrl"
  | "socialLinks"
>;

function sanitizeSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Partial<SocialLink> =>
        !!item &&
        typeof item === "object" &&
        typeof (item as SocialLink).label === "string" &&
        typeof (item as SocialLink).url === "string"
    )
    .map((item) => ({
      id: typeof item.id === "string" && item.id ? item.id : generateUUID(),
      label: (item.label ?? "").trim(),
      url: (item.url ?? "").trim(),
    }))
    .filter((item) => item.label && item.url);
}

export async function fetchSiteConfig(): Promise<ResolvedSiteConfig> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SITE_CONFIG;
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "site_config")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SITE_CONFIG;
    }

    const saved = data.value as Partial<EditableSiteConfigFields>;
    return {
      ...DEFAULT_SITE_CONFIG,
      name: saved.name?.trim() || DEFAULT_SITE_CONFIG.name,
      tagline: saved.tagline?.trim() || DEFAULT_SITE_CONFIG.tagline,
      address: saved.address !== undefined ? saved.address.trim() : DEFAULT_SITE_CONFIG.address,
      whatsappNumber: saved.whatsappNumber?.trim() || DEFAULT_SITE_CONFIG.whatsappNumber,
      whatsappDisplay: saved.whatsappDisplay?.trim() || DEFAULT_SITE_CONFIG.whatsappDisplay,
      contactEmail: saved.contactEmail?.trim() || DEFAULT_SITE_CONFIG.contactEmail,
      contactPhone: saved.contactPhone?.trim() || DEFAULT_SITE_CONFIG.contactPhone,
      cnpj: saved.cnpj?.trim() || DEFAULT_SITE_CONFIG.cnpj,
      instagramUrl: saved.instagramUrl?.trim() || DEFAULT_SITE_CONFIG.instagramUrl,
      facebookUrl: saved.facebookUrl?.trim() || DEFAULT_SITE_CONFIG.facebookUrl,
      socialLinks: sanitizeSocialLinks(saved.socialLinks),
    };
  } catch (err) {
    console.error("Erro ao buscar configurações institucionais do Supabase:", err);
    return DEFAULT_SITE_CONFIG;
  }
}

export interface AnalyticsSettings {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
}

const EMPTY_ANALYTICS: AnalyticsSettings = { gtmId: "", ga4Id: "", metaPixelId: "" };

export async function fetchAnalyticsSettings(): Promise<AnalyticsSettings> {
  if (!isSupabaseConfigured()) {
    return EMPTY_ANALYTICS;
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "analytics")
      .maybeSingle();

    if (error || !data) {
      return EMPTY_ANALYTICS;
    }

    const value = data.value as Partial<AnalyticsSettings>;
    return {
      gtmId: value.gtmId?.trim() || "",
      ga4Id: value.ga4Id?.trim() || "",
      metaPixelId: value.metaPixelId?.trim() || "",
    };
  } catch (err) {
    console.error("Erro ao buscar configurações de analytics do Supabase:", err);
    return EMPTY_ANALYTICS;
  }
}

export interface AboutSectionSettings {
  eyebrow: string;
  title: string;
  description: string;
  pillars: string[];
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
}

export const DEFAULT_ABOUT_SETTINGS: AboutSectionSettings = {
  eyebrow: "Sobre a ORIUM",
  title: "Curadoria imobiliária com visão de investimento",
  description:
    "A ORIUM Investimentos atua com inteligência de mercado e uma abordagem consultiva para conectar clientes a oportunidades imobiliárias criteriosamente selecionadas. Nossa atuação reúne imóveis, empreendimentos, investimentos, avaliação, regularização e propriedades rurais, com presença estratégica entre Santa Catarina, Mato Grosso do Sul e Mato Grosso.",
  pillars: [
    "Construímos. Avaliamos. Vendemos. Regularizamos.",
    "Apoio Jurídico Especializado.",
    "Inteligência de mercado. Patrimônio que permanece.",
  ],
  buttonText: "Conhecer a ORIUM",
  buttonLink: "/sobre",
  imageUrl: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop",
  imageAlt: "Arquitetura contemporânea representando a curadoria ORIUM Investimentos",
};

export async function fetchAboutSettings(): Promise<AboutSectionSettings> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_ABOUT_SETTINGS;
  }

  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "about_section")
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_ABOUT_SETTINGS;
    }

    const val = data.value as Partial<AboutSectionSettings>;
    return {
      eyebrow: val.eyebrow?.trim() || DEFAULT_ABOUT_SETTINGS.eyebrow,
      title: val.title?.trim() || DEFAULT_ABOUT_SETTINGS.title,
      description: val.description?.trim() || DEFAULT_ABOUT_SETTINGS.description,
      pillars: Array.isArray(val.pillars) && val.pillars.length > 0 ? val.pillars : DEFAULT_ABOUT_SETTINGS.pillars,
      buttonText: val.buttonText?.trim() || DEFAULT_ABOUT_SETTINGS.buttonText,
      buttonLink: val.buttonLink?.trim() || DEFAULT_ABOUT_SETTINGS.buttonLink,
      imageUrl: val.imageUrl?.trim() || DEFAULT_ABOUT_SETTINGS.imageUrl,
      imageAlt: val.imageAlt?.trim() || DEFAULT_ABOUT_SETTINGS.imageAlt,
    };
  } catch (err) {
    console.error("Erro ao buscar configurações da seção sobre do Supabase:", err);
    return DEFAULT_ABOUT_SETTINGS;
  }
}

