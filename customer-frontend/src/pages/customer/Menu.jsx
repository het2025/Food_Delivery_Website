import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, Loader, Heart } from 'lucide-react';
import { restaurantService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReviewList from '../../components/ReviewList';
import ReviewForm from '../../components/ReviewForm';

const Menu = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user, toggleFavoriteDish } = useUser();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodFilter, setFoodFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'reviews'
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadRestaurantDetails();
  }, [vendorId]);

  const loadRestaurantDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantService.getRestaurantById(vendorId);

      if (response.success) {
        setRestaurant(response.data);
        setMenu(response.data.menu || []);
      } else {
        setError('Restaurant not found');
      }
    } catch (error) {
      setError('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMenu = () => {
    let filteredMenu = menu;

    // Only filter by category if not 'All'
    if (selectedCategory !== 'All') {
      filteredMenu = menu.filter(category => category.category === selectedCategory);
    }

    // Apply food type filter
    if (foodFilter === 'veg') {
      filteredMenu = filteredMenu.map(category => ({
        ...category,
        items: category.items.filter(item => item.isVeg)
      })).filter(category => category.items.length > 0);
    } else if (foodFilter === 'non-veg') {
      filteredMenu = filteredMenu.map(category => ({
        ...category,
        items: category.items.filter(item => !item.isVeg)
      })).filter(category => category.items.length > 0);
    }

    return filteredMenu;
  };

  const handleAddToCart = (item, categoryName) => {
    const cartItem = {
      _id: `${restaurant._id}-${item.name}`,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      name: item.name,
      price: item.price,
      image: item.url || restaurant.image,
      category: categoryName,
      isVeg: item.isVeg,
      description: item.description
    };
    addToCart(cartItem);
  };

  const getItemQuantity = (item) => {
    const cartItem = cartItems.find(cartItem =>
      cartItem.name === item.name && cartItem.restaurantId === restaurant._id
    );
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 sm:text-2xl">Restaurant Not Found</h2>
          <p className="mb-6 text-sm text-gray-500 sm:text-base">{error || 'The restaurant you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 min-h-[48px]">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const categories = ['All', ...menu.map(category => category.category)];
  const filteredMenu = getFilteredMenu();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container px-3 py-4 pt-16 mx-auto sm:px-4 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4 sm:mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Restaurant Header */}
        <div className="p-4 mb-5 bg-white shadow-sm rounded-2xl sm:p-6 sm:mb-8">
          <div className="flex flex-col gap-4 md:flex-row sm:gap-6">
            <img
              src={restaurant.image || '/placeholder-restaurant.jpg'}
              alt={restaurant.name}
              className="object-cover w-full md:w-44 h-44 sm:h-48 md:h-44 rounded-xl"
              onError={(e) => {
                e.target.src = '/placeholder-restaurant.jpg';
              }}
            />

            <div className="flex-1 min-w-0">
              <h1 className="mb-2 text-xl font-bold leading-snug text-gray-800 sm:text-3xl">{restaurant.name}</h1>
              <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">{restaurant.description}</p>

              <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600 sm:gap-4 sm:text-sm sm:mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span>({restaurant.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{restaurant.location.area}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {restaurant.cuisine.map((cuisine, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200 sm:mb-6">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors relative min-h-[48px] ${activeTab === 'menu'
              ? 'text-orange-600'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Menu
            {activeTab === 'menu' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors relative min-h-[48px] ${activeTab === 'reviews'
              ? 'text-orange-600'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Reviews
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-t-full" />
            )}
          </button>
        </div>

        {activeTab === 'reviews' ? (
          <div>
            <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:justify-between sm:items-center sm:mb-6">
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Customer Reviews</h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base min-h-[44px] self-start sm:self-auto"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <ReviewForm
                restaurantId={restaurant.restaurantId}
                onReviewSubmitted={() => {
                  setShowReviewForm(false);
                  // Trigger refresh of reviews list (you might need to lift state or use a ref/context)
                  // For now, we'll just close the form. Ideally ReviewList should refetch.
                  // A simple way is to remount ReviewList by changing a key, or passing a refresh trigger.
                  // Let's use a key approach in the render below.
                  window.location.reload(); // Simple refresh for now
                }}
              />
            )}

            <ReviewList restaurantId={restaurant.restaurantId} />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4 sm:gap-3 sm:mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-[36px] ${selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Food Type Filter */}
            <div className="flex flex-wrap gap-2 mb-6 sm:gap-3 sm:mb-8">
              <button
                onClick={() => setFoodFilter('veg')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[40px] ${foodFilter === 'veg'
                  ? 'bg-green-100 border-2 border-green-500 text-green-700'
                  : 'bg-gray-100 border-2 border-transparent text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <img
                  src="https://res.cloudinary.com/dovlhkyrr/image/upload/v1758009402/veg_g9mrsg.png"
                  alt="Veg"
                  className="w-6 h-7 sm:w-8 sm:h-10"
                />
                Veg Food
              </button>

              <button
                onClick={() => setFoodFilter('non-veg')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[40px] ${foodFilter === 'non-veg'
                  ? 'bg-red-100 border-2 border-red-500 text-red-700'
                  : 'bg-gray-100 border-2 border-transparent text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <img
                  src="https://res.cloudinary.com/dovlhkyrr/image/upload/v1758009402/non-veg_ucnnbj.png"
                  alt="Non-Veg"
                  className="w-6 h-7 sm:w-8 sm:h-10"
                />
                Non-Veg Food
              </button>

              {(foodFilter === 'veg' || foodFilter === 'non-veg') && (
                <button
                  onClick={() => setFoodFilter('all')}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors min-h-[40px]"
                >
                  Show All
                </button>
              )}
            </div>

            {/* Menu Items */}
            {filteredMenu.length === 0 ? (
              <div className="px-4 py-10 text-center sm:py-12">
                <p className="text-sm text-gray-500 sm:text-base">No items found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {filteredMenu.map((category) => (
                  <div key={category.category}>
                    <h2 className="pb-2 mb-4 text-xl font-bold text-gray-800 border-b border-gray-200 sm:text-2xl sm:mb-6">
                      {category.category}
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {category.items.map((item) => {
                        const isFavorite = user?.favoriteDishes?.some(
                          fav => fav.dishId === item._id && fav.restaurantId === restaurant.restaurantId
                        );

                        return (
                          <div key={item.name} className="relative p-4 transition-shadow bg-white shadow-sm sm:p-6 rounded-xl hover:shadow-md group">
                            {/* Favorite Button */}
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!user) {
                                  navigate('/login');
                                  return;
                                }
                                const result = await toggleFavoriteDish(item, restaurant.restaurantId, restaurant.name);
                                if (result.success) {
                                  // Optional: Show toast
                                }
                              }}
                              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
                              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Heart
                                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
                              />
                            </button>

                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2 sm:gap-3">
                                  {/* Updated Veg/Non-Veg Image */}
                                  <img
                                    src={
                                      item.isVeg
                                        ? "https://res.cloudinary.com/dovlhkyrr/image/upload/v1758012359/veg_food_q3f5f0.png"
                                        : "https://res.cloudinary.com/dovlhkyrr/image/upload/v1758012359/non-veg_food_czrcmx.png"
                                    }
                                    alt={item.isVeg ? "Veg" : "Non-Veg"}
                                    className="flex-shrink-0 w-4 h-4 mt-1"
                                  />

                                  <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                                    <h3 className="mb-1 text-base font-semibold leading-snug text-gray-800 sm:text-lg">
                                      {item.name}
                                      {item.isPopular && (
                                        <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                                          Popular
                                        </span>
                                      )}
                                    </h3>
                                    <p className="mb-2 text-xs leading-relaxed text-gray-600 sm:text-sm sm:mb-3">{item.description}</p>
                                    <p className="text-lg font-bold text-orange-600 sm:text-xl">₹{item.price}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 mt-3 sm:mt-4">
                                  {getItemQuantity(item) > 0 ? (
                                    <div className="flex items-center overflow-hidden text-white bg-orange-500 rounded-lg">
                                      <button className="hover:bg-orange-600 min-w-[44px] min-h-[44px] flex items-center justify-center">
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="px-2 font-semibold">{getItemQuantity(item)}</span>
                                      <button
                                        onClick={() => handleAddToCart(item, category.category)}
                                        className="hover:bg-orange-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleAddToCart(item, category.category)}
                                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 min-h-[44px] rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add to Cart
                                    </button>
                                  )}
                                </div>
                              </div>

                              {item.url && (
                                <div className="flex-shrink-0 w-full sm:w-28 sm:h-28 md:w-32 md:h-32">
                                  <img
                                    src={item.url}
                                    alt={item.name}
                                    className="object-cover w-full rounded-lg h-36 sm:h-full"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
