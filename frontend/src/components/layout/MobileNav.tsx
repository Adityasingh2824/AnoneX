import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Compass, PenSquare, User, Users } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: PenSquare, label: 'Create', path: '/create', isAction: true },
  { icon: Users, label: 'Groups', path: '/groups' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-void-950/90 backdrop-blur-xl border-t border-white/5" />
      
      <div className="relative flex items-center justify-around px-2 py-2 safe-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          if (item.isAction) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -mt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink flex items-center justify-center shadow-lg shadow-neon-purple/30"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              </Link>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                transition-colors duration-300
                ${isActive ? 'text-white' : 'text-white/50'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveNav"
                  className="absolute inset-0 rounded-xl bg-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={`relative w-5 h-5 ${isActive ? 'text-neon-cyan' : ''}`} />
              <span className="relative text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
