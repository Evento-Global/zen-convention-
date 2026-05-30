/**
 * Product / variant gallery page — manufacturer PDP layout
 * (reference: /products/cold-plastic-paint-manufacturers).
 *
 * Structure:
 *  1. Sticky brand bar + breadcrumb
 *  2. Editorial header (kicker · title · accent rule · lede)
 *  3. Product gallery grid with click-to-zoom lightbox
 */
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Lightbox } from '../components/Lightbox';
import { resolveImageSrc, resolveProductGallery } from '../data/sections';
import './ProductGalleryPage.css';

interface RemoteFigureProps {
  readonly seed: string;
  readonly width: number;
  readonly height: number;
  readonly className?: string;
  readonly loading?: 'lazy' | 'eager';
  readonly fallbackClassName?: string;
}

function RemoteFigure({
  seed,
  width,
  height,
  className,
  loading = 'lazy',
  fallbackClassName,
}: RemoteFigureProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveImageSrc(seed, width, height);

  const handleError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      <div
        className={fallbackClassName ?? 'pdp-gcell-fallback'}
        role="img"
        aria-label="Placeholder imagery"
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}

export function ProductGalleryPage() {
  const { optionId } = useParams<{ optionId: string }>();
  const resolved = optionId ? resolveProductGallery(optionId) : null;
  const seeds = resolved?.option.galleryRefs ?? [];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setLightboxOpen(false);
  }, [optionId]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + seeds.length) % seeds.length);
  }, [seeds.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % seeds.length);
  }, [seeds.length]);

  if (!resolved || seeds.length === 0) {
    return <Navigate to="/" replace />;
  }

  const { section, option } = resolved;
  const imageCountLabel = String(seeds.length).padStart(2, '0');

  return (
    <div className="pdp">
      {/* ----- top bar ----- */}
      <header className="pdp-topbar">
        <div className="pdp-topbar-back">
          <Link
            className="pdp-back"
            to="/#celebrations"
            aria-label="Back to celebrations"
          >
            <span className="pdp-back-arrow" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" focusable="false">
                <path
                  d="M19 12H5m0 0l6-6m-6 6l6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Back</span>
          </Link>
        </div>

        <div className="pdp-topbar-brand">
          <Link to="/" className="pdp-brand">
            <span className="pdp-brand-mark">
              <img src="/logo.jpeg" alt="" width={72} height={72} decoding="async" />
            </span>
            <span className="pdp-brand-divider" aria-hidden />
            <span className="pdp-brand-text">
              <span className="pdp-brand-name">EVENTO GLOBAL</span>
              <span className="pdp-brand-sub">
                Design &amp; Management
                <span className="pdp-brand-sub-dot" aria-hidden />
                <em>MMXXVI</em>
              </span>
            </span>
          </Link>
        </div>

        <div className="pdp-topbar-rail" aria-hidden="true" />
      </header>
      <div className="pdp-strip" aria-hidden />

      {/* ----- breadcrumb ----- */}
      <nav className="pdp-bc" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/#celebrations">Celebrations</Link>
          </li>
          <li>
            <Link to="/#celebrations">{section.title}</Link>
          </li>
          <li aria-current="page">{option.label}</li>
        </ol>
      </nav>

      {/* ----- editorial header ----- */}
      <section className="pdp-head">
        <p className="pdp-head-kicker">
          <span className="pdp-head-kicker-line" aria-hidden />
          Chapter · {section.title}
        </p>
        <h1 className="pdp-head-title">
          <span className="pdp-head-title-main">{option.label}</span>
        </h1>
        <span className="pdp-head-rule" aria-hidden />
        <p className="pdp-head-lede">{section.blurb}</p>
      </section>

      {/* ----- product gallery ----- */}
      <section className="pdp-gallery-section" aria-labelledby="pdp-gallery-heading">
        <header className="pdp-gallery-head">
          <div className="pdp-gallery-head-text">
            <p className="pdp-gallery-kicker">Product gallery</p>
            <h2 id="pdp-gallery-heading" className="pdp-gallery-title">
              {option.label} <span aria-hidden>·</span>{' '}
              <em>{section.title.toLowerCase()}</em>
            </h2>
            <span className="pdp-gallery-rule" aria-hidden />
          </div>
          <div className="pdp-gallery-meta">
            <span className="pdp-gallery-count">{imageCountLabel}</span>
            <span className="pdp-gallery-count-label">
              Images
              <br />
              on file
            </span>
          </div>
        </header>

        <div className="pdp-gallery-grid">
          {seeds.map((seed, i) => {
            const ref = String(i + 1).padStart(2, '0');
            return (
              <button
                key={`grid-${seed}`}
                type="button"
                className="pdp-gcell"
                onClick={() => openLightbox(i)}
                aria-label={`Open image ${ref} of ${imageCountLabel}`}
              >
                <span className="pdp-gcell-frame">
                  <RemoteFigure
                    seed={seed}
                    width={800}
                    height={800}
                    fallbackClassName="pdp-gcell-fallback"
                  />
                  <span className="pdp-gcell-overlay" aria-hidden>
                    <span className="pdp-gcell-pill">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M21 21l-4.35-4.35M11 19a8 8 0 110-16 8 8 0 010 16zm-3-8h6m-3-3v6"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      View image
                    </span>
                  </span>
                </span>
                <span className="pdp-gcell-caption">
                  <span className="pdp-gcell-ref">REF · {ref}</span>
                  <span className="pdp-gcell-name">
                    {section.title} / {option.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="pdp-footer">
        <span className="pdp-footer-mark">EVENTO GLOBAL</span>
        <span className="pdp-footer-sep" aria-hidden />
        Design &amp; Management Company
        <span className="pdp-footer-sep" aria-hidden />
        <span className="pdp-footer-year">MMXXVI</span>
      </footer>

      <Lightbox
        isOpen={lightboxOpen}
        seeds={seeds}
        activeIndex={lightboxIndex}
        title={`${section.title} — ${option.label}`}
        subtitle={`${imageCountLabel} references`}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
