import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Star,
  ArrowLeft,
  Phone,
  MapPin,
  Loader,
  XCircle,
  Store
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';


const Orders = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [pendingCancelId, setPendingCancelId] = useState(null)
  const [showRateModal, setShowRateModal] = useState(false)
  const [pendingRateId, setPendingRateId] = useState(null)
  const [pendingRatingStar, setPendingRatingStar] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [notification, setNotification] = useState(null)


  useEffect(() => {
    fetchOrders()
  }, [activeFilter])


  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const url = activeFilter === 'All'
        ? `${API_BASE_URL}/orders/my-orders`
        : `${API_BASE_URL}/orders/my-orders?status=${activeFilter}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      console.log('Orders API Response:', data)

      if (data.success) {
        setOrders(Array.isArray(data.data) ? data.data : [])
      } else {
        setError(data.message || 'Failed to load orders')
        setOrders([])
      }

    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders. Please try again.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }


  const handleCancelOrder = (orderId) => {
    setPendingCancelId(orderId)
    setShowCancelModal(true)
  }

  const confirmCancelOrder = async () => {
    setShowCancelModal(false)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/orders/${pendingCancelId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Cancelled by customer'
        })
      })

      const data = await response.json()

      if (data.success) {
        setNotification({ type: 'success', message: 'Order cancelled successfully' })
        fetchOrders()
      } else {
        setNotification({ type: 'error', message: data.message || 'Could not cancel order' })
      }

    } catch (error) {
      console.error('Error cancelling order:', error)
      setNotification({ type: 'error', message: 'Failed to cancel order' })
    } finally {
      setPendingCancelId(null)
    }
  }


  const handleRateOrder = (orderId, star) => {
    setPendingRateId(orderId)
    setPendingRatingStar(star)
    setReviewText('')
    setShowRateModal(true)
  }

  const submitRating = async () => {
    setShowRateModal(false)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/orders/${pendingRateId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: pendingRatingStar,
          review: reviewText
        })
      })

      const data = await response.json()

      if (data.success) {
        setNotification({ type: 'success', message: 'Thank you for your rating!' })
        fetchOrders()
      } else {
        setNotification({ type: 'error', message: data.message || 'Could not submit rating' })
      }

    } catch (error) {
      console.error('Error rating order:', error)
      setNotification({ type: 'error', message: 'Failed to submit rating' })
    } finally {
      setPendingRateId(null)
      setPendingRatingStar(0)
    }
  }

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };



  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'Out for Delivery': return <Truck className="w-5 h-5 text-blue-500" />
      case 'Preparing': return <Clock className="w-5 h-5 text-orange-500" />
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Package className="w-5 h-5 text-gray-500" />
    }
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Out for Delivery': return 'bg-blue-100 text-blue-800'
      case 'Preparing': return 'bg-orange-100 text-orange-800'
      case 'Confirmed': return 'bg-purple-100 text-purple-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  const filters = ['All', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-20 pb-16">
          <div className="text-center">
            <Loader className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-spin" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center mb-4 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center mr-3 text-gray-600 sm:mr-4 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800 sm:text-3xl">My Orders</h1>
          </div>


          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 pb-2 mb-6 -mx-4 overflow-x-auto sm:gap-3 sm:mb-8 sm:mx-0 sm:px-0 scrollbar-hide"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-all flex-shrink-0 ${activeFilter === filter
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-50 shadow-md'
                  }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>


          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          {/* Notification Toast */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onAnimationComplete={() => setTimeout(() => setNotification(null), 3000)}
                className={`px-4 py-3 mb-4 rounded-lg border font-medium ${
                  notification.type === 'success'
                    ? 'text-green-700 bg-green-50 border-green-300'
                    : 'text-red-700 bg-red-50 border-red-300'
                }`}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>


          {/* Orders List */}
          <div className="space-y-6">
            <AnimatePresence>
              {orders && orders.length > 0 && orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 transition-shadow bg-white shadow-lg sm:p-6 rounded-2xl hover:shadow-xl"
                >
                  <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex items-start gap-4">
                      {/* Restaurant Icon */}
                      <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-red-100">
                        <Store className="text-orange-600 w-7 h-7 sm:w-8 sm:h-8" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-800 sm:text-lg">{order.restaurantName}</h3>
                        <p className="text-sm text-gray-600">Order #{order.orderId}</p>
                        {order.deliveryAddress && (
                          <div className="flex items-start gap-2 mt-2">
                            <MapPin className="mt-0.5 w-4 h-4 text-gray-400 flex-shrink-0" />
                            <p className="text-sm text-gray-500">
                              {order.deliveryAddress.street}, {order.deliveryAddress.city}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold self-start sm:self-auto ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>


                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-semibold text-gray-500">Items Ordered:</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {order.items && order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>• {item.name}</span>
                              <span className="text-gray-600">x {item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-semibold text-gray-500">Order Details:</p>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>
                            <span className="text-gray-500">Ordered:</span>{' '}
                            {new Date(order.orderTime).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {order.actualDeliveryTime && (
                            <p>
                              <span className="text-gray-500">Delivered:</span>{' '}
                              {new Date(order.actualDeliveryTime).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                          {order.isScheduled && order.scheduledFor && (
                            <p>
                              <span className="text-gray-500">Scheduled For:</span>{' '}
                              {new Date(order.scheduledFor).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                          {!order.isScheduled && order.estimatedDeliveryTime && !order.actualDeliveryTime && (
                            <p>
                              <span className="text-gray-500">Estimated:</span>{' '}
                              {new Date(order.estimatedDeliveryTime).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                          <p className="pt-2 text-base font-bold text-orange-600 sm:text-lg">Total: ₹{order.total}</p>
                        </div>
                      </div>
                    </div>


                    <div className="flex flex-wrap gap-2 mt-4">
                      {/* View Details */}
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="flex-1 min-w-[calc(50%-4px)] sm:min-w-[140px] px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 text-center"
                      >
                        View Details
                      </button>

                      {/* Track Order Button - Only for active orders */}
                      {!['Cancelled', 'Delivered', 'OutForDelivery'].includes(order.status) && (
                        <button
                          onClick={() => handleTrackOrder(order._id)}
                          className="flex-1 min-w-[calc(50%-4px)] sm:min-w-0 flex gap-1.5 sm:gap-2 items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
                        >
                          <Truck className="w-4 h-4" />
                          Track Order
                        </button>
                      )}

                      {/* Cancel Order - Only for pending/preparing orders */}
                      {['Preparing', 'Confirmed', 'Pending', 'Accepted'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex-1 min-w-[calc(50%-4px)] sm:min-w-0 flex gap-1.5 sm:gap-2 items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      )}

                      {/* Call Delivery - Only when out for delivery */}
                      {order.status === 'Out for Delivery' && (
                        <button className="flex-1 min-w-[calc(50%-4px)] sm:min-w-0 flex gap-1.5 sm:gap-2 items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600">
                          <Phone className="w-4 h-4" />
                          Call Delivery
                        </button>
                      )}

                      {/* Reorder */}
                      {order.restaurant && (
                        <button
                          onClick={() => navigate(`/restaurant/${order.restaurant}`)}
                          className="flex-1 min-w-[calc(50%-4px)] sm:min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold text-white bg-orange-500 rounded-lg transition-colors hover:bg-orange-600 text-center"
                        >
                          Reorder
                        </button>
                      )}

                      {/* Show rating if already rated */}
                      {order.status === 'Delivered' && order.rating && (
                        <div className="flex items-center flex-shrink-0 gap-1 px-3 py-2 text-yellow-800 bg-yellow-100 rounded-lg sm:px-4">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold sm:text-base">{order.rating}</span>
                        </div>
                      )}

                      {/* Rate order - Only for delivered orders without rating */}
                      {order.status === 'Delivered' && !order.rating && (
                        <div className="flex justify-around w-full py-1 sm:justify-start sm:gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateOrder(order._id, star)}
                              className="p-1 transition-transform hover:scale-110 active:scale-95"
                              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                              <Star className="text-yellow-500 w-7 h-7 sm:w-6 sm:h-6 hover:fill-current" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>


          {/* No Orders Found */}
          {!loading && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-gray-600">No orders found</h3>
              <p className="mb-6 text-gray-500">
                {activeFilter === 'All'
                  ? "You haven't placed any orders yet"
                  : `No orders with status "${activeFilter}"`
                }
              </p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Start Ordering
              </button>
            </motion.div>
          )}
        </div>
      </div>


      <Footer />

      {/* Cancel Order Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-6 bg-white shadow-2xl rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-2 text-xl font-bold text-gray-800">Cancel Order?</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancelOrder}
                  className="flex-1 px-4 py-3 font-semibold text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Cancel Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate Order Modal */}
      <AnimatePresence>
        {showRateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowRateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-6 bg-white shadow-2xl rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-1 text-xl font-bold text-gray-800">Rate Your Order</h3>
              <div className="flex gap-2 mt-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPendingRatingStar(s)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        s <= pendingRatingStar ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Review (optional)</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                placeholder="Share your experience..."
                className="w-full px-3 py-2 mb-4 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRateModal(false)}
                  className="flex-1 px-4 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={pendingRatingStar === 0}
                  className="flex-1 px-4 py-3 font-semibold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export default Orders
