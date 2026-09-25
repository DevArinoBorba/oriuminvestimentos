import { UrbanPropertyDetailView } from "@/components/property/UrbanPropertyDetailView";
import { mockUrbanProperties } from "@/lib/mock/properties";
import { fetchUrbanPropertyBySlug } from "@/lib/services/propertyService";
import { formatArea } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prop = await fetchUrbanPropertyBySlug(slug);

  if (!prop) return { title: "Imóvel | ORIUM" };

  return {
    title: `${prop.title} - ${prop.neighborhood}, Campo Grande`,
    description: `${prop.type} com ${prop.bedrooms} dorms, ${prop.suites} suítes e ${prop.parking} vagas no bairro ${prop.neighborhood}, Campo Grande/MS. Ref: ${prop.code}.`,
    openGraph: {
      title: `${prop.title} | Órion Campo Grande`,
      description: `${prop.type} no bairro ${prop.neighborhood} - ${formatArea(prop.area)}.`,
      images: [
        {
          url: prop.coverImage.url,
          alt: prop.coverImage.alt || prop.title,
        },
      ],
    },
  };
}

export default async function UrbanPropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await fetchUrbanPropertyBySlug(slug);

  return (
    <UrbanPropertyDetailView
      initialSlug={slug}
      initialProperty={property}
    />
  );
}
