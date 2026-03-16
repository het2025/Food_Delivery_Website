import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Loader,
    Store,
    Phone,
    CreditCard
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.message || 'Failed to fetch order details');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to load order details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'Out for Delivery': return <Truck className="w-6 h-6 text-blue-500" />;
            case 'Preparing': return <Clock className="w-6 h-6 text-orange-500" />;
            case 'Cancelled': return <XCircle className="w-6 h-6 text-red-500" />;
            default: return <Package className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
            case 'Preparing': return 'bg-orange-100 text-orange-800';
            case 'Confirmed': return 'bg-purple-100 text-purple-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex justify-center items-center pt-20 pb-16 min-h-screen">
                    <div className="text-center">
                        <Loader className="mx-auto mb-4 w-12 h-12 text-orange-500 animate-spin" />
                        <p className="text-gray-600">Loading order details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-20 pb-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg inline-block">
                            {error || 'Order not found'}
                        </div>
                        <button
                            onClick={() => navigate('/orders')}
                            className="block mx-auto px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center mb-4 sm:mb-6 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Back to Orders
                    </button>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {/* Status Header */}
                        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 break-words">
                                        Order #{order.orderId || order._id?.slice(-8).toUpperCase()}
                                    </h1>
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
                                            dateStyle: 'long',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>

                                <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-sm flex-shrink-0 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span>{order.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {/* Left Column - Order Items */}
                            <div className="md:col-span-2 space-y-6 sm:space-y-8">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                        Order Items
                                    </h2>
                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-xl">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-gray-900 text-sm sm:text-base flex-shrink-0">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                        Delivery Details
                                    </h2>
                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Delivery Address</p>
                                        <p className="text-gray-600 text-sm">{order.deliveryAddress?.street}</p>
                                        <p className="text-gray-600 text-sm">
                                            {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Payment & Summary */}
                            <div className="space-y-6 sm:space-y-8">
                                {/* Restaurant Info */}
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <Store className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                        Restaurant
                                    </h2>
                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <p className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{order.restaurantName}</p>
                                        <button
                                            onClick={() => navigate(`/restaurant/${order.restaurant}`)}
                                            className="text-orange-600 text-sm font-semibold hover:underline"
                                        >
                                            View Restaurant
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Breakdown */}
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                        Payment Summary
                                    </h2>
                                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                            <span>Subtotal</span>
                                            <span>₹{order.totalAmount}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                            <span>Delivery Fee</span>
                                            <span>₹{order.deliveryFee || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                            <span>Tax</span>
                                            <span>₹{order.tax || 0}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="flex justify-between text-green-600 text-sm sm:text-base">
                                                <span>Discount</span>
                                                <span>-₹{order.discount}</span>
                                            </div>
                                        )}
                                        <div className="h-px bg-gray-200 my-1.5 sm:my-2"></div>
                                        <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>₹{order.total}</span>
                                        </div>
                                        <div className="pt-1.5 sm:pt-2 text-xs text-center text-gray-400">
                                            Payment Method: {order.paymentMethod?.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-2.5 sm:space-y-3">
                                    {/* Track Order - Active orders */}
                                    {!['Cancelled', 'Delivered', 'OutForDelivery'].includes(order.status) && (
                                        <button
                                            onClick={() => navigate(`/track-order/${order._id}`)}
                                            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-200 text-sm sm:text-base"
                                        >
                                            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Track Order
                                        </button>
                                    )}

                                    {/* Cancel Order */}
                                    {['Preparing', 'Confirmed', 'Pending', 'Accepted'].includes(order.status) && (
                                        <button
                                            onClick={() => {
                                                alert('Please go to the "My Orders" list to cancel this order.');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors text-sm sm:text-base"
                                        >
                                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderDetails;
