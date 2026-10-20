import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { mockImages } from "@/lib/mock/images";
import { DEFAULT_ABOUT_SETTINGS, type AboutSectionSettings } from "@/lib/services/settingsService";

interface AboutSectionProps {
  data?: AboutSectionSettings | null;
}

export function AboutSection({ data }: AboutSectionProps) {
  const settings = data || DEFAULT_ABOUT_SETTINGS;

  const eyebrow = settings.eyebrow || DEFAULT_ABOUT_SETTINGS.eyebrow;
  const title = settings.title || DEFAULT_ABOUT_SETTINGS.title;
  const description = settings.description || DEFAULT_ABOUT_SETTINGS.description;
  const pillars = (settings.pillars && settings.pillars.length > 0)
    ? settings.pillars.filter((p) => p.trim().length > 0)
    : DEFAULT_ABOUT_SETTINGS.pillars;
  const buttonText = settings.buttonText || DEFAULT_ABOUT_SETTINGS.buttonText;
  const buttonLink = settings.buttonLink || DEFAULT_ABOUT_SETTINGS.buttonLink;
  const imageUrl = settings.imageUrl || mockImages.houseExterior3;

  return (
    <section className="bg-areia/25 py-24">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />

          {pillars.length > 0 && (
            <ul className="flex flex-col gap-2 border-l border-terracota/40 pl-4">
              {pillars.map((pillar, idx) => (
                <li key={idx} className="text-[13px] italic leading-relaxed text-graphite/70">
                  {pillar}
                </li>
              ))}
            </ul>
          )}

          <ButtonLink href={buttonLink} variant="secondary" className="w-fit">
            {buttonText}
          </ButtonLink>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-areia/40">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
