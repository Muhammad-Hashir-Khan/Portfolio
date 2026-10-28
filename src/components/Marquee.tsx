import { marquee } from '../data/portfolio';

/**
 * Full-bleed keyword marquee — seamless loop (content duplicated),
 * pauses on hover, static for reduced-motion users.
 */
export default function Marquee() {
  const items = [...marquee, ...marquee];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            <i />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
