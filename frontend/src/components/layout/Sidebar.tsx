import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Compass,
  PenSquare,
  User,
  Users,
  Settings,
  Shield,
  Zap,
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: PenSquare, label: 'Create', path: '/create' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Users, label: 'Groups', path: '/groups' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 flex-col border-r border-white/5 bg-void-950/50 backdrop-blur-sm"
    >
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link
                to={item.path}
                className={`
                  relative flex items-center gap-4 px-4 py-3 rounded-xl
                  transition-all duration-300 group
                  ${isActive 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Glow effect on active */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink rounded-full"
                    layoutId="activeGlow"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon className={`relative w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="relative font-medium">{item.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        {/* Privacy Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-white/80">Privacy Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full"
              />
            </div>
            <span className="text-xs text-neon-green font-mono">100%</span>
          </div>
          <p className="text-xs text-white/50">All data encrypted on Aleo</p>
        </motion.div>

        {/* Network Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5"
        >
          <div className="relative">
            <Zap className="w-4 h-4 text-neon-green" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-medium text-white/80">Aleo Testnet</p>
            <p className="text-[10px] text-white/40 font-mono">Connected</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
