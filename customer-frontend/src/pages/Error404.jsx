import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Error404 = () => {
  const navigate = useNavigate()

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
          className="text-7xl sm:text-8xl font-bold text-orange-500 mb-4 leading-tight"
        >
          404
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mb-8 px-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-3 w-full sm:flex-row sm:gap-4 sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Back
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

export default Error404
