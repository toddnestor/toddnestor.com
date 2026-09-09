/**
 * Builds lib/generated/posts-index.json from Beltira Markdown posts in content/posts/.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { kebabCase, parseMarkdownPostFile } from "../lib/parse-frontmatter";
import { formatDisplayDate, isReleasedPost, postSortKey } from "../lib/post-dates";
import type {
  CategoryIndexEntry,
  PostCategory,
  PostIndexEntry,
  PostsIndex,
} from "../lib/post-types";

const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");
const OUT_DIR = path.join(ROOT, "lib", "generated");
const OUT_FILE = path.join(OUT_DIR, "posts-index.json");

function showUnreleasedPosts(): boolean {
  return process.env.SHOW_UNRELEASED === "true";
}

function categorySlugFromHref(href: string): string[] {
  return href.replace(/^\//, "").split("/").filter(Boolean);
}

export function categoriesFromNames(names: string[]): PostCategory[] {
  const out: PostCategory[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const href = `/category/${kebabCase(trimmed)}`;
    if (seen.has(href)) continue;
    seen.add(href);
    out.push({ name: trimmed, href });
  }
  if (out.length === 0) {
    out.push({ name: "Uncategorized", href: "/category/uncategorized" });
  }
  return out;
}

async function loadMarkdownPosts(): Promise<PostIndexEntry[]> {
  let names: string[];
  try {
    names = await readdir(POSTS_DIR);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw err;
  }

  const posts: PostIndexEntry[] = [];
  for (const name of names) {
    if (!name.endsWith(".md")) continue;
    const slug = name.replace(/\.md$/, "");
    const raw = await readFile(path.join(POSTS_DIR, name), "utf8");
    const parsed = parseMarkdownPostFile(raw);
    posts.push({
      slug,
      title: parsed.title,
      date: parsed.date,
      dateDisplay: formatDisplayDate(parsed.date),
      time: parsed.time,
      publishedAt: parsed.publishedAt,
      author: parsed.author,
      excerpt: parsed.excerpt,
      thumbnail: parsed.featuredImage,
      featuredImage: parsed.featuredImage,
      featuredImageSrcSet: parsed.featuredImageSrcSet,
      featuredImageSizes: parsed.featuredImageSizes,
      categories: categoriesFromNames(parsed.categories),
      source: "markdown",
      html: parsed.html,
      draft: parsed.draft || undefined,
    });
  }
  return posts;
}

function collectCategories(posts: PostIndexEntry[]): CategoryIndexEntry[] {
  const byPath = new Map<string, CategoryIndexEntry>();
  for (const post of posts) {
    for (const cat of post.categories) {
      if (byPath.has(cat.href)) continue;
      byPath.set(cat.href, {
        name: cat.name,
        path: cat.href,
        slug: categorySlugFromHref(cat.href),
      });
    }
  }
  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

async function main(): Promise<void> {
  const markdownPosts = (await loadMarkdownPosts()).filter(
    (post) => showUnreleasedPosts() || post.draft || isReleasedPost(post),
  );
  const posts = markdownPosts.sort((a, b) => {
    const byTime = postSortKey(b) - postSortKey(a);
    if (byTime !== 0) return byTime;
    return a.slug.localeCompare(b.slug);
  });
  const payload: PostsIndex = {
    posts,
    categories: collectCategories(posts),
  };
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");
  console.log(
    `posts-index: ${posts.length} markdown, ${payload.categories.length} categories -> ${path.relative(ROOT, OUT_FILE)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
