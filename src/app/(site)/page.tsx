import { Hero } from "@/components/home/Hero";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { FeaturedDevelopments } from "@/components/home/FeaturedDevelopments";
import { CampoGrandeSection } from "@/components/home/CampoGrandeSection";
import { RuralSection } from "@/components/home/RuralSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { AboutSection } from "@/components/home/AboutSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { CTASection } from "@/components/home/CTASection";
import { fetchActiveBanners } from "@/lib/services/bannerService";
import { fetchAboutSettings } from "@/lib/services/settingsService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [banners, aboutSection] = await Promise.all([
    fetchActiveBanners(),
    fetchAboutSettings(),
  ]);

  return (
    <>
      <Hero banner={banners.hero} />
      <DestinationGrid />
      <FeaturedDevelopments banner={banners["destaque-sc"]} />
      <CampoGrandeSection banner={banners["campo-grande"]} />
      <RuralSection banner={banners.rural} />
      <CoverageSection />
      <AboutSection data={aboutSection} />
      <EditorialSection />
      <CTASection />
    </>
  );
}
