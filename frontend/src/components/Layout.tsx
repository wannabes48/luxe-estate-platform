import { motion } from "framer-motion";

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.main
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
  >
    {children}
  </motion.main>
);