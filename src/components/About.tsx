export const About = () => {
  return (
    <section id="about" className="container py-20 md:py-28">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <span className="tape text-primary border-primary/40">// 01 — Profile</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl leading-none">
            About <span className="display-stroke">Sasha</span>
          </h2>
        </div>

        <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p className="text-foreground text-2xl font-light leading-snug">
            Sasha Deejay is a DJ and rapper repping <span className="text-primary">Reșița, Romania</span> —
            blending raw street energy with electro-house heat and unfiltered bars.
          </p>
          <p>
            From late-night Hindi electro mixes to introspective tracks like <em className="text-foreground">Fără Griji – Fără Filtre</em> and
            the ongoing <em className="text-foreground">A2PEU Project</em>, his sound moves between the booth and the block.
            Equal parts producer, performer and storyteller — building a catalogue that feels lived-in, not manufactured.
          </p>
          <p>
            Currently rolling out a steady run of 2026 singles across Spotify, Apple Music and YouTube.
            The vibe? <span className="text-foreground">Modern street.</span> No filter, no cap, no compromise.
          </p>

          <div className="pt-6 grid grid-cols-3 gap-4">
            {[
              { k: "Singles", v: "10+" },
              { k: "Era", v: "2026" },
              { k: "Hometown", v: "Reșița" },
            ].map((s) => (
              <div key={s.k} className="border-t border-border pt-3">
                <div className="font-display text-3xl text-foreground">{s.v}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
