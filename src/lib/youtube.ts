export const YT_CHANNEL_ID = "UC3Z1fyq2ml1ms5ZkiSL7_Wg";
export const YT_HANDLE_URL = "https://www.youtube.com/@sasha-deejay";

export type YTVideo = {
  id: string;
  title: string;
  url: string;
  published: string;
  thumbnail: string;
};

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;

/**
 * Fetch latest uploads from YouTube channel RSS feed.
 * Tries multiple CORS-friendly read proxies. No API key required.
 */
export async function fetchLatestVideos(limit = 6): Promise<YTVideo[]> {
  const sources = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`,
    `https://corsproxy.io/?${encodeURIComponent(FEED_URL)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(FEED_URL)}`,
    `https://r.jina.ai/http://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
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
    const parserError = doc.getElementsByTagName("parsererror").length > 0;
    if (!parserError) {
      const entries = Array.from(doc.getElementsByTagName("entry"));
      for (const entry of entries) {
        const id =
          entry.getElementsByTagName("yt:videoId")[0]?.textContent ||
          entry.getElementsByTagName("videoId")[0]?.textContent ||
          "";
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
    }
  } catch {
    /* fallthrough */
  }

  // Regex fallback — works on raw XML or markdown-ish text
  const entryBlocks = text.split(/<entry[\s>]/i).slice(1);
  if (entryBlocks.length) {
    for (const block of entryBlocks) {
      const idMatch = block.match(/<yt:videoId>([A-Za-z0-9_-]{11})<\/yt:videoId>/) || block.match(/([A-Za-z0-9_-]{11})/);
      const titleMatch = block.match(/<title>([^<]+)<\/title>/);
      const pubMatch = block.match(/<published>([^<]+)<\/published>/);
      if (idMatch) {
        const id = idMatch[1];
        items.push({
          id,
          title: titleMatch?.[1] ?? "Latest upload",
          url: `https://www.youtube.com/watch?v=${id}`,
          published: pubMatch?.[1] ?? "",
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        });
      }
    }
    if (items.length) return items;
  }

  // Last resort: scan for any 11-char video IDs
  const idMatches = Array.from(text.matchAll(/(?:videoId[^A-Za-z0-9_-]+|watch\?v=|\/vi\/)([A-Za-z0-9_-]{11})/g));
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
