import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'demo'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  icon?: ReactNode
  pulse?: boolean
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white/80 border-white/10',
  primary: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  success: 'bg-neon-green/10 text-neon-green border-neon-green/30',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  danger: 'bg-red-500/10 text-red-400 border-red-500/30',
  info: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
  demo: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
}

export function Badge({
  children,
  variant = 'default',
  icon,
  pulse = false,
  className,
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            variant === 'success' && 'bg-neon-green',
            variant === 'primary' && 'bg-neon-cyan',
            variant === 'warning' && 'bg-yellow-400',
            variant === 'danger' && 'bg-red-400',
            variant === 'info' && 'bg-neon-purple',
            variant === 'demo' && 'bg-orange-400',
            variant === 'default' && 'bg-white'
          )} />
          <span className={cn(
            'relative inline-flex rounded-full h-2 w-2',
            variant === 'success' && 'bg-neon-green',
            variant === 'primary' && 'bg-neon-cyan',
            variant === 'warning' && 'bg-yellow-400',
            variant === 'danger' && 'bg-red-400',
            variant === 'info' && 'bg-neon-purple',
            variant === 'demo' && 'bg-orange-400',
            variant === 'default' && 'bg-white'
          )} />
        </span>
      )}
      {icon}
      {children}
    </motion.span>
  )
}
