/**
 * Celebrations grid cards — editorial flip tile.
 *
 *  • Front: cinematic image, large serif chapter numeral, title + hairline rule
 *           + tiny "N looks → Explore" call-out.
 *  • Hover (fine pointer): card flips to a PDP-style variant selector.
 *  • Touch / keyboard: tap or Enter/Space toggles flip.
 *  • Selecting a variant routes to `/products/:optionId` (gallery page).
 */
import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Link } from 'react-router-dom';
import type { EventSection, EventStyleOption } from '../data/sections';
import { resolveImageSrc } from '../data/sections';
import './SectionCard.css';

interface SectionCardProps {
  section: EventSection;
  index: number;
}

interface BackOptionRowProps {
  option: EventStyleOption;
  index: number;
  visible: boolean;
}

function BackOptionRow({ option, index, visible }: BackOptionRowProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <li className="card-back-item">
      <Link
        to={`/products/${option.id}`}
        className="card-back-row"
        tabIndex={visible ? undefined : -1}
        onClick={handleClick}
      >
        <span className="card-back-row-index" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="card-back-row-main">
          <span className="card-back-row-label">{option.label}</span>
          <span className="card-back-row-meta">View gallery</span>
        </span>
        <span className="card-back-row-arrow" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" focusable="false">
            <path
              d="M5 12h14m0 0l-6-6m6 6l-6 6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </li>
  );
}

export function SectionCard({ section, index }: SectionCardProps) {
  const [hovering, setHovering] = useState(false);
  const [flippedManual, setFlippedManual] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const [finePointer, setFinePointer] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
      : true,
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setFinePointer(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const flipped = hovering || flippedManual;

  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => setHovering(false), []);
  const handleImageError = useCallback(() => setImageFailed(true), []);

  const handleArticleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (finePointer) return;
      const target = event.target as HTMLElement;
      if (target.closest('a[href]')) return;
      setFlippedManual((prev) => !prev);
    },
    [finePointer],
  );

  const handleArticleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const target = event.target as HTMLElement;
      if (target.closest('a[href]')) return;
      event.preventDefault();
      setFlippedManual((prev) => !prev);
    },
    [],
  );

  const imageSrc = resolveImageSrc(section.coverImageSrc ?? section.imageSeed, 960, 1200);
  const indexLabel = String(index + 1).padStart(2, '0');
  const lookCountLabel = String(section.styleOptions.length).padStart(2, '0');

  return (
    <article
      className={flipped ? 'card card--flipped' : 'card'}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleArticleClick}
      onKeyDown={handleArticleKeyDown}
      aria-label={`${section.title}: ${section.styleOptions.length} celebration styles`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="card-flip">
        {/* ---- FRONT FACE ---- */}
        <div className="card-face card-face--front">
          <div className="card-media">
            {imageFailed ? (
              <div className="card-media-fallback" role="img" aria-hidden />
            ) : (
              <img
                src={imageSrc}
                alt=""
                loading="lazy"
                decoding="async"
                width={960}
                height={1200}
                onError={handleImageError}
              />
            )}

            <div className="card-media-vignette" aria-hidden />

            {/* serif chapter mark — drop-cap style */}
            <span className="card-numeral" aria-hidden>
              {indexLabel}
            </span>

            {/* tag chip — top right */}
            <span className="card-tag" aria-hidden>
              Your imagery soon
            </span>

            {/* bottom block */}
            <div className="card-media-bottom">
              <h2 className="card-title">{section.title}</h2>
              <span className="card-rule" aria-hidden />
              <p className="card-blurb">{section.blurb}</p>

              <span className="card-cta" aria-hidden>
                <span className="card-cta-count">{lookCountLabel} looks</span>
                <span className="card-cta-sep" />
                <span className="card-cta-action">
                  {finePointer ? 'Hover to explore' : 'Tap to explore'}
                  <span className="card-cta-arrow">→</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ---- BACK FACE ---- */}
        <div className="card-face card-face--back" aria-hidden={!flipped}>
          <div className="card-back-shell">
            <div className="card-back-head">
              <p className="card-back-kicker">
                <span className="card-back-kicker-line" aria-hidden />
                Chapter {indexLabel}
                <span className="card-back-kicker-line" aria-hidden />
              </p>
              <h3 className="card-back-title">{section.title}</h3>
              <p className="card-back-sub">
                Choose a direction below — each opens a dedicated gallery.
              </p>
            </div>

            <ul className="card-back-list">
              {section.styleOptions.map((option, i) => (
                <BackOptionRow
                  key={option.id}
                  option={option}
                  index={i}
                  visible={flipped}
                />
              ))}
            </ul>

            <p className="card-back-foot" aria-hidden>
              <span className="card-back-foot-line" />
              EVENTO GLOBAL
              <span className="card-back-foot-line" />
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
