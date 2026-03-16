import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Users, AlertCircle } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Terms = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 pb-20 sm:pt-20 sm:pb-16">
        <div className="max-w-4xl px-3 mx-auto sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 min-h-[44px] px-1"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800 sm:text-3xl">Terms of Service</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 bg-white shadow-lg rounded-2xl sm:p-8 sm:mb-8"
          >
            <div className="max-w-none">
              <p className="mb-4 text-xs text-gray-600 sm:text-sm sm:mb-6">Last updated: September 13, 2025</p>

              <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base sm:mb-8">
                Welcome to QuickBites! These Terms of Service govern your use of our food delivery platform. By using our services, you agree to these terms.
              </p>

              <h2 className="flex flex-wrap items-center gap-2 mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">
                <Users className="flex-shrink-0 w-5 h-5 text-blue-500 sm:w-6 sm:h-6" />
                User Agreement
              </h2>
              <div className="p-4 mb-5 border border-blue-200 rounded-lg bg-blue-50 sm:p-6 sm:mb-6">
                <ul className="space-y-2 text-gray-700 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm sm:text-base">You must be at least 18 years old to use QuickBites</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm sm:text-base">You are responsible for maintaining the security of your account</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm sm:text-base">You agree to provide accurate and up-to-date information</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm sm:text-base">You will not use our platform for any illegal or unauthorized purposes</span>
                  </li>
                </ul>
              </div>

              <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">Service Description</h2>
              <div className="mb-5 space-y-3 sm:space-y-4 sm:mb-6">
                <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                  QuickBites is a food delivery platform that connects you with local restaurants. We facilitate orders and coordinate delivery but are not directly responsible for food preparation.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="p-3 border border-gray-200 rounded-lg sm:p-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:text-base">Our Role</h3>
                    <ul className="space-y-1 text-xs text-gray-600 sm:text-sm">
                      <li>• Platform and app operation</li>
                      <li>• Order processing and tracking</li>
                      <li>• Customer support</li>
                      <li>• Payment processing</li>
                    </ul>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg sm:p-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:text-base">Restaurant Role</h3>
                    <ul className="space-y-1 text-xs text-gray-600 sm:text-sm">
                      <li>• Food preparation and quality</li>
                      <li>• Order accuracy</li>
                      <li>• Food safety compliance</li>
                      <li>• Menu and pricing updates</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">Payment Terms</h2>
              <div className="p-4 mb-5 border border-green-200 rounded-lg bg-green-50 sm:p-6 sm:mb-6">
                <ul className="space-y-2 text-sm text-gray-700 sm:space-y-3 sm:text-base">
                  <li>• All prices are inclusive of applicable taxes</li>
                  <li>• Payment is required at the time of order placement (except COD)</li>
                  <li>• We accept various payment methods as displayed during checkout</li>
                  <li>• Delivery charges and service fees are clearly disclosed</li>
                  <li>• Promotional codes and discounts are subject to terms and conditions</li>
                </ul>
              </div>

              <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">Order and Delivery</h2>
              <div className="mb-5 space-y-3 sm:space-y-4 sm:mb-6">
                <div className="p-3 border border-gray-200 rounded-lg sm:p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:text-base">Order Acceptance</h3>
                  <p className="text-sm text-gray-600 sm:text-base">Orders are subject to availability and restaurant acceptance. We reserve the right to cancel orders in exceptional circumstances.</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg sm:p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-800 sm:text-base">Delivery Times</h3>
                  <p className="text-sm text-gray-600 sm:text-base">Estimated delivery times are approximate and may vary due to weather, traffic, or high demand.</p>
                </div>
              </div>

              <h2 className="flex flex-wrap items-center gap-2 mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">
                <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500 sm:w-6 sm:h-6" />
                Limitation of Liability
              </h2>
              <div className="p-4 mb-5 border border-red-200 rounded-lg bg-red-50 sm:p-6 sm:mb-6">
                <p className="mb-3 text-sm text-gray-700 sm:mb-4 sm:text-base">
                  QuickBites acts as an intermediary between customers and restaurants. Our liability is limited as follows:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 sm:text-base">
                  <li>• We are not responsible for food quality, taste, or preparation</li>
                  <li>• Food allergies and dietary restrictions are the customer's responsibility</li>
                  <li>• We are not liable for any health issues resulting from food consumption</li>
                  <li>• Maximum liability is limited to the order value</li>
                </ul>
              </div>

              <h2 className="flex flex-wrap items-center gap-2 mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">
                <Shield className="flex-shrink-0 w-5 h-5 text-purple-500 sm:w-6 sm:h-6" />
                Privacy and Data
              </h2>
              <div className="p-4 mb-5 border border-purple-200 rounded-lg bg-purple-50 sm:p-6 sm:mb-6">
                <p className="mb-3 text-sm leading-relaxed text-gray-700 sm:mb-4 sm:text-base">
                  Your privacy is important to us. Please review our{' '}
                  <button
                    onClick={() => navigate('/privacy')}
                    className="font-semibold text-purple-600 underline hover:text-purple-800"
                  >
                    Privacy Policy
                  </button>
                  {' '}for detailed information about how we collect, use, and protect your personal data.
                </p>
                <ul className="space-y-2 text-sm text-gray-700 sm:text-base">
                  <li>• We collect necessary information to provide our services</li>
                  <li>• Your data is protected with industry-standard security measures</li>
                  <li>• We do not sell your personal information to third parties</li>
                </ul>
              </div>

              <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">Changes to Terms</h2>
              <div className="p-4 mb-5 border border-gray-200 rounded-lg bg-gray-50 sm:p-6 sm:mb-6">
                <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                  We may update these Terms of Service from time to time. We will notify users of significant changes through the app or email. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </div>

              <h2 className="mb-3 text-lg font-bold text-gray-800 sm:text-2xl sm:mb-4">Contact Information</h2>
              <div className="p-4 border border-gray-200 rounded-lg sm:p-6">
                <p className="mb-3 text-sm text-gray-700 sm:mb-4 sm:text-base">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-sm text-gray-600 sm:text-base">
                  <p>📧 Email: legal@quickbites.com</p>
                  <p>📞 Phone: 1800-123-4567</p>
                  <p>📍 Address: QuickBites Legal Team, Vadodara, Gujarat, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Terms
