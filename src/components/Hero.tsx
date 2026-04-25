import heroImg from "@/assets/hero.jpg";
import { PlatformButton } from "./PlatformButton";
import { Music2, Youtube, Apple } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[100svh] overflow-hidden grain">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Sasha Deejay performing"
          className="w-full h-full object-cover animate-slow-pan"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      {/* Top nav */}
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.25em]">Sasha · Deejay</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <a href="#music" className="hover:text-foreground transition-colors">Music</a>
          <a href="#uploads" className="hover:text-foreground transition-colors">Uploads</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
        </nav>
      </header>

      {/* Hero content */}
      <div className="container relative pt-10 md:pt-20 pb-24 md:pb-32 grid lg:grid-cols-12 gap-12 items-end min-h-[80svh]">
        <div className="lg:col-span-8 animate-fade-in">
          <span className="tape text-primary border-primary/40">// Constanța, RO</span>
          <h1 className="mt-5 font-display leading-[0.85] tracking-tight text-[18vw] md:text-[10vw] lg:text-[9rem]">
            SASHA <br />
            <span className="display-stroke">DEEJAY</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            DJ. Rapper. Producer. Modern street sound straight out of Romania —
            mixes, singles and live cuts dropping all year.
          </p>
        </div>

        <div className="lg:col-span-4 w-full grid gap-3 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <PlatformButton
            href="https://open.spotify.com/artist/2ZKG94In3z6Y55NjlWy6c6"
            label="Spotify"
            sub="Stream / Save"
            accent="spotify"
            icon={<Music2 className="w-5 h-5 text-[hsl(141_76%_48%)]" />}
          />
          <PlatformButton
            href="https://music.apple.com/gb/artist/sasha-deejay/1873458370"
            label="Apple Music"
            sub="Listen now"
            accent="apple"
            icon={<Apple className="w-5 h-5 text-[hsl(340_82%_70%)]" />}
          />
          <PlatformButton
            href="https://youtube.com/@sasha-deejay"
            label="YouTube"
            sub="Watch / Subscribe"
            accent="youtube"
            icon={<Youtube className="w-5 h-5 text-[hsl(0_85%_60%)]" />}
          />
        </div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 inset-x-0 border-y border-border bg-background/80 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center font-display text-2xl tracking-wider text-muted-foreground">
                  {["NEW DROPS WEEKLY", "★", "A2PEU PROJECT", "★", "RESITA → CONSTANTA", "★", "ELECTRO HOUSE × HIP HOP", "★", "OUT NOW", "★"].map((t, j) => (
                <span key={j} className="px-6">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
