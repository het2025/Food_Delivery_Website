import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

// IMPORTANT: adjust this import to point to your real API/service file
import { restaurantService } from '../services/api'; // <-- change path if necessary

// Color palette for new dark theme
const primaryOrange = '#ff8d86';
const secondaryOrange = '#fd761a';
const tertiaryOrange = '#ffa765';
const darkBg = '#0f1930';
const surfaceContainer = '#141f38';
const surfaceContainerHigh = '#1a2540';
const onSurface = '#dee5ff';
const onSurfaceVariant = '#a3aac4';
const outlineVariant = '#40485d';

// Sample data
const cuisines = [
  { emoji: '🍕', name: 'Italian' },
  { emoji: '🍣', name: 'Japanese' },
  { emoji: '🍔', name: 'Burgers' },
  { emoji: '🌮', name: 'Mexican' },
  { emoji: '🍜', name: 'Thai' },
  { emoji: '🥗', name: 'Healthy' },
  { emoji: '🍦', name: 'Desserts' },
  { emoji: '🥟', name: 'Dim Sum' },
];

const testimonials = [
  {
    quote: "The quality of restaurants on QuickBite is unmatched. It's my go-to for planning high-end weekend dinners at home.",
    name: "Julian S.",
    role: "Tech Entrepreneur",
    initials: "JS"
  },
  {
    quote: "Insanely fast delivery and the app interface is beautiful. Finally a food app that matches my aesthetic standards.",
    name: "Aria M.",
    role: "Creative Director",
    initials: "AM"
  },
  {
    quote: "Customer service is actually helpful. Had a small issue once and it was resolved in minutes. Highly recommend!",
    name: "David B.",
    role: "Restaurant Critic",
    initials: "DB"
  }
];

export default function Homepage() {
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // New state for dynamic restaurants
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for scroll navigation
  const heroRef = useRef(null);
  const offersRef = useRef(null);
  const restaurantsRef = useRef(null);
  const appRef = useRef(null);

  // State for copy code button
  const [isCopied, setIsCopied] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Smooth scroll to section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('QUICKSTART50');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Fetch restaurants from backend on mount
  useEffect(() => {
    let mounted = true;
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await restaurantService.getRestaurants
          ? await restaurantService.getRestaurants({ limit: 8, page: 1 })
          : null;

        if (mounted) {
          if (response) {
            const data =
              response.success && response.data
                ? response.data
                : response.data
                ? response.data
                : Array.isArray(response)
                ? response
                : null;

            if (data && Array.isArray(data)) {
              setRestaurants(data);
            } else {
              setRestaurants([]);
              setError('Unexpected response shape from API.');
            }
          } else {
            setRestaurants([]);
            setError('restaurantService.getRestaurants not available.');
          }
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        if (mounted) {
          setError('Failed to load restaurants.');
          setRestaurants([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRestaurants();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      backgroundColor: darkBg,
      color: onSurface,
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .ignite-gradient {
          background: linear-gradient(135deg, #ff8d86 0%, #fd761a 100%);
        }

        .ignite-text {
          background: linear-gradient(135deg, #ff8d86 0%, #fd761a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Top Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: 'rgba(15, 25, 48, 0.6)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 48px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <img
              src="/quickbite_logo.svg"
              alt="QuickBite Logo"
              style={{ width: '35px', height: '35px', objectFit: 'contain' }}
            />
            <span>
              <span className="ignite-text">Quick</span>
              <span style={{ color: onSurface }}>Bite</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); scrollToSection(heroRef); }}
              style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: secondaryOrange,
              borderBottom: `2px solid ${secondaryOrange}`,
              paddingBottom: '4px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}>Explore</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); scrollToSection(offersRef); }}
              style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: onSurfaceVariant,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}>Offers</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); scrollToSection(restaurantsRef); }}
              style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: onSurfaceVariant,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}>Restaurants</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); scrollToSection(appRef); }}
              style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: onSurfaceVariant,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}>App</a>
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onClick={handleLoginClick}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: onSurfaceVariant,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Login
            </button>
            <button
              onClick={handleLoginClick}
              className="ignite-gradient"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 'bold',
                padding: '10px 24px',
                borderRadius: '9999px',
                border: 'none',
                color: '#000',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                color: onSurface,
                display: 'none'
              }}
              className="mobile-menu-btn"
            >
              {isMobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1001,
            background: 'rgba(0,0,0,0.6)',
          }}
          onClick={() => setIsMobileNavOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '260px',
              height: '100%',
              background: surfaceContainer,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontWeight: 700, fontSize: '18px', color: onSurface }}>Menu</span>
              <button onClick={() => setIsMobileNavOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: onSurface }}>✕</button>
            </div>
            {[
              { label: 'Explore', ref: heroRef },
              { label: 'Offers', ref: offersRef },
              { label: 'Restaurants', ref: restaurantsRef },
              { label: 'App', ref: appRef }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setIsMobileNavOpen(false); scrollToSection(item.ref); }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '12px 8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: onSurface,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                {item.label}
              </button>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: `1px solid ${outlineVariant}` }}>
              <button
                onClick={() => { setIsMobileNavOpen(false); handleLoginClick(); }}
                className="ignite-gradient"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  color: '#000',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ paddingTop: '96px', overflowX: 'hidden' }}>
        {/* Hero Section */}
        <section ref={heroRef} style={{
          position: 'relative',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          padding: '48px',
          maxWidth: '1400px',
          margin: '0 auto',
          background: 'radial-gradient(circle at center, rgba(253, 118, 26, 0.15) 0%, transparent 70%)'
        }}>
          <div style={{ zIndex: 10, maxWidth: '600px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 16px',
              borderRadius: '9999px',
              backgroundColor: surfaceContainerHigh,
              color: primaryOrange,
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '0.2em',
              marginBottom: '24px',
              border: `1px solid ${outlineVariant}`,
              textTransform: 'uppercase'
            }}>
              Premium Food Delivery
            </span>

            <h1 style={{
              fontSize: '60px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              lineHeight: 0.9,
              marginBottom: '32px'
            }}>
              Cravings <br/>
              <span className="ignite-text">Delivered Fast</span>
            </h1>

            <p style={{
              color: onSurfaceVariant,
              fontSize: '18px',
              maxWidth: '500px',
              marginBottom: '48px',
              lineHeight: 1.6
            }}>
              Experience the pinnacle of culinary convenience. Midnight munchies or executive lunch—the city's finest flavors are a tap away.
            </p>

            <div style={{
              position: 'relative',
              maxWidth: '600px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: surfaceContainer,
                padding: '8px',
                borderRadius: '9999px',
                border: `1px solid ${outlineVariant}`,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 24px' }}>
                  <span className="material-symbols-outlined" style={{ color: primaryOrange, marginRight: '12px' }}>
                    location_on
                  </span>
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: onSurface,
                      width: '100%',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your delivery address..."
                    type="text"
                  />
                </div>
                <button
                  className="ignite-gradient"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 'bold',
                    padding: '16px 40px',
                    borderRadius: '9999px',
                    border: 'none',
                    color: '#000',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Find Food
                </button>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            right: '-80px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '500px',
            height: '500px',
            display: 'none'
          }} className="hero-image">
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #ff8d86 0%, #fd761a 100%)',
                borderRadius: '50%',
                filter: 'blur(120px)',
                opacity: 0.2
              }}></div>
              <img
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: `8px solid ${surfaceContainer}`,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6YsOLPBQKQ64mNG6Y001vIAsRGm84ZQVr0ImoGa3B7askZTTzv7G0R4b6nfH5JTHfEDODCyyjd_2ZBRwWBit2D9WUQiCTsBglCoxHSJ6Kbl5xYlcjeB_JVXFqjpBg67T8iDiJyMK8xR15mc8SpMEKhlxJY0G81Gkzoj8ubcGU5szilLNhPb9Nm-M4kShaOoqKs0gqJHgeRkMCFUoAKbYKOCzs4HkBpxvtyObK6cXuhk5N_zPBrM_uoQnTI6QsdHrS70kEGv0kqjAi"
                alt="Gourmet food"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ padding: '48px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px'
          }}>
            {[
              { value: '500+', label: 'Restaurants' },
              { value: '20k+', label: 'Daily Orders' },
              { value: '15m', label: 'Avg. Delivery' },
              { value: '4.9', label: 'User Rating' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                backgroundColor: surfaceContainer,
                border: `1px solid ${outlineVariant}`,
                padding: '32px',
                borderRadius: '24px',
                textAlign: 'center',
                transition: 'border-color 0.3s',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  fontSize: '36px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  color: tertiaryOrange,
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: onSurfaceVariant,
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cuisines Horizontal Scroll */}
        <section style={{ padding: '48px 0', overflow: 'hidden' }}>
          <div style={{ padding: '0 48px', maxWidth: '1400px', margin: '0 auto 32px' }}>
            <h2 style={{
              fontSize: '30px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 'bold'
            }}>
              Cuisines for <span style={{ color: primaryOrange }}>Every Mood</span>
            </h2>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            padding: '0 48px 16px',
            overflowX: 'auto',
            maxWidth: '1400px',
            margin: '0 auto'
          }} className="no-scrollbar">
            {cuisines.map((cuisine, idx) => (
              <div key={idx} style={{
                flexShrink: 0,
                backgroundColor: surfaceContainerHigh,
                padding: '16px 32px',
                borderRadius: '9999px',
                border: `1px solid ${outlineVariant}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <span style={{ fontSize: '24px' }}>{cuisine.emoji}</span>
                <span style={{ fontWeight: 500 }}>{cuisine.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Section (Staff Picks) - Dynamic Restaurants */}
        <section ref={restaurantsRef} style={{
          padding: '96px 48px',
          maxWidth: '1400px',
          margin: '0 auto',
          backgroundColor: surfaceContainer,
          borderRadius: '48px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '64px'
          }}>
            <div>
              <h2 style={{
                fontSize: '36px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                Restaurants
              </h2>
              <p style={{ color: onSurfaceVariant }}>
                Hand-picked selections from the local culinary masters.
              </p>
            </div>
            <button
              onClick={() => navigate('/restaurants')}
              style={{
                color: primaryOrange,
                fontWeight: 'bold',
                borderBottom: `2px solid ${primaryOrange}`,
                paddingBottom: '4px',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${primaryOrange}`,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
            >
              View All
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
              gap: '16px',
              flexDirection: 'column'
            }}>
              <CircularProgress style={{ color: primaryOrange }} />
              <p style={{ color: onSurfaceVariant, fontSize: '18px' }}>Loading restaurants...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: 'rgba(255, 115, 81, 0.1)',
              borderRadius: '16px',
              marginBottom: '32px'
            }}>
              <p style={{ color: primaryOrange, fontSize: '16px', marginBottom: '16px' }}>{error}</p>
            </div>
          )}

          {/* Restaurant Cards Grid */}
          {!loading && restaurants.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px'
            }}>
              {restaurants.map((restaurant, idx) => {
                const id = restaurant._id || restaurant.id || idx;
                const name = restaurant.name || 'Restaurant';
                const image = restaurant.image || 'https://via.placeholder.com/400x300?text=Restaurant';
                const cuisines = Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : (restaurant.cuisine || 'Multi-Cuisine');
                const priceRange = restaurant.priceRange || restaurant.price || '₹₹';
                const rating = restaurant.rating || 4.5;
                const deliveryTime = restaurant.deliveryTime || '30-45 min';
                const minOrder = restaurant.minOrder || 'Min $15';

                return (
                  <div
                    key={id}
                    onClick={() => navigate(`/menu/${id}`)}
                    style={{
                      position: 'relative',
                      backgroundColor: surfaceContainer,
                      borderRadius: '32px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: '256px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        zIndex: 1
                      }}></div>
                      <img
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.7s ease'
                        }}
                        src={image}
                        alt={name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Restaurant'; }}
                      />
                    </div>
                    <div style={{ padding: '32px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            marginBottom: '4px'
                          }}>
                            {name}
                          </h3>
                          <p style={{ color: onSurfaceVariant, fontSize: '14px' }}>{cuisines}</p>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: surfaceContainerHigh,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '14px'
                        }}>
                          <StarIcon style={{ color: tertiaryOrange, fontSize: '18px' }} />
                          <span style={{ fontWeight: 'bold' }}>{rating}</span>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        fontSize: '14px',
                        color: onSurfaceVariant
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>schedule</span>
                          {deliveryTime}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>restaurant</span>
                          {minOrder}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Restaurants Found */}
          {!loading && !error && restaurants.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px'
            }}>
              <p style={{
                color: onSurfaceVariant,
                fontSize: '18px'
              }}>
                No restaurants found. Please add restaurants to your database.
              </p>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section style={{ padding: '128px 48px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '96px' }}>
            <h2 style={{
              fontSize: '48px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              marginBottom: '24px'
            }}>
              Your Journey to <span className="ignite-text">Great Taste</span>
            </h2>
            <p style={{ color: onSurfaceVariant, fontSize: '18px' }}>
              Simplified for the modern connoisseur.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px'
          }}>
            {[
              { icon: 'search', title: 'Select Cravings', desc: 'Browse through thousands of local menus and discover hidden culinary gems in your city.' },
              { icon: 'shopping_bag', title: 'Instant Order', desc: 'Customize your dish to perfection and pay securely with your preferred digital wallet.' },
              { icon: 'moped', title: 'Doorstep Bliss', desc: 'Track your delivery in real-time as our logistics network brings your meal fresh to your door.' }
            ].map((step, idx) => (
              <div key={idx} style={{
                backgroundColor: surfaceContainer,
                padding: '48px',
                borderRadius: '40px',
                border: `1px solid ${outlineVariant}`,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background-color 0.3s'
              }}>
                <div className="ignite-gradient" style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px',
                  boxShadow: '0 0 30px rgba(253, 118, 26, 0.3)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#000' }}>
                    {step.icon}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  marginBottom: '16px'
                }}>
                  {step.title}
                </h3>
                <p style={{ color: onSurfaceVariant, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Offer */}
        <section ref={offersRef} style={{ padding: '48px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(to right, #f97316, #ef4444, #ec4899)',
            borderRadius: '48px',
            padding: '64px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px', color: 'white' }}>
              <h2 style={{
                fontSize: '48px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                marginBottom: '24px',
                lineHeight: 1.2
              }}>
                Join the Elite <br/>Get 50% Off First Order
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '18px',
                marginBottom: '32px'
              }}>
                Elevate your dining experience today. Limited time invitation for new QuickBite members.
              </p>
              <div
                onClick={handleCopyCode}
                style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '9999px',
                padding: '8px',
                paddingRight: '32px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  backgroundColor: '#1f2937',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 32px',
                  borderRadius: '9999px',
                  letterSpacing: '0.1em',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  marginRight: '24px'
                }}>
                  QUICKSTART50
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px' }}>
                    {isCopied ? 'Copied!' : 'Copy Code'}
                  </span>
                  {isCopied && (
                    <span style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '128px 48px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px'
          }}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} style={{
                backgroundColor: surfaceContainer,
                padding: '48px',
                borderRadius: '40px',
                position: 'relative'
              }}>
                <span className="material-symbols-outlined" style={{
                  color: primaryOrange,
                  fontSize: '64px',
                  position: 'absolute',
                  top: '-16px',
                  left: '-16px',
                  opacity: 0.5
                }}>
                  format_quote
                </span>
                <p style={{
                  fontSize: '18px',
                  fontStyle: 'italic',
                  marginBottom: '40px',
                  lineHeight: 1.6,
                  color: onSurface
                }}>
                  "{testimonial.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="ignite-gradient" style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#000'
                  }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {testimonial.name}
                    </div>
                    <div style={{ color: onSurfaceVariant, fontSize: '14px' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* App Section */}
        <section ref={appRef} style={{
          padding: '96px 48px',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '96px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, textAlign: 'center', minWidth: '300px' }}>
            <h2 style={{
              fontSize: '48px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              marginBottom: '32px'
            }}>
              Cuisine in your <span className="ignite-text">Pocket</span>
            </h2>
            <p style={{
              color: onSurfaceVariant,
              fontSize: '18px',
              marginBottom: '48px',
              lineHeight: 1.6
            }}>
              Download the QuickBite app for exclusive mobile-only deals, live tracking, and curated dining lists based on your taste profile.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <button style={{
                backgroundColor: '#1f2937',
                border: `1px solid ${outlineVariant}`,
                padding: '16px 32px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.3s'
              }}>
                <img
                  src="/appstore.svg"
                  alt="App Store"
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: onSurfaceVariant
                  }}>
                    Download on the
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1, color: onSurface }}>
                    App Store
                  </div>
                </div>
              </button>
              <button style={{
                backgroundColor: '#1f2937',
                border: `1px solid ${outlineVariant}`,
                padding: '16px 32px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.3s'
              }}>
                <img
                  src="/playstore.svg"
                  alt="Google Play"
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: onSurfaceVariant
                  }}>
                    Get it on
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1, color: onSurface }}>
                    Google Play
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '300px' }}>
            <div style={{
              width: '300px',
              height: '600px',
              backgroundColor: '#0a0e1a',
              borderRadius: '48px',
              border: `8px solid ${outlineVariant}`,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  width: '96px',
                  height: '20px',
                  backgroundColor: outlineVariant,
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px'
                }}></div>
              </div>
              <div style={{ padding: '48px 16px 16px' }}>
                <div style={{
                  height: '128px',
                  borderRadius: '16px',
                  background: 'linear-gradient(to bottom right, #f97316, #ef4444)',
                  padding: '16px',
                  marginBottom: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Special Deal
                  </div>
                  <div style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    lineHeight: 1.2
                  }}>
                    30% OFF <br/>Your Lunch
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${outlineVariant}`,
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
        color: '#fff',
        textAlign: 'center',
        padding: '80px 48px 32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '48px',
          maxWidth: '1200px',
          margin: '0 auto 80px',
          textAlign: 'left'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '1px',
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              <img
                src="/quickbite_logo.svg"
                alt="QuickBite Logo"
                style={{ width: '35px', height: '35px', objectFit: 'contain' }}
              />
              <span>
                <span className="ignite-text">Quick</span>
                <span style={{ color: '#fff' }}>Bite</span>
              </span>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              The premier platform for high-end culinary delivery. Trusted by top-tier chefs and foodies globally.
            </p>
          </div>

          <div>
            <h4 style={{
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: '32px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '12px'
            }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['About', 'Careers', 'Press', 'Investors'].map((item) => (
                <a key={item} href="#" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: '32px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '12px'
            }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['Help Center', 'Safety', 'Privacy', 'Terms'].map((item) => (
                <a key={item} href="#" style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '32px',
          borderTop: `1px solid ${outlineVariant}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px'
          }}>
            © 2024 QuickBite. Crafted for excellence.
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Privacy Policy
            </a>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Cookies
            </a>
          </div>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .hero-image {
            display: block !important;
          }
        }

        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }

        @media (max-width: 640px) {
          h1 {
            fontSize: 40px !important;
          }
          section {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
