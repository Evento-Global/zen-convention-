/**
 * Hero — manufacturer PDP-inspired front of book.
 *
 *   • Oversized brand wordmark (background)  ↔ dual logo specimen boxes.
 *   • Editorial corner mark (top-left)
 *   • Eyebrow ornament + tagline + hairline scroll cue.
 */
import { BrandLockup } from './BrandLockup';
import './Hero.css';

interface HeroProps {
  scrollTargetId: string;
}

export function Hero({ scrollTargetId }: HeroProps) {
  return (
    <header className="hero" role="banner">
      {/* corner marks */}
      <div className="hero-corner hero-corner--tl">
        <span className="hero-corner-line" aria-hidden />
        <span className="hero-corner-text">
          Vol. <span className="hero-corner-numeral">MMXXVI</span>
        </span>
      </div>
      <div className="hero-corner hero-corner--tr" aria-hidden>
        <span className="hero-corner-text">Design House</span>
        <span className="hero-corner-line" />
      </div>

      {/* background wordmark */}
      <div className="hero-bg" aria-hidden>
        <span className="hero-wordmark hero-wordmark--primary">EVENTO</span>
        <span className="hero-wordmark-rule" />
        <span className="hero-wordmark hero-wordmark--secondary">GLOBAL</span>
        <div className="hero-bg-glow hero-bg-glow--top" />
        <div className="hero-bg-glow hero-bg-glow--bottom" />
        <div className="hero-bg-noise" />
      </div>

      {/* foreground */}
      <div className="hero-content">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-mark" aria-hidden />
          A Design &amp; Management House
          <span className="hero-eyebrow-mark" aria-hidden />
        </p>

        <figure className="hero-brand">
          <BrandLockup layout="hero" />
        </figure>

        <p className="hero-tagline">
          Celebrations curated with <em>warmth</em>, structure,
          <br />
          and unmistakable polish.
        </p>

        <a className="hero-cta" href={`#${scrollTargetId}`}>
          <span className="hero-cta-label">Explore the collection</span>
          <span className="hero-cta-rule" aria-hidden />
          <span className="hero-cta-arrow" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" focusable="false">
              <path
                d="M12 5v14m0 0l-5-5m5 5l5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
}
