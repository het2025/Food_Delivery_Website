import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    cuisine: 'all',
    rating: 0,
    deliveryTime: 60,
    sortBy: 'relevance'
  })

  // Sample search results
  const sampleResults = [
    {
      id: 1,
      name: 'Pizza Palace',
      image: '/pizza.jpg',
      cuisine: 'Italian',
      rating: 4.5,
      deliveryTime: '25-30',
      description: 'Authentic Italian pizzas with fresh ingredients'
    },
    {
      id: 2,
      name: 'Biryani House',
      image: '/biryani.webp',
      cuisine: 'Indian',
      rating: 4.7,
      deliveryTime: '30-35',
      description: 'Traditional biryani and Indian curries'
    },
    {
      id: 3,
      name: 'Chinese Delight',
      image: '/chinese.jpg.webp',
      cuisine: 'Chinese',
      rating: 4.3,
      deliveryTime: '20-25',
      description: 'Delicious Chinese dishes and noodles'
    }
  ]

  useEffect(() => {
    if (searchTerm) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const filtered = sampleResults.filter(restaurant =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setResults(filtered)
        setLoading(false)
      }, 500)
    } else {
      setResults([])
    }
  }, [searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    // Trigger search with current searchTerm
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-16">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">

          {/* Search Header */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2 sm:w-6 sm:h-6" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                />
              </div>
            </form>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 p-4 mb-6 bg-white shadow-sm rounded-xl sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 sm:w-5 sm:h-5" />
              <span className="text-sm font-semibold text-gray-700 sm:text-base">Filters:</span>
            </div>

            <select
              value={filters.cuisine}
              onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="american">American</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="delivery-time">Fastest Delivery</option>
              <option value="price">Price: Low to High</option>
            </select>
          </div>

          {/* Search Results */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-b-2 border-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {searchTerm && (
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                      {results.length} results for "{searchTerm}"
                    </h2>
                  </div>
                )}

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {results.map((restaurant, index) => (
                      <motion.div
                        key={restaurant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1"
                      >
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="object-cover w-full h-44 sm:h-48"
                        />

                        <div className="p-4 sm:p-6">
                          <h3 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl sm:mb-2">{restaurant.name}</h3>
                          <p className="mb-3 text-sm text-gray-600 sm:text-base sm:mb-4">{restaurant.description}</p>

                          <div className="flex items-center justify-between mb-3 text-sm text-gray-600 sm:mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{restaurant.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{restaurant.deliveryTime} mins</span>
                            </div>
                            <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">
                              {restaurant.cuisine}
                            </span>
                          </div>

                          <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 sm:py-3 rounded-lg text-sm font-semibold sm:text-base hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                            View Menu
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="py-12 text-center sm:py-16">
                    <div className="mb-4 text-5xl sm:text-6xl">🔍</div>
                    <h3 className="mb-2 text-lg font-bold text-gray-600 sm:text-xl">No results found</h3>
                    <p className="px-4 mb-5 text-sm text-gray-500 sm:text-base sm:mb-6">
                      Try searching with different keywords or browse our popular restaurants
                    </p>
                    <button className="bg-orange-500 text-white px-6 py-2.5 sm:py-3 rounded-lg text-sm font-semibold sm:text-base hover:bg-orange-600 transition-colors">
                      Browse Restaurants
                    </button>
                  </div>
                ) : (
                  <div className="py-12 text-center sm:py-16">
                    <div className="mb-4 text-5xl sm:text-6xl">🍽️</div>
                    <h3 className="mb-2 text-lg font-bold text-gray-600 sm:text-xl">Start your food journey</h3>
                    <p className="px-4 text-sm text-gray-500 sm:text-base">Search for your favorite restaurants, cuisines, or dishes</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SearchPage
