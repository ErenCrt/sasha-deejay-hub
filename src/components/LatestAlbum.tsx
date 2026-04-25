const SPOTIFY_ARTIST_ID = "2ZKG94In3z6Y55NjlWy6c6";

export const LatestAlbum = () => {
  return (
    <section id="music" className="relative border-y border-border bg-card/30">
      <div className="container py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="tape text-accent border-accent/40">// Now spinning</span>
            <h2 className="mt-3 font-display text-5xl md:text-7xl leading-none">
              Latest <span className="display-stroke">Tracks</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Singles, edits, mixes — all the freshest cuts straight from Spotify.
              Tap a track to listen, or drop into the full catalogue.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center px-4 py-2.5 text-sm font-mono uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-glow transition-shadow"
              >
                Open in Spotify →
              </a>
              <a
                href="#uploads"
                className="inline-flex items-center px-4 py-2.5 text-sm font-mono uppercase tracking-widest border border-border hover:border-foreground transition-colors"
              >
                Watch on YouTube
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 max-w-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Genre</dt>
                <dd className="mt-1 font-display text-xl">House · Hip-Hop</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Based</dt>
                <dd className="mt-1 font-display text-xl">United Kingdoom</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Latest</dt>
                <dd className="mt-1 font-display text-xl">A2PEU Project</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Year</dt>
                <dd className="mt-1 font-display text-xl">{new Date().getFullYear()}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-primary opacity-30 blur-xl" aria-hidden />
              <div className="relative border border-border bg-background overflow-hidden">
                <iframe
                  title="Sasha Deejay on Spotify"
                  src={`https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}?utm_source=generator&theme=0`}
                  width="100%"
                  height="520"
                  frameBorder={0}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
