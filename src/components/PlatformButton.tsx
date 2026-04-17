import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  href: string;
  label: string;
  sub: string;
  icon: ReactNode;
  accent?: "primary" | "spotify" | "apple" | "youtube";
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  primary: "hover:border-primary hover:shadow-glow",
  spotify: "hover:border-[hsl(141_76%_48%)] hover:shadow-[0_0_30px_hsl(141_76%_48%/0.35)]",
  apple: "hover:border-[hsl(340_82%_60%)] hover:shadow-[0_0_30px_hsl(340_82%_60%/0.3)]",
  youtube: "hover:border-[hsl(0_85%_55%)] hover:shadow-[0_0_30px_hsl(0_85%_55%/0.35)]",
};

export const PlatformButton = ({ href, label, sub, icon, accent = "primary" }: Props) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        "group relative isolate flex items-center gap-4 overflow-hidden",
        "border border-border bg-card/70 backdrop-blur-sm",
        "px-5 py-4 transition-all duration-300",
        "hover:-translate-y-0.5 hover:bg-card",
        accentMap[accent],
      ].join(" ")}
    >
      {/* Shine sweep */}
      <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
      </span>

      <span className="relative grid place-items-center w-11 h-11 rounded-sm bg-background/60 border border-border transition-transform duration-300 group-hover:scale-110">
        {icon}
        <span className="absolute inset-0 rounded-sm border border-current opacity-0 group-hover:opacity-40 group-hover:animate-pulse-ring" />
      </span>

      <span className="flex-1 min-w-0">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {sub}
        </span>
        <span className="block font-display text-2xl leading-none tracking-wide">{label}</span>
      </span>

      <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:rotate-12" />
    </a>
  );
};
