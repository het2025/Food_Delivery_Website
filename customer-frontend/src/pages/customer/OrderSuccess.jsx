import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package } from 'lucide-react'
import Header from '../../components/Header'
import confetti from 'canvas-confetti'

// --- 🍑 WARM PEACH THEME (With Clean White Cards) ---
// bgMain: '#FFF3E8'
// borderOrange: '#E85D04'
// accentAmber: '#F48C06'
// textDark: '#2C1810'
// textMuted: '#5C3D2E'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    console.log('Location State:', location.state)

    // Get order data from location state or localStorage
    const stateData = location.state
    const savedOrder = localStorage.getItem('lastOrder')

    if (stateData) {
      console.log('Using state data:', stateData)
      setOrderData(stateData)
      // Save to localStorage as backup
      localStorage.setItem('lastOrder', JSON.stringify(stateData))
    } else if (savedOrder) {
      console.log('Using saved order:', savedOrder)
      setOrderData(JSON.parse(savedOrder))
    } else {
      console.log('No order data found')
      setOrderData(null)
    }

    // Trigger confetti animation
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#E85D04', '#F48C06', '#10B981', '#3B82F6']
    })
  }, [location.state])

  useEffect(() => {
    const handlePopState = (e) => {
      // Always go to /home if user hits back from this page
      e.preventDefault?.();
      navigate('/home', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#FFF3E8] font-['Inter',_sans-serif]">
        <Header />
        <div className="flex justify-center items-center min-h-[80vh] px-4 pt-20">
          <div className="text-center bg-white p-8 sm:p-12 rounded-3xl shadow-[0_10px_40px_rgba(44,24,16,0.08)] border border-[rgba(44,24,16,0.05)]">
            <p className="mb-6 font-bold text-[#2C1810] text-lg">No order information found</p>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-3.5 text-white font-bold bg-gradient-to-r from-[#E85D04] to-[#F48C06] rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Extract values with multiple fallback options
  const orderId =
    orderData.orderId || orderData._id || orderData.id || 'Loading...'
  const orderNumber =
    orderData.orderNumber ||
    orderData.orderId ||
    orderData._id ||
    orderData.id ||
    'Processing...'
  const total =
    orderData.total ||
    orderData.totalAmount ||
    orderData.amount ||
    orderData.finalAmount ||
    0
  const paymentMethod =
    orderData.paymentMethod ||
    orderData.payment?.method ||
    orderData.paymentType ||
    'Online'
  const estimatedDeliveryTime =
    orderData.estimatedDeliveryTime ||
    orderData.deliveryTime ||
    orderData.estimatedTime ||
    '30-45 mins'

  console.log('Extracted values:', { orderId, orderNumber, total, paymentMethod })

  return (
    <div className="min-h-screen bg-[#FFF3E8] font-['Inter',_sans-serif]">
      <Header />

      <div className="pt-24 sm:pt-32 pb-12 sm:pb-16">
        <div className="px-4 mx-auto max-w-2xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 sm:p-10 text-center bg-white rounded-3xl shadow-[0_20px_60px_rgba(44,24,16,0.08)] border border-[rgba(44,24,16,0.05)] relative overflow-hidden"
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFF3E8]/50 to-transparent"></div>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative flex justify-center items-center mx-auto mb-6 sm:mb-8 w-20 h-20 sm:w-24 sm:h-24 bg-green-50 border-4 border-white shadow-lg rounded-full z-10"
            >
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-500" />
            </motion.div>

            {/* Success Message */}
            <div className="relative z-10">
              <h1 className="mb-2 sm:mb-3 text-2xl sm:text-4xl font-extrabold text-[#2C1810]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Order Placed Successfully! 🎉
              </h1>
              <p className="mb-6 sm:mb-10 text-sm sm:text-base font-medium text-[#5C3D2E]">
                Thank you for your order. We're preparing your delicious food!
              </p>
            </div>

            {/* Order Details Box */}
            <div className="p-5 sm:p-8 mb-6 sm:mb-8 text-left bg-[#FFF3E8]/50 border border-[rgba(44,24,16,0.05)] rounded-2xl relative z-10">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex justify-between items-start gap-3">
                  <span className="font-bold text-[#5C3D2E] text-sm sm:text-base shrink-0">Order Number</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#E85D04] text-right break-all">
                    #{orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-3">
                  <span className="font-bold text-[#5C3D2E] text-sm sm:text-base shrink-0">Total Amount</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#2C1810]">
                    ₹{Number(total).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-3">
                  <span className="font-bold text-[#5C3D2E] text-sm sm:text-base shrink-0">Payment Method</span>
                  <span className="font-extrabold text-[#2C1810] capitalize text-sm sm:text-base text-right">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-3">
                  <span className="font-bold text-[#5C3D2E] text-sm sm:text-base shrink-0">
                    {orderData.isScheduled ? 'Scheduled For' : 'Estimated Delivery'}
                  </span>
                  <span className="font-extrabold text-[#2C1810] text-sm sm:text-base text-right">
                    {orderData.isScheduled && orderData.scheduledFor
                      ? new Date(orderData.scheduledFor).toLocaleString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : (typeof estimatedDeliveryTime === 'string'
                        ? estimatedDeliveryTime
                        : new Date(estimatedDeliveryTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        }))
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row relative z-10">
              <button
                onClick={() => {
                  navigate(`/track-order/${orderId}`)
                }}
                className="flex flex-1 gap-2 justify-center items-center px-4 sm:px-6 py-3.5 font-bold text-white bg-gradient-to-r from-[#E85D04] to-[#F48C06] rounded-xl shadow-lg shadow-[#E85D04]/20 transition-transform hover:scale-105 text-sm sm:text-base touch-manipulation"
              >
                <Package className="w-5 h-5 shrink-0" />
                Track Order
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('lastOrder')
                  navigate('/home')
                }}
                className="flex-1 px-4 sm:px-6 py-3.5 font-bold text-[#2C1810] bg-[rgba(44,24,16,0.05)] rounded-xl transition-colors hover:bg-[rgba(44,24,16,0.1)] text-sm sm:text-base touch-manipulation"
              >
                Continue Shopping
              </button>
            </div>

            {/* Info Footer */}
            <div className="pt-5 sm:pt-6 mt-6 sm:mt-8 border-t border-[rgba(44,24,16,0.05)] relative z-10">
              <p className="text-xs sm:text-sm font-semibold text-[#5C3D2E]/80">
                📧 Order confirmation has been sent to your email
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess