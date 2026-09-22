import { cn } from "@/lib/utils";
import { propertyBadgeLabels } from "@/lib/labels";
import type { PropertyBadge } from "@/types";

const emphasisBadges: PropertyBadge[] = ["exclusivo", "frente-mar", "alto-padrao"];

export function Badge({ badge }: { badge: PropertyBadge }) {
  const isEmphasis = emphasisBadges.includes(badge);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] backdrop-blur-sm",
        isEmphasis ? "bg-primary text-white shadow-glow border border-primary-glow/40" : "bg-surface-elevated/90 text-foreground border border-white/10 backdrop-blur-md",
      )}
    >
      {propertyBadgeLabels[badge]}
    </span>
  );
}
