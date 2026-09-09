import { splitArticleHtml } from "@/lib/article-body";

import { ImageCarousel } from "./image-carousel";

export function ArticleBody({ html }: { html: string }) {
  return (
    <>
      {splitArticleHtml(html).map((part, index) => {
        if (part.type === "carousel") {
          return <ImageCarousel key={index} maxHeight={part.maxHeight} slides={part.slides} />;
        }
        return <div dangerouslySetInnerHTML={{ __html: part.html }} key={index} />;
      })}
    </>
  );
}
