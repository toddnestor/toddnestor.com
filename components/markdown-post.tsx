import Link from "next/link";

import { featuredImageAttrs } from "@/lib/fireimg";
import type { PostIndexEntry } from "@/lib/post-types";

import { ArticleBody } from "./article-body";

export function MarkdownPost({ post }: { post: PostIndexEntry }) {
  const image = featuredImageAttrs(
    post.featuredImage || post.thumbnail,
    post.featuredImageSrcSet,
    post.featuredImageSizes,
  );
  return (
    <article className="article">
      <div className="article-meta">
        {post.draft ? <span className="draft-badge">Draft</span> : null}
        <time dateTime={post.date}>{post.dateDisplay}</time>
        {post.author ? <span>{post.author}</span> : null}
        {post.categories.length > 0 ? (
          <span>
            {post.categories.map((cat, index) => (
              <span key={cat.href}>
                {index > 0 ? ", " : null}
                <Link href={cat.href}>{cat.name}</Link>
              </span>
            ))}
          </span>
        ) : null}
      </div>
      {image ? (
        <div className="article-hero">
          {/* eslint-disable-next-line @next/next/no-img-element -- FireImg CDN URLs */}
          <img alt={post.title} sizes={image.sizes} src={image.src} srcSet={image.srcSet} />
        </div>
      ) : null}
      <div className="article-body">
        <ArticleBody html={post.html ?? ""} />
      </div>
    </article>
  );
}
