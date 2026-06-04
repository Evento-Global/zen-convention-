import { BRAND_LOGOS, type BrandLogoVariant } from '../data/brand';

interface SiteLogoProps {
  readonly variant?: BrandLogoVariant;
  readonly className?: string;
  readonly alt?: string;
}

export function SiteLogo({
  variant = 'zen',
  className,
  alt = 'Zen Convention by Evento Global',
}: SiteLogoProps) {
  return (
    <img
      className={className}
      src={BRAND_LOGOS[variant]}
      alt={alt}
      decoding="async"
    />
  );
}
