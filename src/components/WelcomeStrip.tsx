const LINES = [
  'Welcome to my Portfolio',
  'AI Automation Engineer',
  'Intelligent workflows, built to last',
  'Practical AI inside real operations',
  'Let\u2019s automate the repetitive',
  'Available for new projects',
];

/**
 * Slim announcement marquee sitting above the navbar — a continuously
 * running strip of short welcome lines. Purely decorative, so it is
 * hidden from assistive technology.
 */
export default function WelcomeStrip() {
  return (
    <div className="welcome-strip" aria-hidden="true">
      <div className="welcome-strip__track">
        {[...LINES, ...LINES].map((line, i) => (
          <span
            className={i % LINES.length === 0 ? 'welcome-strip__item welcome-strip__item--lead' : 'welcome-strip__item'}
            key={i}
          >
            {line}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
