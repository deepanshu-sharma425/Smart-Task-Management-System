'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  hover?: boolean;
}

export default function AnimatedCard({
  children,
  className = '',
  id,
  delay = 0,
  hover = true,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeInOut",
      }}
      whileHover={hover ? { y: -6, transition: { duration: 0.3 } } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
