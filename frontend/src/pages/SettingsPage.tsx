import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Key,
  Download,
  Trash2,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Badge } from '../components/common/Badge'
import { cn } from '@/utils/cn'

type SettingsSection = 'profile' | 'privacy' | 'notifications' | 'appearance' | 'security' | 'data'

const sections = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'privacy' as const, label: 'Privacy', icon: Shield },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  { id: 'security' as const, label: 'Security', icon: Key },
  { id: 'data' as const, label: 'Data', icon: Download },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  
  // Settings states
  const [settings, setSettings] = useState({
    displayName: 'CryptoPhoenix42',
    bio: 'Building the future of privacy-first social media.',
    allowFollowers: true,
    showActivity: false,
    allowDMs: true,
    pushNotifications: true,
    emailNotifications: false,
    mentionNotifications: true,
    followerNotifications: true,
    twoFactorEnabled: false,
  })

  const updateSetting = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Settings</h1>
          <p className="text-white/60">Manage your account and preferences</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card padding="sm">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                    activeSection === section.id
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="settingsActiveSection"
                      className="absolute inset-0 rounded-xl bg-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <section.icon className="relative w-5 h-5" />
                  <span className="relative font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Display Name"
                  value={settings.displayName}
                  onChange={(e) => updateSetting('displayName', e.target.value)}
                  placeholder="Your pseudonym..."
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Bio</label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => updateSetting('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan/50 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingToggle
                  title="Allow Followers"
                  description="Let others follow your account"
                  checked={settings.allowFollowers}
                  onChange={(v) => updateSetting('allowFollowers', v)}
                />
                <SettingToggle
                  title="Show Activity Status"
                  description="Show when you're online"
                  checked={settings.showActivity}
                  onChange={(v) => updateSetting('showActivity', v)}
                />
                <SettingToggle
                  title="Allow Direct Messages"
                  description="Receive messages from others"
                  checked={settings.allowDMs}
                  onChange={(v) => updateSetting('allowDMs', v)}
                />
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingToggle
                  title="Push Notifications"
                  description="Receive push notifications on your device"
                  checked={settings.pushNotifications}
                  onChange={(v) => updateSetting('pushNotifications', v)}
                />
                <SettingToggle
                  title="Mentions"
                  description="Get notified when someone mentions you"
                  checked={settings.mentionNotifications}
                  onChange={(v) => updateSetting('mentionNotifications', v)}
                />
                <SettingToggle
                  title="New Followers"
                  description="Get notified when someone follows you"
                  checked={settings.followerNotifications}
                  onChange={(v) => updateSetting('followerNotifications', v)}
                />
              </CardContent>
            </Card>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how AnoneX looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white/80 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark' as const, label: 'Dark', icon: Moon },
                      { id: 'light' as const, label: 'Light', icon: Sun },
                      { id: 'system' as const, label: 'System', icon: Smartphone },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                          theme === t.id
                            ? 'bg-white/10 border-neon-cyan/50'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        )}
                      >
                        <t.icon className={cn(
                          'w-6 h-6',
                          theme === t.id ? 'text-neon-cyan' : 'text-white/50'
                        )} />
                        <span className="text-sm font-medium text-white">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Protect your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingToggle
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security"
                  checked={settings.twoFactorEnabled}
                  onChange={(v) => updateSetting('twoFactorEnabled', v)}
                />
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-medium text-white mb-2">Connected Wallet</h4>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">Aleo Wallet</p>
                        <p className="text-xs text-white/50 font-mono">aleo1abc...xyz</p>
                      </div>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Section */}
          {activeSection === 'data' && (
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Download or delete your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-neon-cyan" />
                    <div>
                      <p className="font-medium text-white text-sm">Export Data</p>
                      <p className="text-xs text-white/50">Download all your posts and data</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Export</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="font-medium text-white text-sm">Delete Account</p>
                      <p className="text-xs text-white/50">Permanently delete your account</p>
                    </div>
                  </div>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

// Toggle Component
interface SettingToggleProps {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

function SettingToggle({ title, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="font-medium text-white text-sm">{title}</p>
        <p className="text-xs text-white/50">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-12 h-6 rounded-full transition-colors',
          checked ? 'bg-neon-cyan' : 'bg-white/20'
        )}
      >
        <motion.div
          layout
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
          animate={{ left: checked ? '1.5rem' : '0.25rem' }}
        />
      </button>
    </div>
  )
}
