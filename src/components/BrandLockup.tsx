import { BRAND_LOGOS } from '../data/brand';
import { SiteLogo } from './SiteLogo';
import './BrandLockup.css';

interface BrandLockupProps {
  readonly layout: 'hero' | 'bar';
}

export function BrandLockup({ layout }: BrandLockupProps) {
  const isHero = layout === 'hero';

  return (
    <div className={`brand-lockup brand-lockup--${layout}`}>
      <div className="brand-lockup__box brand-lockup__box--evento">
        <img
          className="brand-lockup__img"
          src={BRAND_LOGOS.evento}
          alt={
            isHero
              ? 'Evento Global Design & Management Company'
              : 'Evento Global'
          }
          width={isHero ? 400 : 72}
          height={isHero ? 400 : 72}
          decoding="async"
          fetchPriority={isHero ? 'high' : undefined}
        />
      </div>
      <div className="brand-lockup__box brand-lockup__box--zen">
        <SiteLogo
          variant={isHero ? 'zen' : 'horizontal'}
          className="brand-lockup__img"
          alt={isHero ? 'Zen Convention' : ''}
        />
      </div>
    </div>
  );
}
