import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  CreditCard, 
  User,
  ArrowLeft,
  ChevronRight,
  LogOut,
  Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Settings = () => {
  const navigate = useNavigate()
  const { logout } = useUser()
  
  const [settings, setSettings] = useState({
    notifications: {
      orderUpdates: true,
      offers: true,
      newsletter: false,
      sms: true
    },
    preferences: {
      darkMode: false,
      language: 'English',
      currency: 'INR'
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false
    }
  })

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const settingsGroups = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about your order status' },
        { key: 'offers', label: 'Offers & Promotions', description: 'Receive special offers and deals' },
        { key: 'newsletter', label: 'Newsletter', description: 'Weekly food recommendations' },
        { key: 'sms', label: 'SMS Notifications', description: 'Receive SMS for important updates' }
      ]
    },
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        { key: 'darkMode', label: 'Dark Mode', description: 'Switch to dark theme' },
        { key: 'language', label: 'Language', description: 'Choose your preferred language', type: 'select' },
        { key: 'currency', label: 'Currency', description: 'Display prices in your currency', type: 'select' }
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        { key: 'profileVisibility', label: 'Profile Visibility', description: 'Control who can see your profile', type: 'select' },
        { key: 'dataSharing', label: 'Data Sharing', description: 'Share data to improve recommendations' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 sm:pt-20 pb-20 sm:pb-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 min-h-[44px] px-1"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Settings</h1>
          </div>

          <div className="space-y-5 sm:space-y-8">
            {settingsGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <group.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">{group.title}</h2>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  {group.items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">{item.label}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-snug">{item.description}</p>
                      </div>

                      <div className="flex-shrink-0">
                        {item.type === 'select' ? (
                          <select className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 max-w-[110px] sm:max-w-none bg-white">
                            {item.key === 'language' && (
                              <>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Gujarati</option>
                              </>
                            )}
                            {item.key === 'currency' && (
                              <>
                                <option>INR</option>
                                <option>USD</option>
                              </>
                            )}
                            {item.key === 'profileVisibility' && (
                              <>
                                <option>Public</option>
                                <option>Private</option>
                              </>
                            )}
                          </select>
                        ) : (
                          <button
                            onClick={() => handleToggle(group.title.toLowerCase(), item.key)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                              settings[group.title.toLowerCase()]?.[item.key]
                                ? 'bg-orange-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                settings[group.title.toLowerCase()]?.[item.key]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Account</h2>

              <div className="space-y-1">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center justify-between min-h-[52px] text-left hover:bg-gray-50 rounded-xl px-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">Edit Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>

                <button
                  onClick={() => navigate('/payment-methods')}
                  className="w-full flex items-center justify-between min-h-[52px] text-left hover:bg-gray-50 rounded-xl px-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">Payment Methods</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 min-h-[52px] text-left hover:bg-red-50 rounded-xl px-3 transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Sign Out</span>
                </button>

                <button className="w-full flex items-center gap-3 min-h-[52px] text-left hover:bg-red-50 rounded-xl px-3 transition-colors text-red-600">
                  <Trash2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Delete Account</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Settings
