import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Clock, MapPin } from 'lucide-react'
import Header from '../../components/Header'
import confetti from 'canvas-confetti'

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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center pt-20 px-4">
          <div className="text-center">
            <p className="mb-4 text-gray-600">No order information found</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 sm:pt-20 pb-8 sm:pb-16">
        <div className="px-3 mx-auto max-w-2xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-8 text-center bg-white rounded-2xl shadow-lg"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center items-center mx-auto mb-4 sm:mb-6 w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full"
            >
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
            </motion.div>

            {/* Success Message */}
            <h1 className="mb-1 sm:mb-2 text-xl sm:text-3xl font-bold text-gray-800">
              Order Placed Successfully! 🎉
            </h1>
            <p className="mb-4 sm:mb-8 text-sm sm:text-base text-gray-600">
              Thank you for your order. We're preparing your delicious food!
            </p>

            {/* Order Details */}
            <div className="p-3 sm:p-6 mb-4 sm:mb-6 text-left bg-gray-50 rounded-lg">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-medium text-gray-600 text-sm sm:text-base shrink-0">Order Number</span>
                  <span className="text-base sm:text-lg font-bold text-orange-500 text-right break-all">
                    #{orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-gray-600 text-sm sm:text-base shrink-0">Total Amount</span>
                  <span className="text-base sm:text-lg font-bold text-gray-800">
                    ₹{Number(total).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-gray-600 text-sm sm:text-base shrink-0">Payment Method</span>
                  <span className="font-semibold text-gray-800 capitalize text-sm sm:text-base text-right">
                    {paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2">
                  <span className="font-medium text-gray-600 text-sm sm:text-base shrink-0">
                    {orderData.isScheduled ? 'Scheduled For' : 'Estimated Delivery'}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base text-right">
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
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
              <button
                onClick={() => {
                  // Navigate directly to tracking page
                  navigate(`/track-order/${orderId}`)
                }}
                className="flex flex-1 gap-2 justify-center items-center px-4 sm:px-6 py-3 font-semibold text-white bg-orange-500 rounded-lg transition-colors hover:bg-orange-600 text-sm sm:text-base"
              >
                <Package className="w-5 h-5 shrink-0" />
                Track Order
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('lastOrder')
                  navigate('/home')
                }}
                className="flex-1 px-4 sm:px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300 text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>

            {/* Info */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500">
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
