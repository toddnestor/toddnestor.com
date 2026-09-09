import { PostArchive } from "@/components/post-archive";
import { SiteShell } from "@/components/site-shell";
import { listPosts } from "@/lib/posts";

export default function HomePage() {
  return (
    <SiteShell>
      <PostArchive posts={listPosts()} />
    </SiteShell>
  );
}
