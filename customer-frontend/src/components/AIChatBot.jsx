import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle, X, Send, Bot, User, Loader2, Sparkles,
    Navigation, Trash2, ShoppingBag, CheckCircle2, Leaf,
    Drumstick, MapPin, CreditCard, ShoppingCart, Plus, Minus
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const TypingMessage = ({ text, onComplete, children, animate = true }) => {
    const [displayedText, setDisplayedText] = useState(animate ? '' : text);
    const [isTyping, setIsTyping] = useState(animate);

    useEffect(() => {
        if (!animate) {
            setDisplayedText(text);
            setIsTyping(false);
            return;
        }

        let index = 0;
        setDisplayedText('');
        setIsTyping(true);

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
                if (onComplete) onComplete();
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, animate]);

    return (
        <div>
            <p className="whitespace-pre-wrap">{displayedText}</p>
            {!isTyping && children}
        </div>
    );
};

// Parses [DISH_CARDS:id|name|price|restId|restName|image|isVeg:::id2|...] into array of dish objects
const parseDishCards = (tag) => {
    try {
        const dishes = tag.split(':::');
        return dishes.map(d => {
            const parts = d.split('|');
            return {
                _id: parts[0]?.trim(),
                name: parts[1]?.trim(),
                price: parseFloat(parts[2]?.replace(/[₹,\s]/g, '')) || 0,
                restaurantId: parts[3]?.trim(),
                restaurantName: parts[4]?.trim(),
                image: parts[5]?.trim() || '',
                isVeg: parts[6]?.trim() === 'true',
            };
        }).filter(d => d._id && d.name);
    } catch {
        return [];
    }
};

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm QuickBites AI. 🍔 Tell me your mood — spicy, sweet, healthy, exotic — and I'll find the perfect dish for you!",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mood-order flow state
    const [moodOrderItems, setMoodOrderItems] = useState([]);
    const [isOrderPlacing, setIsOrderPlacing] = useState(false);

    const { user, addresses } = useUser();
    const { addToCart, clearCart } = useCart();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClearChat = () => {
        setMoodOrderItems([]);
        setMessages([{
            id: Date.now(),
            text: "Hello! I'm QuickBites AI. 🍔 Tell me your mood — spicy, sweet, healthy, exotic — and I'll find the perfect dish for you!",
            sender: 'ai',
            timestamp: new Date(),
            hasTyped: false
        }]);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleActionClick = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleAddToCartClick = (actionString) => {
        const parts = actionString.split('|');
        if (parts.length < 4) { console.error("Invalid Cart Action Format", actionString); return; }

        const item = {
            _id: parts[0],
            name: parts[1],
            price: parseFloat(parts[2]),
            restaurantId: parts[3],
            image: parts[4] || '',
            qty: 1
        };
        addToCart(item);
    };

    // When user clicks a dish card from mood recommendations
    const handleDishSelect = (dish, msgId) => {
        // Mark this dish as selected in that message
        setMessages(prev => prev.map(m => {
            if (m.id !== msgId) return m;
            const updated = (m.selectedDishes || []).includes(dish._id)
                ? m.selectedDishes
                : [...(m.selectedDishes || []), dish._id];
            return { ...m, selectedDishes: updated };
        }));

        // Check restaurant conflict
        if (moodOrderItems.length > 0 && moodOrderItems[0].restaurantId !== dish.restaurantId) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: `This dish is from a different restaurant (${dish.restaurantName}). Your current order is from ${moodOrderItems[0].restaurantName}. Please complete your current order first, or clear it to start a new one.`,
                sender: 'ai',
                timestamp: new Date(),
                hasTyped: false
            }]);
            return;
        }

        // Add to moodOrderItems (with qty)
        setMoodOrderItems(prev => {
            const existing = prev.find(i => i._id === dish._id);
            if (existing) {
                return prev.map(i => i._id === dish._id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...dish, qty: 1 }];
        });

        // Also add to cart context so it's visible in the cart page
        addToCart({ ...dish, qty: 1 });

        // Show a local confirmation message — no backend call needed
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: `${dish.name} has been added to your order! Want to add more dishes or place your order now?`,
            sender: 'ai',
            timestamp: new Date(),
            hasTyped: false,
            showOrderNow: true
        }]);
    };

    // Place the order via API directly (COD + home address)
    const handleAutoOrder = async () => {
        if (moodOrderItems.length === 0) return;

        if (!user) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: 'Please log in first to place an order.',
                sender: 'ai',
                timestamp: new Date(),
                hasTyped: false
            }]);
            return;
        }

        const homeAddress = addresses.find(a => a.type === 'home' && a.isDefault)
            || addresses.find(a => a.isDefault)
            || addresses[0];

        if (!homeAddress) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "You don't have a saved address yet. Please add one first!",
                sender: 'ai',
                timestamp: new Date(),
                hasTyped: false,
                actions: ['/addresses']
            }]);
            return;
        }

        setIsOrderPlacing(true);

        try {
            const token = localStorage.getItem('token');
            const subtotal = moodOrderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
            const taxes = Math.round(subtotal * 0.05);
            const deliveryFee = 30;
            const total = subtotal + taxes + deliveryFee;

            const orderData = {
                items: moodOrderItems.map(item => ({
                    menuItem: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.qty || 1,
                    image: item.image || '',
                    customization: ''
                })),
                restaurant: moodOrderItems[0].restaurantId,
                restaurantName: moodOrderItems[0].restaurantName,
                restaurantImage: '',
                deliveryAddress: {
                    street: homeAddress.street || '',
                    city: homeAddress.city || '',
                    state: homeAddress.state || '',
                    pincode: homeAddress.pincode || '',
                    landmark: homeAddress.landmark || '',
                    type: homeAddress.type || 'home'
                },
                subtotal,
                deliveryFee,
                taxes,
                discount: 0,
                total,
                paymentMethod: 'COD',
                estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
                deliveryDistance: 0,
                deliveryDuration: 30,
                instructions: 'Order placed via QuickBites AI chat'
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                // Reset mood order items
                setMoodOrderItems([]);
                setIsOpen(false);

                navigate('/order-success', {
                    state: {
                        orderId: data.data._id,
                        orderNumber: data.data.orderId || data.data._id,
                        items: orderData.items,
                        total: orderData.total,
                        totalAmount: orderData.total,
                        paymentMethod: 'COD',
                        estimatedDeliveryTime: data.data.estimatedDeliveryTime || orderData.estimatedDeliveryTime,
                        deliveryAddress: orderData.deliveryAddress,
                        restaurantName: orderData.restaurantName,
                        isScheduled: false,
                        scheduledFor: null
                    }
                });

                // Clear cart after a short delay
                setTimeout(() => clearCart(), 500);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Auto-order error:', err);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: `Oops, couldn't place your order: ${err.message}. Please try again or go to the Cart page.`,
                sender: 'ai',
                timestamp: new Date(),
                hasTyped: false,
                isError: true
            }]);
        } finally {
            setIsOrderPlacing(false);
        }
    };

    const suggestedPrompts = [
        "📦 Track Order",
        "🌶️ Spicy food",
        "🍰 Something sweet",
        "🥗 Healthy options",
        "❓ Help"
    ];

    const handleChipClick = (prompt) => {
        const text = prompt.replace(/^[\p{Emoji}\s]+/gu, '');
        sendMessage(text);
    };

    const sendMessage = async (text, isAutoSend = false) => {
        if (!text.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        if (!isAutoSend) setMessages(prev => [...prev, userMessage]);
        else setMessages(prev => [...prev, { ...userMessage, isAutoSend: true }]);

        setInputText('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    message: text,
                    userId: user?._id
                })
            });

            const data = await response.json();

            if (data.success) {
                let replyText = data.reply;
                let navActions = [];
                let cartActions = [];
                let dishCards = [];
                let showOrderNow = false;

                // Parse Navigation tags
                const navRegex = /\[NAVIGATE:([^\]]+)\]/g;
                let match;
                while ((match = navRegex.exec(replyText)) !== null) {
                    navActions.push(match[1]);
                }
                replyText = replyText.replace(navRegex, '');

                // Parse ADD_TO_CART tags
                const cartRegex = /\[ADD_TO_CART:([^\]]+)\]/g;
                while ((match = cartRegex.exec(replyText)) !== null) {
                    cartActions.push(match[1]);
                }
                replyText = replyText.replace(cartRegex, '').trim();

                // Parse DISH_CARDS tags
                const dishCardsRegex = /\[DISH_CARDS:([^\]]+)\]/g;
                while ((match = dishCardsRegex.exec(replyText)) !== null) {
                    const cards = parseDishCards(match[1]);
                    dishCards.push(...cards);
                }
                replyText = replyText.replace(dishCardsRegex, '').trim();

                // Parse ORDER_NOW tag
                if (replyText.includes('[ORDER_NOW]')) {
                    showOrderNow = true;
                    replyText = replyText.replace(/\[ORDER_NOW\]/g, '').trim();
                }

                const aiMessage = {
                    id: Date.now() + 1,
                    text: replyText,
                    sender: 'ai',
                    timestamp: new Date(),
                    actions: navActions,
                    cartActions: cartActions,
                    dishCards: dishCards,
                    showOrderNow: showOrderNow
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Render [DISH_CARDS] as a visual grid inside the chat bubble
    const renderDishCards = (dishes, msgId, selectedDishes = []) => {
        if (!dishes || dishes.length === 0) return null;
        return (
            <div className="mt-3 space-y-2">
                {dishes.map((dish, idx) => {
                    const isSelected = selectedDishes.includes(dish._id);
                    return (
                        <motion.div
                            key={`dish-${idx}-${dish._id}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`rounded-xl border overflow-hidden shadow-sm ${isSelected ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}
                        >
                            <div className="flex gap-2 p-2 items-center">
                                {/* Dish Image */}
                                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    {dish.image ? (
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="w-full h-full object-cover"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🍽️</div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        {dish.isVeg
                                            ? <span className="w-3.5 h-3.5 rounded-sm border border-green-600 flex items-center justify-center flex-shrink-0"><span className="w-2 h-2 rounded-full bg-green-600 block" /></span>
                                            : <span className="w-3.5 h-3.5 rounded-sm border border-red-600 flex items-center justify-center flex-shrink-0"><span className="w-2 h-2 rounded-full bg-red-600 block" /></span>
                                        }
                                        <span className="text-xs font-semibold text-gray-800 truncate">{dish.name}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 truncate">{dish.restaurantName}</p>
                                    <p className="text-xs font-bold text-orange-600 mt-0.5">₹{dish.price}</p>
                                </div>
                                {/* Button */}
                                <div>
                                    {isSelected ? (
                                        <div className="flex items-center gap-1 px-2 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Added</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleDishSelect(dish, msgId)}
                                            disabled={isLoading}
                                            className="flex items-center gap-1 px-2 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-sm"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Select</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    // Render the ORDER_NOW confirmation panel
    const renderOrderNow = () => {
        if (moodOrderItems.length === 0) {
            return (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
                    Please select at least one dish from the options above before placing an order.
                </div>
            );
        }

        const homeAddress = addresses.find(a => a.type === 'home' && a.isDefault)
            || addresses.find(a => a.isDefault)
            || addresses[0];

        const subtotal = moodOrderItems.reduce((s, i) => s + i.price * i.qty, 0);
        const taxes = Math.round(subtotal * 0.05);
        const deliveryFee = 30;
        const total = subtotal + taxes + deliveryFee;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 rounded-xl border border-orange-200 bg-orange-50 overflow-hidden"
            >
                {/* Items summary */}
                <div className="px-3 pt-3 pb-2 border-b border-orange-100">
                    <p className="text-xs font-bold text-gray-700 mb-1.5">Your Order</p>
                    {moodOrderItems.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs text-gray-700 mb-0.5">
                            <span className="flex items-center gap-1">
                                <span className="text-orange-500">{item.qty}×</span> {item.name}
                            </span>
                            <span className="font-semibold">₹{item.price * item.qty}</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="px-3 py-2 space-y-0.5 border-b border-orange-100">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal</span><span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Taxes (5%)</span><span>₹{taxes}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Delivery</span><span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-800 pt-1 border-t border-orange-200 mt-1">
                        <span>Total</span><span>₹{total}</span>
                    </div>
                </div>

                {/* Address & Payment */}
                <div className="px-3 py-2 border-b border-orange-100 space-y-1">
                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{homeAddress ? `${homeAddress.street}, ${homeAddress.city}` : 'No address found'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CreditCard className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                        <span>Cash on Delivery (COD)</span>
                    </div>
                </div>

                {/* Place Order Button */}
                {homeAddress ? (
                    <button
                        onClick={handleAutoOrder}
                        disabled={isOrderPlacing}
                        className="w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60"
                    >
                        {isOrderPlacing ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                        ) : (
                            <><ShoppingCart className="w-4 h-4" /> Place Order — ₹{total}</>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => { setIsOpen(false); navigate('/addresses'); }}
                        className="w-full py-3 flex items-center justify-center gap-2 bg-yellow-500 text-white text-sm font-bold hover:bg-yellow-600 transition-all"
                    >
                        <MapPin className="w-4 h-4" /> Add Delivery Address First
                    </button>
                )}
            </motion.div>
        );
    };

    return (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-[92vw] sm:w-[380px] h-[calc(100vh-120px)] max-h-[580px] bg-white rounded-2xl shadow-2xl mb-4 overflow-hidden flex flex-col pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 pt-5 pb-5 text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <Sparkles className="w-5 h-5 text-yellow-200" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">QuickBites AI</h3>
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-xs font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Mood cart badge */}
                                {moodOrderItems.length > 0 && (
                                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs font-bold mr-1">
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>{moodOrderItems.reduce((s, i) => s + i.qty, 0)}</span>
                                    </div>
                                )}
                                <button
                                    onClick={handleClearChat}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Clear chat"
                                    title="Clear Chat"
                                >
                                    <Trash2 className="w-4 h-4 text-white/90" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Close chat"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-transparent'
                                        }`}>
                                        {msg.sender === 'user'
                                            ? <User className="w-4 h-4" />
                                            : <img src="/quickbite_logo.svg" alt="QuickBites AI" className="w-6 h-6" />
                                        }
                                    </div>

                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-orange-500 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        } ${msg.isError ? 'bg-red-50 text-red-600 border-red-100' : ''}`}>

                                        {msg.sender === 'ai' ? (
                                            <TypingMessage
                                                text={msg.text}
                                                animate={!msg.hasTyped}
                                                onComplete={() => {
                                                    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, hasTyped: true } : m));
                                                    scrollToBottom();
                                                }}
                                            >
                                                {/* Navigation Action Buttons */}
                                                {msg.actions && msg.actions.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {msg.actions.map((action, idx) => (
                                                            <button
                                                                key={`nav-${idx}`}
                                                                onClick={() => handleActionClick(action)}
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full text-xs font-semibold border border-blue-100 text-left"
                                                            >
                                                                <Navigation className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {action.includes('track-order') ? 'Track Order' :
                                                                        action.includes('search=') ? `View ${decodeURIComponent(action.split('search=')[1])}` :
                                                                            action.includes('/orders') ? 'View Orders' :
                                                                                action.includes('/cart') ? 'View Cart' :
                                                                                    action.includes('/profile') ? 'View Profile' :
                                                                                        action.includes('/addresses') ? 'Manage Addresses' :
                                                                                            'Take me there'}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* ADD_TO_CART Buttons */}
                                                {msg.cartActions && msg.cartActions.length > 0 && (
                                                    <div className="mt-3 space-y-2">
                                                        {msg.cartActions.map((action, idx) => {
                                                            const parts = action.split('|');
                                                            const itemName = parts[1] || 'Item';
                                                            const itemPrice = parts[2] || '';
                                                            return (
                                                                <button
                                                                    key={`cart-${idx}`}
                                                                    onClick={(e) => {
                                                                        e.currentTarget.textContent = "Added to Cart! ✅";
                                                                        e.currentTarget.disabled = true;
                                                                        e.currentTarget.classList.add("bg-green-100", "text-green-700", "border-green-200");
                                                                        handleAddToCartClick(action);
                                                                    }}
                                                                    className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors w-full text-xs font-bold border border-orange-200 text-left shadow-sm"
                                                                >
                                                                    <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
                                                                    <div className="flex flex-col">
                                                                        <span>Add {itemName} to Cart</span>
                                                                        <span className="text-[10px] font-normal opacity-80">₹{itemPrice}</span>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {/* DISH_CARDS - Mood-based recommendations */}
                                                {msg.dishCards && msg.dishCards.length > 0 && (
                                                    renderDishCards(msg.dishCards, msg.id, msg.selectedDishes || [])
                                                )}

                                                {/* ORDER_NOW confirmation panel */}
                                                {msg.showOrderNow && renderOrderNow()}
                                            </TypingMessage>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        )}

                                        <span className={`text-[10px] mt-1 block opacity-60 ${msg.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex items-center gap-2 text-gray-400 text-sm ml-10">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Prompts (Chips) */}
                        <div className="px-4 pb-2 bg-white flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-50 pt-2">
                            {suggestedPrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleChipClick(prompt)}
                                    disabled={isLoading}
                                    className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }} className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Tell me your mood or ask about food..."
                                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-200"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-gradient-to-r from-orange-500 to-red-600 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white hover:shadow-2xl hover:shadow-orange-200 transition-all z-50 relative"
            >
                {/* Cart badge on toggle button */}
                {moodOrderItems.length > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {moodOrderItems.reduce((s, i) => s + i.qty, 0)}
                    </span>
                )}
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="w-7 h-7" />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                            <MessageCircle className="w-7 h-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default AIChatBot;
