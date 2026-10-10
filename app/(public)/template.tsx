"use client";

import { motion, useReducedMotion } from "framer-motion";

// A template (unlike a layout) remounts on every navigation, so each page
// fades up out of a slight blur as it arrives.
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      // Drop the filter once settled: a lingering filter would make this wrapper
      // a containing block for fixed-position children and cost compositing.
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
