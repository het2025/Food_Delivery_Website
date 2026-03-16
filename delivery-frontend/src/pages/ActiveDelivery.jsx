import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../api/axiosInstance';
import Header from '../components/Header';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const ActiveDelivery = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const fetchCurrentOrder = async () => {
    try {
      const response = await ordersAPI.getCurrent();
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching current order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async () => {
    if (!confirm('Confirm that you have picked up the order from the restaurant?')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await ordersAPI.pickup(order._id);
      if (response.data.success) {
        alert('Order picked up! Now heading to customer.');
        await handleStartTransit();
      }
    } catch (error) {
      console.error('Error picking up order:', error);
      alert('Failed to confirm pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartTransit = async () => {
    try {
      const response = await ordersAPI.startTransit(order._id);
      if (response.data.success) {
        fetchCurrentOrder();
      }
    } catch (error) {
      console.error('Error starting transit:', error);
    }
  };

  const handleComplete = async () => {
    if (!otp && order.deliveryOTP) {
      alert('Please enter the delivery OTP');
      return;
    }

    if (!confirm('Confirm that you have delivered the order to the customer?')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await ordersAPI.complete(order._id, otp);
      if (response.data.success) {
        alert(`Order delivered successfully! You earned ₹${response.data.data.earnings}`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error completing delivery:', error);
      alert(error.response?.data?.message || 'Failed to complete delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'accepted':
        return {
          text: 'Head to Restaurant',
          color: 'bg-blue-100 text-blue-800',
          action: 'pickup'
        };
      case 'picked_up':
      case 'in_transit':
        return {
          text: 'Out for Delivery',
          color: 'bg-purple-100 text-purple-800',
          action: 'complete'
        };
      default:
        return {
          text: status,
          color: 'bg-gray-100 text-gray-800',
          action: null
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="px-4 py-4 pb-safe-nav mx-auto max-w-7xl sm:px-6 sm:pt-8 lg:px-8">
          <div className="p-8 text-center bg-white rounded-xl shadow sm:p-12">
            <TruckIcon className="mx-auto mb-4 w-12 h-12 text-gray-400 sm:w-16 sm:h-16" />
            <h3 className="mb-2 text-lg font-semibold text-gray-800 sm:text-xl">No Active Delivery</h3>
            <p className="mb-6 text-sm text-gray-600 sm:text-base">You don't have any active delivery at the moment</p>
            <button
              onClick={() => navigate('/orders/available')}
              className="px-6 py-3 min-h-[48px] text-white rounded-xl transition bg-primary hover:bg-opacity-90 active:scale-95"
            >
              View Available Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="px-4 py-4 pb-safe-nav mx-auto max-w-4xl sm:px-6 sm:pt-8 lg:px-8">
        <div className="p-4 mb-4 bg-white rounded-xl shadow sm:p-6 sm:mb-6">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <h1 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl sm:mb-2">Active Delivery</h1>
              <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="p-4 mb-4 bg-white rounded-xl shadow sm:p-6 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-green-100 rounded-full sm:w-12 sm:h-12">
              <MapPinIcon className="w-5 h-5 text-green-600 sm:w-6 sm:h-6" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Pickup Location</h3>
              <p className="text-xs text-gray-600 sm:text-sm">{order.restaurantName}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{order.restaurantLocation?.address}</p>
        </div>

        {/* Customer Details */}
        <div className="p-4 mb-4 bg-white rounded-xl shadow sm:p-6 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-red-100 rounded-full sm:w-12 sm:h-12">
              <MapPinIcon className="w-5 h-5 text-red-600 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 ml-3 sm:ml-4">
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Delivery Location</h3>
              <p className="text-xs text-gray-600 sm:text-sm">{order.customerName}</p>
            </div>
            <a
              href={`tel:${order.customerPhone}`}
              className="p-2.5 bg-blue-100 rounded-full transition hover:bg-blue-200 active:scale-95"
              aria-label="Call customer"
            >
              <PhoneIcon className="w-5 h-5 text-blue-600" />
            </a>
          </div>
          <p className="text-sm text-gray-700">
            {order.deliveryAddress?.street}, {order.deliveryAddress?.area}, {order.deliveryAddress?.city}
          </p>
        </div>

        {/* Order Details */}
        <div className="p-4 mb-4 bg-white rounded-xl shadow sm:p-6 sm:mb-6">
          <h3 className="mb-3 text-base font-semibold text-gray-800 sm:mb-4 sm:text-lg">Order Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Amount</span>
              <span className="font-semibold text-gray-800">₹{order.orderAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-green-600">₹{order.deliveryFee}</span>
            </div>
            {order.distance && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance</span>
                <span className="font-semibold text-gray-800">{order.distance} km</span>
              </div>
            )}
            <div className="flex justify-between pt-3 text-sm border-t">
              <span className="text-gray-600">Payment</span>
              <span className="font-semibold text-gray-800">
                {order.paymentMethod === 'online' ? 'Paid Online' : 'Cash on Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white rounded-xl shadow sm:p-6">
          {statusInfo.action === 'pickup' && (
            <button
              onClick={handlePickup}
              disabled={actionLoading}
              className="py-3.5 w-full font-semibold text-white bg-green-600 rounded-xl transition hover:bg-green-700 active:scale-95 disabled:opacity-50 sm:py-3"
            >
              {actionLoading ? 'Processing...' : 'Confirm Pickup from Restaurant'}
            </button>
          )}

          {statusInfo.action === 'complete' && (
            <div className="space-y-4">
              {order.deliveryOTP && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Enter Delivery OTP
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    enterKeyHint="done"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="• • • •"
                    maxLength={4}
                    className="px-4 py-3 w-full text-3xl tracking-[0.5em] text-center rounded-xl border-2 border-gray-300 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="flex justify-center items-center py-3.5 w-full font-semibold text-white rounded-xl transition bg-primary hover:bg-opacity-90 active:scale-95 disabled:opacity-50 sm:py-3"
              >
                <CheckCircleIcon className="mr-2 w-6 h-6" />
                {actionLoading ? 'Processing...' : 'Complete Delivery'}
              </button>
            </div>
          )}
        </div>

        {/* Timer */}
        {order.acceptedAt && (
          <div className="mt-4 text-center sm:mt-6">
            <div className="inline-flex items-center text-gray-600">
              <ClockIcon className="mr-2 w-5 h-5" />
              <span className="text-sm">
                Started {new Date(order.acceptedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveDelivery;
