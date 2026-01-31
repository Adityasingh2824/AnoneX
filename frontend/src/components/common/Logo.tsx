import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  animated?: boolean
}

export function Logo({ className = 'w-10 h-10', animated = true }: LogoProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 },
      },
    },
  }

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer ring */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        variants={pathVariants}
        filter="url(#glow)"
      />
      
      {/* Anonymous figure head */}
      <motion.circle
        cx="50"
        cy="35"
        r="12"
        fill="url(#logoGradient)"
        initial={animated ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
      />
      
      {/* Anonymous figure body curve */}
      <motion.path
        d="M25 72 Q50 55 75 72"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        variants={pathVariants}
      />
      
      {/* Privacy dot (eye) */}
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill="url(#logoGradient)"
        initial={animated ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3, type: "spring" }}
      />
      
      {/* Shield lines */}
      <motion.path
        d="M50 58 L50 68"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={pathVariants}
      />
    </motion.svg>
  )
}
