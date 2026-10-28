import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Route-level transition wrapper — every page fades and drifts up on
 * enter, exits upward. Paired with AnimatePresence (mode="wait") in App.
 */
export default function Page({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <main className={className}>{children}</main>;
  }

  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
