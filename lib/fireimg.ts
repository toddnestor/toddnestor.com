const FIREIMG_HOST = "img.fireimg.com";

export const WIDTH_STEPS = [320, 480, 640, 768, 960, 1280] as const;
export const ARTICLE_WIDTH = 764;

export function isFireImgURL(src: string): boolean {
  try {
    const host = new URL(src).hostname.toLowerCase();
    return host === FIREIMG_HOST || host.endsWith(".fireimg.com");
  } catch {
    return false;
  }
}

function variantLooksNew(segment: string): boolean {
  return (
    /^w_\d/.test(segment) ||
    segment.startsWith("q_") ||
    segment.startsWith("fmt_") ||
    segment.startsWith("h_") ||
    (segment.includes(",") && /(?:^|,)(?:w_|h_|q_|fmt_|fit_|pos_)/.test(segment))
  );
}

export function fireImgURLWithWidth(src: string, width: number): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  const parts = url.pathname.split("/").filter(Boolean);
  const imagesIdx = parts.indexOf("images");
  if (imagesIdx >= 0 && parts.length >= imagesIdx + 2) {
    const variant = decodeURIComponent(parts[imagesIdx + 1]);
    if (variantLooksNew(variant)) {
      const tokens = variant
        .split(",")
        .filter((token) => !token.startsWith("w_") && !token.startsWith("h_"));
      parts[imagesIdx + 1] = encodeURIComponent([`w_${width}`, ...tokens].join(","));
      url.pathname = `/${parts.join("/")}`;
      url.search = "";
      return url.toString();
    }
  }
  url.searchParams.delete("height");
  url.searchParams.set("width", String(width));
  if (!url.searchParams.get("quality")) url.searchParams.set("quality", "high");
  if (!url.searchParams.get("format") && !url.searchParams.get("fmt")) {
    url.searchParams.set("format", "auto");
  }
  return url.toString();
}

export function defaultSizes(maxWidth = ARTICLE_WIDTH): string {
  return `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`;
}

export function generateFireImgSrcSet(src: string): { srcSet?: string; sizes?: string } {
  if (!isFireImgURL(src)) return {};
  return {
    srcSet: WIDTH_STEPS.map((width) => `${fireImgURLWithWidth(src, width)} ${width}w`).join(", "),
    sizes: defaultSizes(),
  };
}

export function featuredImageAttrs(
  src: string | undefined,
  srcset?: string,
  sizes?: string,
): { src: string; srcSet?: string; sizes?: string } | null {
  if (!src) return null;
  if (srcset) {
    return { src, srcSet: srcset, sizes: sizes || defaultSizes() };
  }
  return { src, ...generateFireImgSrcSet(src) };
}
