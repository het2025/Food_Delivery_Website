import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
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
        // Construct cart item from stored dish data
        const cartItem = {
            _id: `${dish.restaurantId}-${dish.dishName}`,
            restaurantId: dish.restaurantId,
            restaurantName: dish.restaurantName,
            name: dish.dishName,
            price: dish.dishPrice,
            image: dish.dishImage,
            isVeg: true, // Defaulting, as we might not store this. Ideally we should.
            // Note: If 'isVeg' is critical, we should add it to the favoriteDishes schema.
            // For now, let's assume valid data or fetch fresh.
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

            <main className="flex-grow w-full px-4 pt-24 pb-12 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Favorite Dishes</h1>
                </div>

                {favoriteDishes.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-orange-100 shadow-sm rounded-2xl">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-orange-50">
                            <Heart className="w-10 h-10 text-orange-400" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-800">No favorites yet</h2>
                        <p className="max-w-md mx-auto mb-8 text-gray-500">
                            Start exploring menus and tap the heart icon to save your favorite dishes here!
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-8 py-3 font-semibold text-white transition-shadow bg-orange-500 shadow-lg rounded-xl hover:bg-orange-600 shadow-orange-200"
                        >
                            Explore Restaurants
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {favoriteDishes.map((dish) => (
                            <div
                                key={`${dish.dishId}-${dish.restaurantId}`}
                                className="p-5 transition-all bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md group"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 rounded-xl">
                                        <img
                                            src={dish.dishImage || '/placeholder-food.jpg'}
                                            alt={dish.dishName}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between flex-1">
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-bold text-gray-800 line-clamp-1" title={dish.dishName}>
                                                    {dish.dishName}
                                                </h3>
                                                <button
                                                    onClick={() => toggleFavoriteDish({ _id: dish.dishId }, dish.restaurantId)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove from favorites"
                                                >
                                                    <Heart className="w-5 h-5 fill-current" />
                                                </button>
                                            </div>
                                            <p
                                                onClick={() => navigate(`/menu/${dish.restaurantId}`)}
                                                className="text-sm text-gray-500 transition-colors cursor-pointer hover:text-orange-500 line-clamp-1"
                                            >
                                                from {dish.restaurantName}
                                            </p>
                                        </div>
                                        <div className="flex items-end justify-between mt-2">
                                            <span className="text-lg font-bold text-gray-900">₹{dish.dishPrice}</span>
                                            <button
                                                onClick={() => handleAddToCart(dish)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 border border-orange-100 transition-colors"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
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
