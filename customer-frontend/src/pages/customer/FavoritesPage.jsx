import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const { user, toggleFavoriteDish, loading } = useUser();
    const { addToCart } = useCart();
    const favoriteDishes = user?.favoriteDishes || [];

    const handleAddToCart = (dish) => {
        const cartItem = {
            _id: `${dish.restaurantId}-${dish.dishName}`,
            restaurantId: dish.restaurantId,
            restaurantName: dish.restaurantName,
            name: dish.dishName,
            price: dish.dishPrice,
            image: dish.dishImage,
            isVeg: true,
        };
        addToCart(cartItem);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-8 h-8 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main
                className="flex-grow w-full px-3 pt-20 pb-8 mx-auto sm:px-5 md:px-6 lg:px-8 max-w-7xl"
                style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
            >
                {/* Page Header */}
                <div className="flex items-center gap-2 mb-5 sm:mb-7">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0 touch-manipulation"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        Favorite Dishes
                    </h1>
                </div>

                {favoriteDishes.length === 0 ? (
                    /* Empty State */
                    <div className="py-10 sm:py-20 text-center bg-white border border-orange-100 shadow-sm rounded-2xl px-4">
                        <div className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-5 rounded-full bg-orange-50">
                            <Heart className="w-7 h-7 sm:w-10 sm:h-10 text-orange-400" />
                        </div>
                        <h2 className="mb-2 text-lg sm:text-2xl font-bold text-gray-800">No favorites yet</h2>
                        <p className="max-w-xs mx-auto mb-5 sm:mb-8 text-sm sm:text-base text-gray-500">
                            Explore menus and tap the heart icon to save your favorite dishes here!
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="inline-block px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors touch-manipulation"
                        >
                            Explore Restaurants
                        </button>
                    </div>
                ) : (
                    /* Favorites Grid — 1 col mobile, 2 cols tablet, 3 cols desktop */
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {favoriteDishes.map((dish) => (
                            <div
                                key={`${dish.dishId}-${dish.restaurantId}`}
                                className="p-3 sm:p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md group"
                            >
                                <div className="flex gap-3 items-stretch">
                                    {/* Dish Image */}
                                    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-gray-100 rounded-xl">
                                        <img
                                            src={dish.dishImage || '/placeholder-food.jpg'}
                                            alt={dish.dishName}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                                        />
                                    </div>

                                    {/* Dish Info */}
                                    <div className="flex flex-col justify-between flex-1 min-w-0">
                                        <div>
                                            <div className="flex items-start justify-between gap-1">
                                                <h3
                                                    className="font-bold text-sm sm:text-base text-gray-800 line-clamp-1 flex-1 min-w-0 leading-snug"
                                                    title={dish.dishName}
                                                >
                                                    {dish.dishName}
                                                </h3>
                                                {/* Remove from Favourites */}
                                                <button
                                                    onClick={() => toggleFavoriteDish({ _id: dish.dishId }, dish.restaurantId)}
                                                    className="flex items-center justify-center w-8 h-8 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0 touch-manipulation"
                                                    title="Remove from favorites"
                                                >
                                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                                </button>
                                            </div>
                                            <p
                                                onClick={() => navigate(`/menu/${dish.restaurantId}`)}
                                                className="text-xs sm:text-sm text-gray-500 hover:text-orange-500 cursor-pointer line-clamp-1 mt-0.5 transition-colors"
                                            >
                                                from {dish.restaurantName}
                                            </p>
                                        </div>

                                        {/* Price + Add Button */}
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm sm:text-base font-bold text-gray-900">
                                                ₹{dish.dishPrice}
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(dish)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-orange-100 border border-orange-100 transition-colors touch-manipulation min-h-[34px]"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default FavoritesPage;
