export type MarkdownPostFile = {
  title: string;
  date: string;
  time?: string;
  publishedAt?: string;
  author?: string;
  excerpt: string;
  featuredImage?: string;
  featuredImageSrcSet?: string;
  featuredImageSizes?: string;
  categories: string[];
  html: string;
  draft?: boolean;
};

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseScalarList(raw: string): string[] {
  const inner = raw.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner
    .split(",")
    .map((part) => stripQuotes(part.trim()))
    .filter(Boolean);
}

/**
 * Minimal YAML frontmatter parser for Beltira-published posts.
 * Body after the closing --- is HTML from TipTap, not Markdown.
 */
export function parseMarkdownPostFile(raw: string): MarkdownPostFile {
  const trimmed = raw.replace(/^\uFEFF/, "");
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Markdown post is missing YAML frontmatter");
  }
  const yaml = match[1];
  const html = match[2].trim();
  const fields: Record<string, string> = {};
  const listFields: Record<string, string[]> = {};

  const lines = yaml.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const nested = line.match(/^([A-Za-z0-9_]+):\s*$/);
    if (nested) {
      const key = nested[1];
      const items: string[] = [];
      i += 1;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
        items.push(stripQuotes(lines[i].replace(/^\s+-\s+/, "")));
        i += 1;
      }
      listFields[key] = items;
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const value = kv[2].trim();
      if (value.startsWith("[")) {
        listFields[key] = parseScalarList(value);
      } else {
        fields[key] = stripQuotes(value);
      }
    }
    i += 1;
  }

  const categories = listFields.categories ?? [];
  const date = fields.date?.trim() ?? "";
  if (!fields.title) {
    throw new Error("Markdown post is missing title");
  }
  if (!/^\d{4}-\d{2}-\d{2}/.test(date)) {
    throw new Error(`Markdown post has invalid date: ${date || "(empty)"}`);
  }

  return {
    title: fields.title,
    date: date.slice(0, 10),
    time: fields.time || undefined,
    publishedAt: fields.published_at || undefined,
    author: fields.author || undefined,
    excerpt: fields.excerpt ?? "",
    featuredImage: fields.featured_image || undefined,
    featuredImageSrcSet: fields.featured_image_srcset || undefined,
    featuredImageSizes: fields.featured_image_sizes || undefined,
    categories,
    html,
    draft: ["true", "yes", "1"].includes((fields.draft ?? "").trim().toLowerCase()),
  };
}

export function kebabCase(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
