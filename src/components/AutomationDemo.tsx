import { useEffect, useState } from 'react';
import { LuPause, LuPlay, LuRotateCcw } from 'react-icons/lu';
import { demoSteps } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function AutomationDemo() {
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [step, setStep] = useState(reduced ? demoSteps.length : 0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (step >= demoSteps.length) {
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 400 : 1400);
    return () => window.clearTimeout(t);
  }, [running, step]);

  const togglePlay = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (step >= demoSteps.length) setStep(0);
    setRunning(true);
  };

  const progress = step / demoSteps.length;
  const consoleLines = demoSteps.slice(0, step).flatMap((s) => s.console);

  return (
    <section className="section" id="automation" aria-labelledby="automation-title">
      <div className="container">
        <SectionHeading
          index="07"
          label="Inside a workflow"
          title={<span id="automation-title">How an automation thinks.</span>}
          lead="Step through the anatomy of a typical business automation — from raw inquiry to finished, logged action."
        />

        <Reveal delay={60}>
          <div className="card demo__shell">
            <div className="demo__top">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="demo__tag demo__tag--crimson">Illustrative simulation</span>
                <span className="demo__tag">Not a live business integration</span>
              </div>
              <div className="demo__controls">
                <button
                  className="icon-btn"
                  onClick={togglePlay}
                  aria-label={running ? 'Pause simulation' : 'Play simulation'}
                  disabled={reduced}
                >
                  {running ? <LuPause aria-hidden="true" /> : <LuPlay aria-hidden="true" />}
                </button>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setRunning(false);
                    setStep(0);
                  }}
                  aria-label="Reset simulation"
                  disabled={reduced}
                >
                  <LuRotateCcw aria-hidden="true" />
                </button>
              </div>
            </div>

            {reduced && (
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
                Motion is disabled on your system — the finished state of the simulation is shown below.
              </p>
            )}

            <div className="demo__flow" style={{ '--demo-progress': progress } as React.CSSProperties}>
              {demoSteps.map((node, i) => {
                const done = i < step;
                const isActive = i === step && !reduced;
                return (
                  <div
                    key={node.id}
                    className={
                      'demo__node' +
                      (done ? ' demo__node--done' : '') +
                      (isActive ? ' demo__node--active' : '')
                    }
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="demo__node-dot" aria-hidden="true" />
                    <div className="demo__node-body">
                      <h3>
                        {String(i + 1).padStart(2, '0')} · {node.label}
                      </h3>
                      {(done || isActive) && (
                        <div className="demo__node-status">
                          {isActive && <span className="pulse-dot" aria-hidden="true" />}
                          <span>{node.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="demo__console" role="log" aria-label="Simulation console">
              {consoleLines.length === 0 ? (
                <div className="ln">
                  <b>›</b> waiting for run… press play above
                </div>
              ) : (
                consoleLines.map((line, i) => (
                  <div className="ln" key={`${i}-${line}`}>
                    <b>›</b> {line}
                  </div>
                ))
              )}
              {step >= demoSteps.length && (
                <div className="ln">
                  <b>›</b> <span className="ok">workflow completed — every decision traceable, every failure logged</span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
