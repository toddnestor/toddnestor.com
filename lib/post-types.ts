export type PostSource = "markdown";

export type PostCategory = {
  name: string;
  href: string;
};

export type PostIndexEntry = {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  time?: string;
  publishedAt?: string;
  author?: string;
  excerpt: string;
  thumbnail?: string;
  featuredImage?: string;
  featuredImageSrcSet?: string;
  featuredImageSizes?: string;
  categories: PostCategory[];
  source: PostSource;
  html?: string;
  draft?: boolean;
};

export type CategoryIndexEntry = {
  name: string;
  path: string;
  slug: string[];
};

export type PostsIndex = {
  posts: PostIndexEntry[];
  categories: CategoryIndexEntry[];
};
