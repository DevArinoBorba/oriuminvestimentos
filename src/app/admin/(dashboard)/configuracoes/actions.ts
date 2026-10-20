"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/require-staff";
import type { SocialLink, AboutSectionSettings } from "@/lib/services/settingsService";

export interface SiteConfigSettings {
  name: string;
  tagline: string;
  address: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  contactEmail: string;
  contactPhone: string;
  cnpj: string;
  instagramUrl: string;
  facebookUrl: string;
  socialLinks: SocialLink[];
}

export interface AnalyticsSettingsInput {
  gtmId: string;
  ga4Id: string;
  metaPixelId: string;
}

export interface GetSettingsResult {
  siteConfig: SiteConfigSettings | null;
  analytics: AnalyticsSettingsInput | null;
  aboutSection: AboutSectionSettings | null;
  error?: string;
}

export async function getSettings(): Promise<GetSettingsResult> {
  const staff = await requireStaff();
  if (!staff) return { siteConfig: null, analytics: null, aboutSection: null, error: "Não autorizado." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["site_config", "analytics", "about_section"]);

  if (error) {
    return { siteConfig: null, analytics: null, aboutSection: null, error: error.message };
  }

  const siteConfigRow = data?.find((r) => r.key === "site_config");
  const analyticsRow = data?.find((r) => r.key === "analytics");
  const aboutSectionRow = data?.find((r) => r.key === "about_section");

  return {
    siteConfig: (siteConfigRow?.value as SiteConfigSettings | undefined) ?? null,
    analytics: (analyticsRow?.value as AnalyticsSettingsInput | undefined) ?? null,
    aboutSection: (aboutSectionRow?.value as AboutSectionSettings | undefined) ?? null,
  };
}

export interface SaveSettingsInput {
  siteConfig: SiteConfigSettings;
  analytics: AnalyticsSettingsInput;
  aboutSection?: AboutSectionSettings;
}

export interface SaveSettingsResult {
  success: boolean;
  error?: string;
}

export async function saveSettings(input: SaveSettingsInput): Promise<SaveSettingsResult> {
  const staff = await requireStaff();
  if (!staff) return { success: false, error: "Não autorizado." };

  const supabase = await createClient();

  const upserts = [
    supabase
      .from("settings")
      .upsert({ key: "site_config", value: input.siteConfig as unknown as Record<string, unknown> }),
    supabase
      .from("settings")
      .upsert({ key: "analytics", value: input.analytics as unknown as Record<string, unknown> }),
  ];

  if (input.aboutSection) {
    upserts.push(
      supabase
        .from("settings")
        .upsert({ key: "about_section", value: input.aboutSection as unknown as Record<string, unknown> })
    );
  }

  const results = await Promise.all(upserts);
  const failed = results.find((r) => r.error);

  if (failed && failed.error) {
    return {
      success: false,
      error: failed.error.message,
    };
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/", "layout");
  return { success: true };
}

