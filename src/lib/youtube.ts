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

const CHANNEL_PAGE = `https://www.youtube.com/@${YT_HANDLE}/videos`;

// Cache so refresh feels instant and we don't re-hit proxies
const CACHE_KEY = "yt_uploads_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

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
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    (u: string) => `https://r.jina.ai/${u}`,
    (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const result = await Promise.any(
      proxies.map(async (build) => {
        const res = await fetch(build(CHANNEL_PAGE), {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const text = await res.text();
        const videos = parseChannelPage(text).slice(0, limit);
        if (!videos.length) throw new Error("no videos parsed");
        return videos;
      })
    );
    clearTimeout(timeout);
    writeCache(result);
    return result;
  } catch {
    clearTimeout(timeout);
    return readCache() ?? [];
  }
}

function parseChannelPage(html: string): YTVideo[] {
  const videos: YTVideo[] = [];
  const seen = new Set<string>();

  // YouTube embeds JSON like {"videoId":"XXX","thumbnail":...,"title":{"runs":[{"text":"..."}]}}
  // Walk through every videoId occurrence and look for the nearest title afterwards.
  const idRegex = /"videoId":"([A-Za-z0-9_-]{11})"/g;
  let match: RegExpExecArray | null;

  while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    if (seen.has(id)) continue;
    seen.add(id);

    // Look in the next ~1500 chars for an associated title
    const window = html.slice(match.index, match.index + 1500);
    let title = "Latest upload";

    const titleRun = window.match(/"title":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"((?:[^"\\]|\\.)*)"/);
    const titleSimple = window.match(/"title":\s*\{\s*"simpleText":\s*"((?:[^"\\]|\\.)*)"/);
    const accessibility = window.match(/"accessibility":\s*\{[^}]*"label":\s*"((?:[^"\\]|\\.)*)"/);

    const raw = titleRun?.[1] ?? titleSimple?.[1] ?? accessibility?.[1];
    if (raw) {
      try {
        title = JSON.parse(`"${raw}"`);
      } catch {
        title = raw;
      }
    }

    // Look for a published time hint like "2 weeks ago"
    const published = window.match(/"publishedTimeText":\s*\{\s*"simpleText":\s*"([^"]+)"/)?.[1] ?? "";

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
