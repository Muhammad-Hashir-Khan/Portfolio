import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { skillCategories } from '../data/portfolio';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function SkillsPage({ ready = true }: { ready?: boolean }) {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const reduce = useReducedMotion();

  const active = skillCategories.find((category) => category.id === activeId) ?? skillCategories[0];

  return (
    <Page className="skills-page">
      <div className="container page-top">
        <PageHeader
          slit={{ text: 'SKILLS', subtitle: 'TOOLS & STACK' }}
          ready={ready}
          lead="Organized by what each group does inside a real project — specialization first, supporting engineering around it."
        />
      </div>

      {/* ── Tabbed capability matrix ── */}
      <section className="section" aria-label="Skill categories">
        <div className="container skills-layout">
          <div className="skills-tabs" role="tablist" aria-label="Skill categories" aria-orientation="vertical">
            {skillCategories.map((category) => {
              const selected = category.id === active.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  id={`skill-tab-${category.id}`}
                  aria-selected={selected}
                  aria-controls={`skill-panel-${category.id}`}
                  className={selected ? 'skills-tab skills-tab--active' : 'skills-tab'}
                  onClick={() => setActiveId(category.id)}
                >
                  {selected && (
                    <motion.span
                      className="skills-tab__ind"
                      layoutId="skills-tab-indicator"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="skills-tab__title">{category.title}</span>
                  <span className="skills-tab__count">{category.items.length}</span>
                </button>
              );
            })}
          </div>

          <div className="skills-panel-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`skill-panel-${active.id}`}
                aria-labelledby={`skill-tab-${active.id}`}
                className="skills-panel"
                initial={reduce ? undefined : { opacity: 0, y: 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? undefined : { opacity: 0, y: -12, filter: 'blur(5px)' }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div className="skills-panel__head">
                  <h2>{active.title}</h2>
                  {active.featured && <span className="tag-crimson">Primary specialization</span>}
                </div>

                <ul className="skills-panel__list">
                  {active.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={reduce ? undefined : { opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.05 + i * 0.06, ease: EASE }}
                    >
                      <span className="skills-panel__dot" aria-hidden="true" />
                      <span>{item}</span>
                      <span className="skills-panel__num mono-label">{String(i + 1).padStart(2, '0')}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Page>
  );
}
