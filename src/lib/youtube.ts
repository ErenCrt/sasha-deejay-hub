export const YT_CHANNEL_ID = "UC3Z1fyq2ml1ms5ZkiSL7_Wg";
export const YT_HANDLE_URL = "https://www.youtube.com/@sasha-deejay";

export type YTVideo = {
  id: string;
  title: string;
  url: string;
  published: string;
  thumbnail: string;
};

/**
 * Fetch latest uploads from YouTube channel RSS feed.
 * Uses r.jina.ai as a CORS-friendly read proxy (no key required).
 * Falls back gracefully if the feed cannot be reached.
 */
export async function fetchLatestVideos(limit = 6): Promise<YTVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;
  // Try multiple proxies for resilience
  const sources = [
    `https://r.jina.ai/http://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
  ];

  for (const src of sources) {
    try {
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) continue;
      const text = await res.text();
      const videos = parseFeed(text).slice(0, limit);
      if (videos.length) return videos;
    } catch {
      // try next
    }
  }
  return [];
}

function parseFeed(text: string): YTVideo[] {
  const items: YTVideo[] = [];
  // Try XML parser first
  try {
    const doc = new DOMParser().parseFromString(text, "text/xml");
    const entries = Array.from(doc.getElementsByTagName("entry"));
    for (const entry of entries) {
      const id = entry.getElementsByTagName("yt:videoId")[0]?.textContent
        || entry.getElementsByTagName("videoId")[0]?.textContent
        || "";
      const title = entry.getElementsByTagName("title")[0]?.textContent || "Untitled";
      const published = entry.getElementsByTagName("published")[0]?.textContent || "";
      if (id) {
        items.push({
          id,
          title,
          url: `https://www.youtube.com/watch?v=${id}`,
          published,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        });
      }
    }
    if (items.length) return items;
  } catch {
    /* fallthrough */
  }
  // Regex fallback (jina returns markdown-ish text sometimes)
  const idMatches = Array.from(text.matchAll(/(?:videoId[^A-Za-z0-9_-]+|watch\?v=)([A-Za-z0-9_-]{11})/g));
  const seen = new Set<string>();
  for (const m of idMatches) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    items.push({
      id,
      title: "Latest upload",
      url: `https://www.youtube.com/watch?v=${id}`,
      published: "",
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  return items;
}
