import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface AvatarProps {
  pseudonym?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showRing?: boolean
  verified?: boolean
  className?: string
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

// Generate a consistent gradient based on pseudonym
function generateGradient(pseudonym: string): string {
  const hash = pseudonym.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  const hue1 = Math.abs(hash % 360)
  const hue2 = (hue1 + 40) % 360
  
  return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%) 0%, hsl(${hue2}, 80%, 50%) 100%)`
}

// Get initials from pseudonym
function getInitials(pseudonym: string): string {
  if (!pseudonym) return '?'
  // Take first character and a character from middle
  const first = pseudonym[0].toUpperCase()
  const middle = pseudonym[Math.floor(pseudonym.length / 2)].toUpperCase()
  return `${first}${middle}`
}

export function Avatar({
  pseudonym = 'Anonymous',
  size = 'md',
  showRing = false,
  verified = false,
  className,
}: AvatarProps) {
  const gradient = generateGradient(pseudonym)
  const initials = getInitials(pseudonym)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn('relative', className)}
    >
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white',
          sizes[size],
          showRing && 'ring-2 ring-neon-cyan/50 ring-offset-2 ring-offset-void-950'
        )}
        style={{ background: gradient }}
      >
        {initials}
      </div>
      
      {/* Verified badge */}
      {verified && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-neon-cyan rounded-full flex items-center justify-center ring-2 ring-void-950"
        >
          <svg className="w-2.5 h-2.5 text-void-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}
