import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Star, Zap } from 'lucide-react'

const SubscriptionPricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      monthlyPrice: 99,
      yearlyPrice: 999,
      features: [
        'Free delivery on orders above ₹299',
        'Access to basic discounts up to 10%',
        'Standard customer support',
        'Order tracking',
        'Basic app features'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      monthlyPrice: 299,
      yearlyPrice: 2999,
      features: [
        'Free delivery on ALL orders',
        'Exclusive premium discounts up to 25%',
        'Priority customer support 24/7',
        'Advanced order tracking with live updates',
        'Early access to new restaurants',
        'Special member-only offers',
        'Premium app themes',
        'Monthly surprise rewards'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      monthlyPrice: 499,
      yearlyPrice: 4999,
      features: [
        'Everything in Premium',
        'Unlimited free delivery',
        'Exclusive restaurant partnerships',
        'Personal food curator',
        'VIP customer support',
        'Custom dietary preferences',
        'Advanced analytics dashboard',
        'Monthly chef consultations'
      ],
      popular: false
    }
  ]

  const handleSelectPlan = (id) => {
    setSelectedPlan(id)
  }

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  }

  const getSavings = (plan) => {
    if (billingCycle === 'yearly') {
      const yearlyDiscount = (plan.monthlyPrice * 12) - plan.yearlyPrice
      return Math.round((yearlyDiscount / (plan.monthlyPrice * 12)) * 100)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 sm:py-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight px-2">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              QuickBites
            </span>{' '}
            Plan
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Unlock exclusive benefits, save more on every order, and enjoy the ultimate food delivery experience
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-8 sm:mb-12">
            <span className={`font-semibold text-sm sm:text-base ${billingCycle === 'monthly' ? 'text-gray-800' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-14 h-7 sm:w-16 sm:h-8 rounded-full transition-colors flex-shrink-0 ${
                billingCycle === 'yearly' ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full top-1 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7 sm:translate-x-9' : 'translate-x-1'
              }`} />
            </button>
            <span className={`font-semibold text-sm sm:text-base ${billingCycle === 'yearly' ? 'text-gray-800' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                Save up to 17%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            const isSelected = selectedPlan === plan.id
            const savings = getSavings(plan)

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative rounded-3xl shadow-xl transition-all duration-300 cursor-pointer bg-white ${
                  isSelected
                    ? 'ring-4 ring-orange-400 shadow-2xl'
                    : 'hover:shadow-2xl'
                } ${plan.popular ? 'border-2 border-orange-400' : 'border border-gray-200'}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  </div>
                )}

                {savings > 0 && (
                  <div className="absolute -top-4 right-3 z-10">
                    <div className="bg-green-500 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      Save {savings}%
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className={`inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-r ${plan.color} text-white mb-3 sm:mb-4`}>
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="text-center">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-800">₹{getPrice(plan)}</span>
                      <span className="text-gray-600 text-sm sm:text-base">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 ${
                      isSelected
                        ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? 'Selected Plan' : 'Choose Plan'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 sm:mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Ready to upgrade your food experience?</h3>
            <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
              Join thousands of food lovers who save more and eat better with QuickBites Premium
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Free Trial
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-200">
                Learn More
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">
              30-day free trial • Cancel anytime • No commitment
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SubscriptionPricing
