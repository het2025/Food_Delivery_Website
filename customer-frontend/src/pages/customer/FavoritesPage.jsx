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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Favorite Dishes</h1>
                </div>

                {favoriteDishes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-orange-100">
                        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Start exploring menus and tap the heart icon to save your favorite dishes here!
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-shadow shadow-lg shadow-orange-200"
                        >
                            Explore Restaurants
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteDishes.map((dish) => (
                            <div
                                key={`${dish.dishId}-${dish.restaurantId}`}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                            >
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={dish.dishImage || '/placeholder-food.jpg'}
                                            alt={dish.dishName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { e.target.src = '/placeholder-food.jpg'; }}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
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
                                                className="text-sm text-gray-500 cursor-pointer hover:text-orange-500 transition-colors line-clamp-1"
                                            >
                                                from {dish.restaurantName}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
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
