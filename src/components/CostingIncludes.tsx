import {
  COSTING_INCLUDES_ITEMS,
  COSTING_INCLUDES_TITLE,
} from '../data/costingIncludes';
import './CostingIncludes.css';

interface CostingIncludesProps {
  readonly className?: string;
}

export function CostingIncludes({ className }: CostingIncludesProps) {
  const rootClass = className
    ? `costing-includes ${className}`
    : 'costing-includes';

  return (
    <section className={rootClass} aria-labelledby="costing-includes-heading">
      <div className="costing-includes-inner">
        <header className="costing-includes-head">
          <p className="costing-includes-kicker">
            <span className="costing-includes-kicker-line" aria-hidden />
            Package scope
            <span className="costing-includes-kicker-line" aria-hidden />
          </p>
          <h2 id="costing-includes-heading" className="costing-includes-title">
            {COSTING_INCLUDES_TITLE}
          </h2>
          <span className="costing-includes-rule" aria-hidden />
        </header>

        <ul className="costing-includes-list">
          {COSTING_INCLUDES_ITEMS.map((item) => (
            <li key={item.label} className="costing-includes-item">
              <span className="costing-includes-label">{item.label}</span>
              <span className="costing-includes-detail">{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
