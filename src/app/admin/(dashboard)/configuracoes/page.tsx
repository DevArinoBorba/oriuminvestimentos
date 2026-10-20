import { getSettings } from "./actions";
import { ConfiguracoesView } from "./ConfiguracoesView";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const { siteConfig, analytics, aboutSection, error } = await getSettings();

  return (
    <ConfiguracoesView
      initialSiteConfig={siteConfig}
      initialAnalytics={analytics}
      initialAboutSection={aboutSection}
      initialError={error ?? null}
    />
  );
}
