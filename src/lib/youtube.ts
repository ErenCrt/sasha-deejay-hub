export const YT_HANDLE = "sasha-deejay";
export const YT_CHANNEL_ID = "UC3Z1fyq2ml1ms5ZkiSL7_Wg";
export const YT_HANDLE_URL = `https://www.youtube.com/@${YT_HANDLE}`;

export type YTVideo = {
  id: string;
  title: string;
  url: string;
  published: string;
  thumbnail: string;
};

const CHANNEL_PAGE = `https://www.youtube.com/@${YT_HANDLE}/videos?hl=en`;

// Cache so refresh feels instant and we don't re-hit proxies
const CACHE_KEY = "yt_uploads_v4";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

const FALLBACK_VIDEOS: YTVideo[] = [
  { id: "f90z-IHNE8k", title: "SASHA DEEJAY Under The Sky", published: "2 days ago", url: "https://www.youtube.com/watch?v=f90z-IHNE8k", thumbnail: "https://i.ytimg.com/vi/f90z-IHNE8k/hqdefault.jpg" },
  { id: "a86GO9oir6M", title: "Sasha Deejay Himalaya", published: "2 weeks ago", url: "https://www.youtube.com/watch?v=a86GO9oir6M", thumbnail: "https://i.ytimg.com/vi/a86GO9oir6M/hqdefault.jpg" },
  { id: "_gyRM5OI6RY", title: "Sasha Deejay (A2PEU Project) Reșița - Constanța", published: "2 months ago", url: "https://www.youtube.com/watch?v=_gyRM5OI6RY", thumbnail: "https://i.ytimg.com/vi/_gyRM5OI6RY/hqdefault.jpg" },
  { id: "23JKok0SUPQ", title: "Sasha Deejay (A2PEU Project) Fara Griji - Fara Filtre", published: "2 months ago", url: "https://www.youtube.com/watch?v=23JKok0SUPQ", thumbnail: "https://i.ytimg.com/vi/23JKok0SUPQ/hqdefault.jpg" },
  { id: "Z77w9ARoqhQ", title: "SASHA DEEJAY Dale Lento", published: "3 months ago", url: "https://www.youtube.com/watch?v=Z77w9ARoqhQ", thumbnail: "https://i.ytimg.com/vi/Z77w9ARoqhQ/hqdefault.jpg" },
  { id: "a5_BvWalLw0", title: "Sasha Deejay One World - One Love", published: "3 months ago", url: "https://www.youtube.com/watch?v=a5_BvWalLw0", thumbnail: "https://i.ytimg.com/vi/a5_BvWalLw0/hqdefault.jpg" },
];

type Cached = { ts: number; videos: YTVideo[] };

function readCache(): YTVideo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: Cached = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.videos;
  } catch {
    return null;
  }
}

function writeCache(videos: YTVideo[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), videos }));
  } catch { /* ignore */ }
}

export function getCachedVideos(): YTVideo[] | null {
  return readCache();
}

/**
 * Fetch latest uploads by scraping the YouTube channel /videos page through
 * a CORS proxy. Channel page works reliably even when RSS feed 404s.
 * Races multiple proxies in parallel and uses the first success.
 */
export async function fetchLatestVideos(limit = 6): Promise<YTVideo[]> {
  const proxies = [
    (u: string) => `https://r.jina.ai/${u}`,
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
    (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // Race proxies — first one to return parsed videos wins.
    const result = await new Promise<YTVideo[]>((resolve, reject) => {
      let pending = proxies.length;
      proxies.forEach((build) => {
        fetch(build(CHANNEL_PAGE), { signal: controller.signal, cache: "no-store" })
          .then(async (res) => {
            if (!res.ok) throw new Error(`status ${res.status}`);
            const text = await res.text();
            const videos = parseChannelPage(text).slice(0, limit);
            if (!videos.length) throw new Error("no videos");
            resolve(videos);
          })
          .catch(() => {
            pending -= 1;
            if (pending === 0) reject(new Error("all proxies failed"));
          });
      });
    });
    clearTimeout(timeout);
    writeCache(result);
    return result;
  } catch {
    clearTimeout(timeout);
    return readCache() ?? FALLBACK_VIDEOS.slice(0, limit);
  }
}

function parseChannelPage(page: string): YTVideo[] {
  const markdownVideos = parseMarkdownChannelPage(page);
  if (markdownVideos.length) return markdownVideos;

  const videos: YTVideo[] = [];
  const seen = new Set<string>();

  const decode = (raw: string) => {
    try { return JSON.parse(`"${raw}"`); } catch { return raw; }
  };

  // Split the page into per-video blocks. YouTube now uses lockupViewModel
  // (new) — fall back to videoRenderer (legacy) if needed.
  const splitter = page.includes('"lockupViewModel":{')
    ? '"lockupViewModel":{'
    : '"videoRenderer":{';
  const blocks = page.split(splitter).slice(1);

  for (const raw of blocks) {
    const block = raw.slice(0, 6000); // bound each block

    const idMatch = block.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
    if (!idMatch) continue;
    const id = idMatch[1];
    if (seen.has(id)) continue;
    seen.add(id);

    // Title — new structure: "title":{"content":"..."}
    // Legacy: "title":{"runs":[{"text":"..."}]} or {"simpleText":"..."}
    const titleNew = block.match(/"title":\s*\{\s*"content":\s*"((?:[^"\\]|\\.)*)"/);
    const titleRun = block.match(/"title":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"((?:[^"\\]|\\.)*)"/);
    const titleSimple = block.match(/"title":\s*\{\s*"simpleText":\s*"((?:[^"\\]|\\.)*)"/);
    const rawTitle = titleNew?.[1] ?? titleRun?.[1] ?? titleSimple?.[1];
    const title = rawTitle ? decode(rawTitle) : "Latest upload";

    // Skip non-video lockups (Add to queue, Save to playlist, etc.)
    if (/^(Add to queue|Save to playlist|Share)$/i.test(title)) continue;

    // Published — new structure puts "1 month ago" inside metadataParts text.content.
    // Find a content string that looks like a relative time.
    let published = "";
    const legacyPub = block.match(/"publishedTimeText":\s*\{\s*"simpleText":\s*"([^"]+)"/);
    if (legacyPub) {
      published = legacyPub[1];
    } else {
      const contents = [...block.matchAll(/"content":\s*"([^"]+)"/g)].map((m) => m[1]);
      const timeRe = /\b(second|minute|hour|day|week|month|year)s?\s+ago\b/i;
      published = contents.find((c) => timeRe.test(c)) ?? "";
    }

    videos.push({
      id,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      published,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }

  return videos;
}
