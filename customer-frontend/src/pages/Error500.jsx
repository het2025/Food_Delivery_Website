import { motion } from 'framer-motion'
import { RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const Error500 = () => {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center w-full max-w-sm sm:max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-7xl sm:text-8xl font-bold text-red-500 mb-4 leading-tight"
        >
          500
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Server Error
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mb-8 px-2">
          Something went wrong on our end. Please try again later.
        </p>

        <div className="flex flex-col gap-3 w-full sm:flex-row sm:gap-4 sm:justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            Try Again
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Error500
