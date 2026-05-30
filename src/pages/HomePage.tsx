import { Hero } from '../components/Hero';
import { SectionCard } from '../components/SectionCard';
import { EVENT_SECTIONS } from '../data/sections';
import '../App.css';

const SCROLL_SECTION_ID = 'celebrations';

export function HomePage() {
  return (
    <>
      <Hero scrollTargetId={SCROLL_SECTION_ID} />

      <main className="moments" id={SCROLL_SECTION_ID}>
        <div className="moments-inner">
          <header className="moments-intro">
            <p className="moments-kicker">
              <span className="moments-kicker-line" aria-hidden />
              The Lineup
              <span className="moments-kicker-line" aria-hidden />
            </p>
            <h2 className="moments-heading">
              Four chapters,
              <br />
              <em>infinitely</em> yours
            </h2>
            <p className="moments-lede">
              Hover or tap a card to reveal the looks within — each opens a
              dedicated gallery you can browse at full size.
            </p>
          </header>

          <div className="moments-rows">
            <div className="moments-row moments-row--4">
              {EVENT_SECTIONS.slice(0, 4).map((section, i) => (
                <SectionCard key={section.id} section={section} index={i} />
              ))}
            </div>
            <div className="moments-row moments-row--3">
              {EVENT_SECTIONS.slice(4).map((section, i) => (
                <SectionCard key={section.id} section={section} index={i + 4} />
              ))}
            </div>
          </div>

          <p className="moments-foot" aria-hidden>
            <span />
            <span className="moments-foot-mark">EVENTO GLOBAL</span>
            <span />
          </p>
        </div>
      </main>

      <footer className="page-footer">
        <div className="page-footer-inner">
          <span className="page-footer-mark">EVENTO GLOBAL</span>
          <span className="page-footer-sep" aria-hidden />
          Design &amp; Management Company
          <span className="page-footer-sep" aria-hidden />
          <span className="page-footer-year">MMXXVI</span>
        </div>
      </footer>
    </>
  );
}
