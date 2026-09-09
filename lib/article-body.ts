export type CarouselSlide = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption: string;
};

export type ArticlePart =
  | { type: "html"; html: string }
  | { type: "carousel"; slides: CarouselSlide[]; maxHeight?: number };

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const pattern = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw))) {
    attrs[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attrs;
}

function parsePositiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function parseSlides(inner: string): CarouselSlide[] {
  const slides: CarouselSlide[] = [];
  const figurePattern = /<figure\b[^>]*>([\s\S]*?)<\/figure>/gi;
  let figure: RegExpExecArray | null;
  while ((figure = figurePattern.exec(inner))) {
    const img = figure[1].match(/<img\b([^>]*)\/?>/i);
    if (!img) continue;
    const attrs = parseAttrs(img[1]);
    const caption = decodeEntities(
      figure[1].match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1] ?? "",
    ).trim();
    if (!attrs.src) continue;
    slides.push({
      src: attrs.src,
      srcSet: attrs.srcset || undefined,
      sizes: attrs.sizes || undefined,
      alt: attrs.alt || caption,
      caption,
    });
  }
  return slides;
}

const CAROUSEL_RE = /<div\b[^>]*\bdata-tz-carousel\b[^>]*>([\s\S]*?)<\/div>/gi;

export function splitArticleHtml(html: string): ArticlePart[] {
  const parts: ArticlePart[] = [];
  let cursor = 0;
  for (const match of html.matchAll(CAROUSEL_RE)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      parts.push({ type: "html", html: html.slice(cursor, start) });
    }
    const slides = parseSlides(match[1]);
    if (slides.length > 0) {
      const wrapperAttrs = parseAttrs(match[0].match(/^<div\b([^>]*)>/i)?.[1] ?? "");
      const maxHeight = parsePositiveInt(wrapperAttrs["data-max-height"]);
      parts.push(maxHeight ? { type: "carousel", slides, maxHeight } : { type: "carousel", slides });
    } else {
      parts.push({ type: "html", html: match[0] });
    }
    cursor = start + match[0].length;
  }
  if (cursor < html.length || parts.length === 0) {
    const tail = html.slice(cursor);
    if (tail || parts.length === 0) parts.push({ type: "html", html: tail });
  }
  return parts;
}
