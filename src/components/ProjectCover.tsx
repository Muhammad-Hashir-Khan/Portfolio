import type { Project } from '../data/portfolio';

/**
 * Honest demonstration covers — schematic diagrams per project type.
 * These are labeled technical visuals, not fake screenshots.
 */

const label = { fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: 1.4, fill: '#9a9da5' } as const;
const labelCr = { ...label, fill: '#FF303B' } as const;
const nodeFill = 'rgba(255, 255, 255, 0.05)';

export default function ProjectCover({ kind }: { kind: Project['visual'] }) {
  return (
    <svg
      viewBox="0 0 640 340"
      className="project-cover-svg"
      role="img"
      aria-hidden="false"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {kind === 'pipeline' && <Pipeline />}
      {kind === 'assistant' && <Assistant />}
      {kind === 'triage' && <Triage />}
      {kind === 'invoice' && <Invoice />}
    </svg>
  );
}

function Pipeline() {
  const nodes = [
    { x: 40, t: 'INTAKE' },
    { x: 195, t: 'VALIDATE' },
    { x: 350, t: 'AI STRUCTURE' },
    { x: 515, t: 'ROUTE' },
  ];
  return (
    <g>
      {nodes.map((n, i) => (
        <g key={n.t}>
          <rect x={n.x} y={130} width={110} height={52} rx={10} fill={nodeFill} stroke="rgba(255,255,255,0.16)" />
          <text x={n.x + 55} y={160} textAnchor="middle" {...(i === 2 ? labelCr : label)}>
            {n.t}
          </text>
          {i < nodes.length - 1 && (
            <line
              x1={n.x + 110}
              y1={156}
              x2={nodes[i + 1].x - 8}
              y2={156}
              stroke="#FF303B"
              strokeOpacity={0.55}
              strokeDasharray="3 4"
            />
          )}
        </g>
      ))}
      <circle cx={200} cy={156} r={3.5} fill="#FF303B">
        <animate attributeName="cx" values="100;600" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <text x={40} y={95} {...label}>
        {'{" name ":" Sana K. ", " request ":" invoice automation ", " urgency ":" HIGH "}'}
      </text>
      <text x={224} y={260} textAnchor="middle" {...labelCr} fontSize={9}>
        WEBHOOK → LLM → RULES → NOTIFY
      </text>
    </g>
  );
}

function Assistant() {
  return (
    <g>
      <rect x={175} y={44} width={290} height={252} rx={14} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.16)" />
      <rect x={195} y={64} width={64} height={40} rx={9} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" />
      <text x={227} y={88} textAnchor="middle" {...label} fontSize={8.5}>
        YOU
      </text>
      <rect x={204} y={74} width={46} height={7} rx={3.5} fill="rgba(255,255,255,0.16)" />
      <rect x={204} y={87} width={30} height={7} rx={3.5} fill="rgba(255,255,255,0.1)" />

      <rect x={381} y={116} width={64} height={52} rx={9} fill="rgba(255,48,59,0.1)" stroke="rgba(255,48,59,0.4)" />
      <text x={413} y={146} textAnchor="middle" {...labelCr} fontSize={8.5}>
        AI
      </text>
      <rect x={390} y={126} width={46} height={7} rx={3.5} fill="rgba(255,255,255,0.14)" />
      <rect x={390} y={139} width={34} height={7} rx={3.5} fill="rgba(255,255,255,0.1)" />
      <rect x={390} y={152} width={40} height={7} rx={3.5} fill="rgba(255,255,255,0.08)" />

      <rect x={195} y={252} width={250} height={28} rx={9} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
      <text x={207} y={270} {...label} fontSize={8}>
        ASK ABOUT SERVICES / PRICING…
      </text>
      <text x={320} y={320} textAnchor="middle" {...labelCr} fontSize={9}>
        SERVER-KEY · FACT-LOCKED · RATE-LIMITED
      </text>
    </g>
  );
}

function Triage() {
  return (
    <g>
      <rect x={256} y={48} width={128} height={42} rx={10} fill={nodeFill} stroke="rgba(255,255,255,0.16)" />
      <text x={320} y={74} textAnchor="middle" {...labelCr}>
        NEW REQUEST
      </text>

      {[
        { x: 92, t: 'URGENT', cr: true },
        { x: 262, t: 'STANDARD', cr: false },
        { x: 432, t: 'NOISE', cr: false },
      ].map((b) => (
        <g key={b.t}>
          <line x1={320} y1={90} x2={b.x + 88} y2={182} stroke="rgba(255,48,59,0.4)" strokeDasharray="3 4" />
          <rect x={b.x} y={182} width={176} height={40} rx={10} fill={nodeFill} stroke="rgba(255,255,255,0.16)" />
          <text x={b.x + 88} y={206} textAnchor="middle" {...(b.cr ? labelCr : label)}>
            {b.t}
          </text>
        </g>
      ))}
      <text x={320} y={300} textAnchor="middle" {...label}>
        LOW CONFIDENCE → HUMAN QUEUE (NEVER GUESSES)
      </text>
    </g>
  );
}

function Invoice() {
  return (
    <g>
      <rect x={64} y={58} width={150} height={196} rx={10} fill={nodeFill} stroke="rgba(255,255,255,0.16)" />
      <text x={139} y={88} textAnchor="middle" {...label} fontSize={8.5}>
        INVOICE
      </text>
      {[116, 140, 164, 188, 212].map((y) => (
        <rect key={y} x={86} y={y} width={104} height={6} rx={3} fill="rgba(255,255,255,0.12)" />
      ))}

      <line x1={240} y1={156} x2={300} y2={156} stroke="#FF303B" strokeDasharray="3 4" strokeOpacity={0.6} />
      <polygon points="296,150 310,156 296,162" fill="#FF303B" />

      <text x={352} y={92} {...label}>
        {'{ "invoice_no":"INV-0921,"'}
      </text>
      <text x={352} y={122} {...label}>
        {'  "date":"2026-10-12",'}
      </text>
      <text x={352} y={152} {...labelCr}>
        {'  "total":"2450.00",'}
      </text>
      <text x={352} y={182} {...label}>
        {'  "currency":"USD "}'}
      </text>
      <rect x={352} y={210} width={222} height={40} rx={10} fill="rgba(255,48,59,0.08)" stroke="rgba(255,48,59,0.4)" />
      <text x={463} y={234} textAnchor="middle" {...labelCr} fontSize={8.5}>
        SCHEMA CHECK → REVIEW QUEUE → EXPORT
      </text>
    </g>
  );
}
