import postsIndexJson from "./generated/posts-index.json";

import { isReleasedPost } from "./post-dates";
import type {
  CategoryIndexEntry,
  PostIndexEntry,
  PostsIndex,
} from "./post-types";

const { posts: allPosts, categories } = postsIndexJson as PostsIndex;
const posts = allPosts.filter(
  (post) => post.source !== "markdown" || isReleasedPost(post) || post.draft,
);

const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
const categoriesByPath = new Map(categories.map((cat) => [cat.path, cat]));

export function listPosts(): PostIndexEntry[] {
  return posts.filter((post) => !post.draft);
}

export function getMarkdownPost(slug: string): PostIndexEntry | null {
  return postsBySlug.get(slug) ?? null;
}

export function getCategory(slug: string[]): CategoryIndexEntry | null {
  const path = `/${slug.join("/")}`;
  return categoriesByPath.get(path) ?? null;
}

export function postsInCategory(categoryPath: string): PostIndexEntry[] {
  return listPosts().filter((post) =>
    post.categories.some((cat) => cat.href === categoryPath),
  );
}

export function listMarkdownSlugParams(): { slug: string[] }[] {
  return posts.map((post) => ({ slug: post.slug.split("/") }));
}

export function listCategorySlugParams(): { slug: string[] }[] {
  return categories.map((cat) => ({ slug: cat.slug }));
}
