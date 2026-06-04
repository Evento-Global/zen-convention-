import { BRAND_LOGOS } from '../data/brand';
import { SiteLogo } from './SiteLogo';
import './BrandLockup.css';

interface BrandLockupProps {
  readonly layout: 'hero' | 'bar';
}

export function BrandLockup({ layout }: BrandLockupProps) {
  if (layout === 'hero') {
    return (
      <div className="brand-lockup brand-lockup--hero">
        <img
          className="brand-lockup__evento"
          src={BRAND_LOGOS.evento}
          alt="Evento Global Design & Management Company"
          width={800}
          height={800}
          decoding="async"
          fetchPriority="high"
        />
        <span className="brand-lockup__rule" aria-hidden />
        <SiteLogo
          variant="zen"
          className="brand-lockup__zen"
          alt="Zen Convention"
        />
      </div>
    );
  }

  return (
    <div className="brand-lockup brand-lockup--bar">
      <img
        className="brand-lockup__evento"
        src={BRAND_LOGOS.evento}
        alt=""
        width={72}
        height={72}
        decoding="async"
      />
      <span className="brand-lockup__bar-divider" aria-hidden />
      <SiteLogo variant="horizontal" className="brand-lockup__zen" alt="" />
    </div>
  );
}
