import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownPost } from "@/components/markdown-post";
import { PostArchive } from "@/components/post-archive";
import { SiteShell } from "@/components/site-shell";
import {
  getCategory,
  getMarkdownPost,
  listCategorySlugParams,
  listMarkdownSlugParams,
  postsInCategory,
} from "@/lib/posts";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const seen = new Set<string>();
  const out: { slug: string[] }[] = [];
  for (const entry of [...listMarkdownSlugParams(), ...listCategorySlugParams()]) {
    const key = entry.slug.join("/");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug[0] === "category") {
    const category = getCategory(slug);
    if (category) return { title: category.name };
  }
  const markdown = getMarkdownPost(slug.join("/"));
  return { title: markdown?.title ?? site.title };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;

  if (slug[0] === "category") {
    const category = getCategory(slug);
    if (!category) notFound();
    return (
      <SiteShell title={category.name}>
        <PostArchive heading={`Posts in ${category.name}`} posts={postsInCategory(category.path)} />
      </SiteShell>
    );
  }

  const markdown = getMarkdownPost(slug.join("/"));
  if (!markdown) notFound();
  return (
    <SiteShell title={markdown.title}>
      <MarkdownPost post={markdown} />
    </SiteShell>
  );
}
