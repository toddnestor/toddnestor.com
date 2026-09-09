"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { CarouselSlide } from "@/lib/article-body";

import styles from "./image-carousel.module.css";

type Props = {
  slides: CarouselSlide[];
  maxHeight?: number;
};

export function ImageCarousel({ slides, maxHeight }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onScroll = () => {
      const width = viewport.clientWidth;
      if (!width) return;
      setIndex(Math.round(viewport.scrollLeft / width));
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  function goTo(next: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    viewport.scrollTo({ left: clamped * viewport.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  }

  if (slides.length === 0) return null;

  const style = maxHeight
    ? ({ "--tz-carousel-max-height": `min(70vh, ${maxHeight}px)` } as CSSProperties)
    : undefined;

  return (
    <div
      aria-label="Image carousel"
      aria-roledescription="carousel"
      className={`tz-carousel ${styles.carousel}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(index - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(index + 1);
        }
      }}
      role="region"
      style={style}
      tabIndex={0}
    >
      <div className={styles.frame}>
        <div className={styles.viewport} ref={viewportRef}>
          {slides.map((slide, slideIndex) => (
            <figure className={styles.slide} key={`${slide.src}-${slideIndex}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- FireImg CDN URLs */}
              <img alt={slide.alt} sizes={slide.sizes} src={slide.src} srcSet={slide.srcSet} />
              {slide.caption ? <figcaption className={styles.caption}>{slide.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        {slides.length > 1 ? (
          <>
            <button
              aria-label="Previous image"
              className={`${styles.nav} ${styles.prev}`}
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Next image"
              className={`${styles.nav} ${styles.next}`}
              disabled={index === slides.length - 1}
              onClick={() => goTo(index + 1)}
              type="button"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
      {slides.length > 1 ? (
        <div className={styles.dots}>
          {slides.map((slide, slideIndex) => (
            <button
              aria-label={`Show image ${slideIndex + 1}`}
              className={`${styles.dot}${slideIndex === index ? ` ${styles.dotActive}` : ""}`}
              key={`${slide.src}-dot-${slideIndex}`}
              onClick={() => goTo(slideIndex)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
