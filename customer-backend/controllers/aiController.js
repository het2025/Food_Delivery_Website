// import { GoogleGenerativeAI } from "@google/generative-ai"; // Replaced by Groq
import Groq from "groq-sdk";
import mongoose from 'mongoose'; // Added mongoose
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';

// Initialize Groq
// Note: API Key will be loaded from process.env.GROQ_API_KEY
const getGroq = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const chatWithAI = async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const lowerMessage = message.toLowerCase();
        const isOrderingIntent = lowerMessage.includes('order') ||
            lowerMessage.includes('get me') ||
            lowerMessage.includes('buy') ||
            lowerMessage.includes('want to eat') ||
            lowerMessage.includes('add');

        // Fetch all active restaurants with their popular items/menu highlights
        let restaurants = await Restaurant.find({
            isActive: true,
            status: 'active'
        })
            .select('name cuisine averageRating address.city menu restaurantId priceRange')
            .lean();

        // OPTIMIZATION: Limit to top 30 rated restaurants
        restaurants.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        let limitedRestaurants = restaurants.slice(0, 30);
        // FETCH NEWLY REGISTERED RESTAURANTS (Top 5, from the SEPARATE collection)
        const db = mongoose.connection.db;
        let newRestaurants = await db.collection('new_registered_restaurants').find({
            isActive: true,
            status: 'active'
        })
            .project({ name: 1, cuisine: 1, averageRating: 1, 'address.city': 1, menu: 1, restaurantId: 1, priceRange: 1, _id: 1 })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        // MERGE & DEDUPLICATE
        // Combine Top 30 Rated + Top 5 New
        const allRestaurants = [...limitedRestaurants, ...newRestaurants];

        // Remove duplicates based on _id
        const uniqueRestaurantsMap = new Map();
        allRestaurants.forEach(r => {
            uniqueRestaurantsMap.set(r._id.toString(), r);
        });

        limitedRestaurants = Array.from(uniqueRestaurantsMap.values());

        // EXTRA FILTER: Remove "Azure" if present
        limitedRestaurants = limitedRestaurants.filter(r => !r.name.toLowerCase().includes('azure'));

        // SHUFFLE
        for (let i = limitedRestaurants.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [limitedRestaurants[i], limitedRestaurants[j]] = [limitedRestaurants[j], limitedRestaurants[i]];
        }

        // --- SPECIFIC DISH SEARCH (If intent is ordering) ---
        let dishSearchResults = "";
        if (isOrderingIntent) {
            // Stronger cleaning to isolate the actual dish name
            const stopWords = [
                'order', 'get', 'me', 'buy', 'i', 'want', 'to', 'eat', 'add', 'cart',
                'some', 'a', 'an', 'the', 'for', 'please', 'bring', 'have', 'like', 'would',
                'pure', 'veg', 'non-veg', 'custom', 'customize'
            ];

            const removeRegex = new RegExp(`\\b(${stopWords.join('|')})\\b`, 'gi');
            const potentialDish = message.replace(removeRegex, '').replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, ' ');

            if (potentialDish.length > 2) {
                let matches = [];

                for (const r of limitedRestaurants) {
                    if (r.menu) {
                        for (const cat of r.menu) {
                            if (cat.items) {
                                for (const item of cat.items) {
                                    if (item.name.toLowerCase().includes(potentialDish.toLowerCase())) {
                                        matches.push({
                                            restaurantName: r.name,
                                            restaurantId: r._id,
                                            itemId: item._id,
                                            name: item.name,
                                            price: item.price,
                                            isVeg: item.isVeg,
                                            image: item.url || ''
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (matches.length >= 5) break;
                }

                if (matches.length > 0) {
                    dishSearchResults = "MATCHING DISHES FOUND (Use ONLY these for [ADD_TO_CART]):\n" +
                        matches.map(m => `Dish: ${m.name} | Price: ${m.price} | Restaurant: ${m.restaurantName} | ID: ${m.itemId} | RestID: ${m.restaurantId} | Image: ${m.image || 'N/A'}`).join('\n');

                    // Add this debug log to see what was found
                    console.log(`[AI Search] Found ${matches.length} matches for '${potentialDish}'`);
                } else {
                    dishSearchResults = "NO EXACT DISH MATCHES FOUND for '" + potentialDish + "'. Do NOT invent false items.";
                    console.log(`[AI Search] No matches for '${potentialDish}'`);
                }
            }
        }

        // Format generic context for AI
        const contextList = limitedRestaurants.map(r => {
            let vegCount = 0;
            let totalItems = 0;
            let userHighlights = [];
            let minPrice = Infinity;
            let maxPrice = 0;

            if (r.menu && r.menu.length > 0) {
                r.menu.forEach(cat => {
                    if (cat.items) {
                        cat.items.forEach(item => {
                            totalItems++;
                            if (item.isVeg) vegCount++;
                            if (item.price) {
                                if (item.price < minPrice) minPrice = item.price;
                                if (item.price > maxPrice) maxPrice = item.price;
                            }
                            if (item.isPopular || userHighlights.length < 5) {
                                userHighlights.push(item.name);
                            }
                        });
                    }
                });
            }

            if (minPrice === Infinity) minPrice = "N/A";
            if (maxPrice === 0) maxPrice = "N/A";

            const priceString = (minPrice !== "N/A") ? `₹${minPrice}-₹${maxPrice}` : r.priceRange || 'N/A';
            const uniqueHighlights = [...new Set(userHighlights)].slice(0, 4).join(', ');
            const isPureVeg = totalItems > 0 && vegCount === totalItems;
            const dietaryLabel = isPureVeg ? "Pure Veg" : (vegCount > 0 ? "Mixed / Veg Options" : "Non-Veg Only");
            const ratingDisplay = r.averageRating ? `${r.averageRating}⭐` : "New (No Rating)";

            return `ID: ${r._id} | Name: ${r.name} | Avg Cost: ${priceString} | Cuisine: ${r.cuisine?.join(', ')} | Dietary: ${dietaryLabel} | Rating: ${ratingDisplay} | Top Items: ${uniqueHighlights}`;
        }).join('\n');

        // User and Order Context
        let orderContext = "";
        let activeOrdersList = "";

        if (userId) {
            let userObjectId;
            try {
                userObjectId = new mongoose.Types.ObjectId(userId);
            } catch (e) {
                console.error("Invalid User ID format:", userId);
            }

            if (userObjectId) {
                // Strict status check for active orders
                const activeStatuses = ['pending', 'confirmed', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'picked_up'];

                const activeOrders = await Order.find({
                    customer: userObjectId,
                    status: { $in: activeStatuses } // Use exact match with $in instead of regex
                }).sort({ createdAt: -1 });

                if (activeOrders.length > 0) {
                    activeOrdersList = activeOrders.map(o =>
                        `Order ID: ${o._id} | Restaurant: ${o.restaurantName} | Status: ${o.status} | Items: ${o.items.length} items`
                    ).join('\n');
                    orderContext = `USER HAS ACTIVE ORDERS:\n${activeOrdersList}`;
                } else {
                    orderContext = "USER HAS NO ACTIVE ORDERS.";
                }

                const lastCompletedOrder = await Order.findOne({
                    customer: userObjectId,
                    status: 'Delivered'
                }).sort({ createdAt: -1 });

                if (lastCompletedOrder) {
                    orderContext += `\n\nUSER HISTORY:\nLast completed meal was from ${lastCompletedOrder.restaurantName}. Items: ${lastCompletedOrder.items.map(i => i.name).join(', ')}.`;
                }
            }
        }

        // Construct System Prompt
        const systemPrompt = `
        You are QuickBites AI, a smart food delivery assistant. 
        
        DATA CONTEXT (All available restaurants):
        ${contextList}
        
        MATCHING DISHES (Priority - Use for Ordering):
        ${dishSearchResults}
        
        USER CONTEXT:
        ${orderContext}

        YOUR GOAL:
        Help users find food, TRACK ORDERS, navigate, and ADD ITEMS TO CART.

        RULES:
        1. **Live Order Tracking**: 
           - IF "USER HAS ACTIVE ORDERS": "Your order from [Restaurant] is [Status]." + [NAVIGATE:/track-order/ID]
           - IF "USER HAS NO ACTIVE ORDERS": "You don't have any active orders."

        2. **Ordering Specific Dishes (ADD TO CART)**:
           - **STRICT RULE**: You can ONLY generate an [ADD_TO_CART] tag if the item is explicitly listed in the "MATCHING DISHES" section above.
           - **NEVER** invent an item ID or price. If "MATCHING DISHES" is empty or says "NO EXACT DISH MATCHES FOUND", you CANNOT offer to add to cart.
           - IF match found in "MATCHING DISHES": 
             - Reply: "Found [Dish Name] at [Restaurant Name] for ₹[Price]. Would you like to add it?"
             - **CRITICAL**: Append this tag: [ADD_TO_CART:{itemId}|{name}|{price}|{restaurantId}|{image}]
             - Copy the values EXACTLY from the "MATCHING DISHES" line.
             - If image is "N/A", pass empty string.
           - IF NO match found:
             - Apologize and say you couldn't find that specific dish, but recommend a relevant RESTAURANT from "DATA CONTEXT".
             - Use [NAVIGATE:/restaurants?search=Keyword]

        3. **Dish/Restaurant Search**: 
           - "I want pizza" -> "Pizza Hut is great! [NAVIGATE:/restaurants?search=pizza]"
           - "Go to Azure" -> "Sure! [NAVIGATE:/restaurants?search=azure]"

        4. **General Navigation**: 
           - [NAVIGATE:/orders], [NAVIGATE:/cart], [NAVIGATE:/profile]

        5. **Reorder**:
           - Use "USER HISTORY".
           - "Your last meal was... [NAVIGATE:/restaurants?search=RestaurantName]"

        6. **Surprise Me**:
           - Pick top restaurant.
           - "How about [Name]? [NAVIGATE:/restaurants?search=Name]"

        7. **Tone**: Helpful, short, direct. No thinking process revealed.
        
        8. **Formatting Rules (STRICT)**:
           - **MAX 5 RESULTS**: When listing restaurants or options, NEVER list more than 5.
           - **CONCISE LISTS**: For lists, showing JUST the Name and Rating/Type is best. Do NOT list specific menu items unless the user asks for "dishes" or "menu".
           - **VEG OPTIONS**: If asked for veg options, list ONLY the top 5 restaurants (Name + Dietary Label). Do NOT list their specific dishes in the reply.
           - **Custom Orders**: If user says "Custom Order", reply: "I can't take custom requests directly yet! Please browse the menu or choose a restaurant."

        `;

        try {
            const groq = getGroq();
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.5,
            });

            const reply = completion.choices[0]?.message?.content || "I didn't get any response.";
            res.json({ success: true, reply });

        } catch (apiError) {
            console.error("Groq API Error:", apiError);
            if (apiError.message?.includes("API key")) {
                return res.status(500).json({ success: false, message: "Server configuration error: Invalid Groq API Key." });
            }
            res.status(500).json({ success: false, message: "AI is currently unavailable. Please try again later." });
        }

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
