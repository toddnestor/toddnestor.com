import Link from "next/link";

import { featuredImageAttrs } from "@/lib/fireimg";
import type { PostIndexEntry } from "@/lib/post-types";

export function PostCard({ post }: { post: PostIndexEntry }) {
  const image = featuredImageAttrs(
    post.featuredImage || post.thumbnail,
    post.featuredImageSrcSet,
    post.featuredImageSizes,
  );
  return (
    <article className="post-card">
      <Link href={`/${post.slug}`}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- FireImg CDN URLs
          <img alt="" className="post-card-image" sizes={image.sizes} src={image.src} srcSet={image.srcSet} />
        ) : null}
        <time dateTime={post.date}>{post.dateDisplay}</time>
        <h2>{post.title}</h2>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
      </Link>
    </article>
  );
}
