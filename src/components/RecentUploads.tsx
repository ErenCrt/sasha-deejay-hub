import { useEffect, useState } from "react";
import { fetchLatestVideos, YTVideo, YT_HANDLE_URL } from "@/lib/youtube";
import { Play, RefreshCw } from "lucide-react";

const formatDate = (iso: string) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return ""; }
};

export const RecentUploads = () => {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true); setError(false);
    const data = await fetchLatestVideos(6);
    if (!data.length) setError(true);
    setVideos(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <section id="uploads" className="container py-20 md:py-28">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <span className="tape text-primary border-primary/40">// Live feed</span>
          <h2 className="mt-3 font-display text-5xl md:text-7xl leading-none">
            Recent <span className="display-stroke">Uploads</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Auto-pulled straight from the YouTube channel. New drop? It shows up here.
          </p>
        </div>
        <button
          onClick={load}
          className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-widest border border-border hover:border-primary hover:text-primary transition-colors"
          aria-label="Refresh feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video bg-muted/40 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="border border-border bg-card/60 p-8 text-center">
          <p className="text-muted-foreground">Couldn't load the feed right now.</p>
          <a href={YT_HANDLE_URL} target="_blank" rel="noreferrer" className="inline-block mt-3 text-primary underline underline-offset-4">
            Open the channel on YouTube →
          </a>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v, i) => (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden border border-border bg-card animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="grid place-items-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {formatDate(v.published) || "YouTube"}
                </p>
                <h3 className="mt-1.5 font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {v.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};
