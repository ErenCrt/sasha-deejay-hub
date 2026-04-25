export const About = () => {
  const timeline = [
    { year: "1980", title: "Born in Moldova", text: "Born September 17 — adopted by Romanian parents and raised in Reșița." },
    { year: "early 90s", title: "First love: break dance", text: "Discovered breaking on the streets of Reșița. The rhythm hit different — and it stuck." },
    { year: "mid 90s", title: "Constanta, road to success", text: "At 17, packed up for the coast. New city, bigger scene, new ambitions." },
    { year: "1997", title: "West2Peu — the crew", text: "Back in Constanța, he founded West2Peu, the breaking crew that defined the era. Stage name: A2PEU  . Battles, jams, street cyphers — they ran the city." },
    { year: "late 90s", title: "Crew legacy", text: "West2Peu became one of the most respected b-boys of the 90's - 2000's generation — putting Constanța on the map for break dancing culture in Romania." },
    { year: "2000s", title: "Label work", text: "Pivoted into the studio. Started working with labels across Constanța and nationally — sessions, shows, grind." },
    { year: "now", title: "Behind the decks", text: "Transitioned into DJ-ing, and travelled around the world — and never looked back. 45 and still spinning." },
  ];

  return (
    <section id="about" className="container py-20 md:py-28">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <span className="tape text-primary border-primary/40">// 01 — Profile</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl leading-none">
            About <span className="display-stroke">Sasha</span>
          </h2>

          <p className="mt-6 text-2xl font-light leading-snug text-foreground">
            From Moldova to Reșița to USA to Constanta. From break dance to the booth.
            <span className="text-primary"> Four decades of rhythm.</span>
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { k: "Born", v: "1980" },
              { k: "Age", v: "45" },
              { k: "Crew", v: "West2Peu" },
            ].map((s) => (
              <div key={s.k} className="border-t border-border pt-3">
                <div className="font-display text-3xl text-foreground">{s.v}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest mt-1 text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <ol className="relative border-l border-border pl-6 space-y-8">
            {timeline.map((t, i) => (
              <li key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="absolute -left-[31px] top-1.5 grid place-items-center w-4 h-4 rounded-full bg-primary shadow-glow">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{t.year}</span>
                  <h3 className="font-display text-2xl tracking-wide text-foreground">{t.title}</h3>
                </div>
                <p className="mt-2 text-muted-foreground leading-relaxed">{t.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 border border-border bg-card/60 p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">// Quote</p>
            <p className="mt-2 text-lg leading-relaxed text-foreground">
              "Started on the floor breaking. Ended up behind the decks. Same heartbeat, different stage."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
