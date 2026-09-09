const DISPLAY: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

export function toIsoDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  if (!trimmed.includes("T") && !/Z|[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const utc = Date.parse(`${trimmed} UTC`);
    if (!Number.isNaN(utc)) return new Date(utc).toISOString().slice(0, 10);
  }
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
}

export function formatDisplayDate(isoDate: string): string {
  const iso = toIsoDate(isoDate);
  if (!iso) return isoDate;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", DISPLAY);
}

export function postSortKey(post: {
  date: string;
  time?: string;
  publishedAt?: string;
}): number {
  if (post.publishedAt) {
    const at = Date.parse(post.publishedAt);
    if (!Number.isNaN(at)) return at;
  }
  const clock = post.time && /^\d{2}:\d{2}$/.test(post.time) ? post.time : "00:00";
  const at = Date.parse(`${post.date}T${clock}:00Z`);
  return Number.isNaN(at) ? 0 : at;
}

export function isReleasedPost(
  post: { date: string; time?: string; publishedAt?: string },
  now = Date.now(),
): boolean {
  return postSortKey(post) <= now;
}
