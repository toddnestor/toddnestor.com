import type { PostIndexEntry } from "@/lib/post-types";

import { PostCard } from "./post-card";

export function PostArchive({ posts, heading }: { posts: PostIndexEntry[]; heading?: string }) {
  return (
    <section className="archive">
      {heading ? <h2>{heading}</h2> : null}
      {posts.length === 0 ? (
        <p className="empty">No posts yet.</p>
      ) : (
        <div className="archive-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
