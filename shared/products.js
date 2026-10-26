// ============================================================
// FreshLink Products Database
// ── Tries to load LIVE products from the backend API first.
// ── Falls back to the static list below if the API is offline.
// ============================================================

const BACKEND_URL = "http://localhost:4000";

// ── Static fallback data (used if API is unreachable) ─────────────────────
const STATIC_PRODUCTS = [

  /* ============================================================
     🥦 VEGETABLES (15 products)  —  Prices in Rwandan Franc (RWF)
     ============================================================ */
  {
    id: 6,
    name: "Tomatoes",
    cat: "Vegetables",
    price: 900,
    tags: ["Special Offer"],
    img: "../images/tomatoes.jpg",
    desc: "Juicy, ripe tomatoes — 900 RWF per kilogram. Perfect for sauces, salads, and fresh everyday cooking. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 25,
    name: "Onions",
    cat: "Vegetables",
    price: 600,
    tags: ["Recommended"],
    img: "../images/onion.jpg",
    desc: "Aromatic whole onions — 600 RWF per kilogram (white onions available at 1,200 RWF/kg). Essential flavourful base for soups, stews and sautés. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 26,
    name: "Garlic",
    cat: "Vegetables",
    price: 1500,
    tags: ["Recommended"],
    img: "../images/garlic.jpg",
    desc: "Fresh garlic bulbs — 1,500 RWF per kilogram. Adds robust aroma and deep flavor to every traditional and modern dish. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 27,
    name: "Cabbage",
    cat: "Vegetables",
    price: 700,
    tags: ["Recommended"],
    img: "../images/cabbage.jpg",
    desc: "Whole crisp cabbage heads — 700 RWF each. Ideal for salads, coleslaw, stir-fries and stuffed dishes. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 28,
    name: "Spinach",
    cat: "Vegetables",
    price: 500,
    tags: ["Recommended"],
    img: "../images/spinach.jpg",
    desc: "Fresh leafy spinach — 500 RWF per bunch. Packed with iron, fibre and vitamins for healthy stews and smoothies. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 29,
    name: "Cucumber",
    cat: "Vegetables",
    price: 600,
    tags: ["Recommended"],
    img: "../images/cucumber.jpg",
    desc: "Crisp, refreshing cucumbers — 600 RWF each. Delicious in salads, sandwiches and as a hydrating healthy snack. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 30,
    name: "Green Bell Pepper",
    cat: "Vegetables",
    price: 800,
    tags: ["Recommended"],
    img: "../images/green bell pepper isolated.jpg",
    desc: "Bright green bell peppers — 800 RWF per kilogram. Crunchy, mild, and perfect for cooking, stuffing and salads. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 31,
    name: "Red Bell Pepper",
    cat: "Vegetables",
    price: 1000,
    tags: ["Special Offer"],
    img: "../images/red bell pepper.jpg",
    desc: "Sweet red bell peppers — 1,000 RWF per kilogram. Vibrant color and naturally sweet for roasting and salads. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 32,
    name: "Yellow Bell Pepper",
    cat: "Vegetables",
    price: 1000,
    tags: ["Recommended"],
    img: "../images/yellow-bell-pepper.jpg",
    desc: "Bright yellow bell peppers — 1,000 RWF per kilogram. Mildly sweet with sunny color for stir-fry and grilling. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 33,
    name: "Hot Chili Pepper",
    cat: "Vegetables",
    price: 1200,
    tags: ["Special Offer"],
    img: "../images/hot-chili-peppers.jpg",
    desc: "Fiery hot chili peppers — 1,200 RWF per kilogram. Fire up sauces, stews, marinades and traditional dishes. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 34,
    name: "Pumpkin",
    cat: "Vegetables",
    price: 1800,
    tags: ["Recommended"],
    img: "../images/pumpkin.jpg",
    desc: "Whole fresh pumpkins — 1,800 RWF each. Perfect for soups, baking, porridge and hearty seasonal meals. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 35,
    name: "Broccoli",
    cat: "Vegetables",
    price: 1500,
    tags: ["Recommended"],
    img: "../images/brocoli.jpg",
    desc: "Fresh broccoli heads — 1,500 RWF per kilogram. Loaded with nutrients; excellent for steaming, roasting and stir-fry. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 36,
    name: "Green Beans",
    cat: "Vegetables",
    price: 1000,
    tags: ["Recommended"],
    img: "../images/grgeen beans.jpg",
    desc: "Crisp fresh green beans — 1,000 RWF per kilogram. Wonderful in salads, sautés and mixed vegetable sides. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 37,
    name: "Peas",
    cat: "Vegetables",
    price: 1200,
    tags: ["Recommended"],
    img: "../images/green peas in pod isolated white background.jpg",
    desc: "Sweet tender green peas — 1,200 RWF per kilogram. Great for soups, salads and mixed vegetable dishes. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },

  /* ============================================================
     🥚 EGGS (2 products)  —  Prices in Rwandan Franc (RWF)
     ============================================================ */
  {
    id: 10,
    name: "Amanyarwanda",
    cat: "Eggs",
    price: 6000,
    tags: ["Recommended"],
    img: "../images/amanyarwanda-eggs.jpg",
    desc: "Premium Amanyarwanda eggs — 6,000 RWF per tray. Large, rich-flavoured farm-fresh eggs for every meal. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 11,
    name: "Amapondezi",
    cat: "Eggs",
    price: 5200,
    tags: ["Special Offer"],
    img: "../images/amapondezi.jpg",
    desc: "Fresh Amapondezi eggs — 5,200 RWF per tray. Delicious everyday eggs for breakfast, baking and cooking. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },

  /* ============================================================
     🌱 ROOTS & TUBERS (11 total: 6 updated + 5 NEW)  —  Prices in RWF
     ============================================================ */
  {
    id: 12,
    name: "Sweet Potatoes",
    cat: "Roots & Tubers",
    price: 500,
    tags: ["Recommended"],
    img: "../images/sweetpotatoes.jpg",
    desc: "Naturally sweet potatoes — 500 RWF per kilogram. Packed with fibre, vitamins and warm flavour. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 38,
    name: "Irish Potatoes Kinigi",
    cat: "Roots & Tubers",
    price: 1000,
    tags: ["Recommended"],
    img: "../images/irish-potatoes.jpg",
    desc: "Irish Potatoes Kinigi — 1,000 RWF per kilogram. Premium Kinigi variety; firm, fluffy and excellent for boiling, frying and mashing. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 43,
    name: "Irish Potatoes (type 2)",
    cat: "Roots & Tubers",
    price: 800,
    tags: ["Recommended"],
    img: "https://images.unsplash.com/photo-1518977676601-b53f82be754b?q=80&w=400",
    desc: "Irish Potatoes Type 2 — 800 RWF per kilogram. Solid all-purpose variety great for chips, stews and casseroles. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 44,
    name: "Irish Potatoes Umweru",
    cat: "Roots & Tubers",
    price: 700,
    tags: ["Recommended"],
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400",
    desc: "Irish Potatoes Umweru — 700 RWF per kilogram. Affordable every-day potato, perfect for boiling, roasting and home fries. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 39,
    name: "Cassava",
    cat: "Roots & Tubers",
    price: 600,
    tags: ["Recommended"],
    img: "../images/cassava.jpg",
    desc: "Fresh cassava roots — 600 RWF per kilogram. Traditional staple, wonderful boiled, fried or processed into flour. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 40,
    name: "Yams",
    cat: "Roots & Tubers",
    price: 500,
    tags: ["Recommended"],
    img: "../images/yams.jpg",
    desc: "Sweet dense yams — 500 RWF per kilogram. Excellent roasted, mashed or cooked with beans and vegetables. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 41,
    name: "Taro",
    cat: "Roots & Tubers",
    price: 800,
    tags: ["Recommended"],
    img: "../images/taro.jpg",
    desc: "Taro roots — 800 RWF per kilogram. Used in porridges, stews and as a nutritious starchy side. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 42,
    name: "Arrowroots",
    cat: "Roots & Tubers",
    price: 900,
    tags: ["Recommended"],
    img: "../images/arrowroots.jpg",
    desc: "Arrowroots — 900 RWF per kilogram. Tender versatile tubers, great for cooking and thickening traditional sauces. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 45,
    name: "Yams Bwa Yisi",
    cat: "Roots & Tubers",
    price: 1000,
    tags: ["Recommended"],
    img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=400",
    desc: "Yams Bwa Yisi — 1,000 RWF per kilogram. Premium yam variety with rich taste and satisfying hearty texture. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 46,
    name: "Amadegede",
    cat: "Roots & Tubers",
    price: 1500,
    tags: ["Recommended"],
    img: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?q=80&w=400",
    desc: "Amadegede — 1,500 RWF each. Large, hearty gourd-like tuber, perfect for feeding the whole family in traditional meals. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },

  /* ============================================================
     🍎 FRUITS (14 products)
     ============================================================ */
  {
    id: 1,
    name: "Avocado",
    cat: "Fruits",
    price: 2.99,
    tags: ["Recommended"],
    img: "../images/avocados.jpg",
    desc: "Creamy premium avocados perfect for salads, toast and guacamole. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 3,
    name: "Apple",
    cat: "Fruits",
    price: 1.50,
    tags: ["Recommended"],
    img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400",
    desc: "Fresh, crisp and juicy red apples packed with vitamins and fibre. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 8,
    name: "Mango",
    cat: "Fruits",
    price: 3.00,
    tags: ["Recommended"],
    img: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400",
    desc: "Sweet, juicy tropical mangoes, fully ripe and ready to enjoy. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 13,
    name: "Bananas Kamara",
    cat: "Fruits",
    price: 1.40,
    tags: ["Recommended"],
    img: "../images/bananas-kamara.jpg",
    desc: "Sweet Kamara bananas, perfect for breakfast, baking and smoothies. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 14,
    name: "Bananas Gromicheli",
    cat: "Fruits",
    price: 1.35,
    tags: ["Special Offer"],
    img: "../images/bananas-gromicheli.jpg",
    desc: "Premium Gromicheli bananas with smooth texture and rich sweet taste. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 15,
    name: "Bananas Poyo",
    cat: "Fruits",
    price: 1.30,
    tags: ["Recommended"],
    img: "../images/bananas-poyo.jpg",
    desc: "Flavorful Poyo bananas, great for snacks, desserts and juicing. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 17,
    name: "Sweet Mangoes",
    cat: "Fruits",
    price: 3.20,
    tags: ["Recommended"],
    img: "../images/mangoes.jpg",
    desc: "Juicy mangoes with tropical sweetness, perfect for fresh eating and juice. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 18,
    name: "Fresh Pineapples",
    cat: "Fruits",
    price: 4.50,
    tags: ["Special Offer"],
    img: "../images/pineapple.jpg",
    desc: "Sweet pineapples with tangy flavor, ideal for juices, salads and desserts. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 19,
    name: "Passion Fruit",
    cat: "Fruits",
    price: 2.75,
    tags: ["Recommended"],
    img: "../images/passion-fruits.jpg",
    desc: "Exotic passion fruit with vibrant aroma and juicy seed-filled pulp. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 21,
    name: "Sweet Papayas",
    cat: "Fruits",
    price: 3.10,
    tags: ["Recommended"],
    img: "../images/papayas.jpg",
    desc: "Ripe papayas with silky flesh and delicious mild tropical flavor. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 22,
    name: "Seedless Watermelon",
    cat: "Fruits",
    price: 6.00,
    tags: ["Special Offer"],
    img: "../images/watermelons.jpg",
    desc: "Large, sweet seedless watermelon — refreshing and deeply hydrating. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 23,
    name: "Tamarillo (Tree Tomato)",
    cat: "Fruits",
    price: 3.80,
    tags: ["Recommended"],
    img: "../images/tree-tomatoes-tamarillos.jpg",
    desc: "Tamarillo tree tomatoes with tangy, fruity flavor for sauces and salads. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  },
  {
    id: 24,
    name: "Fresh Lemons",
    cat: "Fruits",
    price: 1.80,
    tags: ["Recommended"],
    img: "../images/lemons.jpg",
    desc: "Zesty lemons perfect for drinks, cooking and adding bright fresh flavor. Our products are grown in Rwanda with care and dedication. They come from well‑maintained farms where crops are better watered, naturally nourished, and carefully harvested at the right time. Each item is selected to ensure freshness, rich flavor, and high nutritional value. From planting to harvest, farmers follow sustainable practices that protect the soil and environment, giving you healthy produce straight from the land. Every fruit, vegetable, egg, and tuber is handled with attention to quality, making sure you enjoy the best Rwanda has to offer."
  }
];

// ── Image URL resolver ─────────────────────────────────────────────────────
/**
 * Converts any image value from the backend into a usable <img src>.
 * Handles: full HTTP URLs, /uploads/ paths, bare filenames (served locally).
 */
function resolveImageUrl(img) {
  if (!img || typeof img !== "string") return "../images/tomatoes.jpg";
  const t = img.trim();
  if (!t) return "../images/tomatoes.jpg";
  // Already absolute
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  // Backend-relative upload path
  if (t.startsWith("/uploads/")) return BACKEND_URL + t;
  if (t.startsWith("uploads/")) return BACKEND_URL + "/" + t;
  // Timestamped uploads (e.g. 1791831769829-egg.jpg) from backend
  if (/^\d{10,}-/.test(t)) return BACKEND_URL + "/uploads/" + t;
  // Already a local relative path
  if (t.startsWith("../images/")) return t;
  if (t.startsWith("images/")) return "../" + t;
  if (t.startsWith("/")) return t;
  // Bare filename → local file in images/
  return "../images/" + t;
}

// ── Map API product format → storefront product format ────────────────────
function mapApiProduct(apiProduct) {
  const tags = [];
  if (apiProduct.isRecommended || apiProduct.recommended) tags.push("Recommended");
  if (apiProduct.isSpecialOffer || apiProduct.specialOffer) tags.push("Special Offer");
  // Also support tags array returned directly
  if (Array.isArray(apiProduct.tags)) {
    apiProduct.tags.forEach(function (t) { if (!tags.includes(t)) tags.push(t); });
  }

  // Category: prefer cat field (backend already sets it), fall back to category
  const cat = apiProduct.cat || apiProduct.category || "Other";

  // Image: prefer img field (backend already normalises it), fall back to imageUrl/image
  const rawImg = apiProduct.img || apiProduct.imageUrl || apiProduct.image || null;

  return {
    // Use legacyId (numeric) for URL compatibility with existing pages; fall back to UUID
    id: apiProduct.legacyId || apiProduct.id,
    _uuid: apiProduct.id,        // keep the real UUID for future use
    name: apiProduct.name,
    cat: cat,
    price: Number(apiProduct.price) || 0,
    tags: tags,
    img: resolveImageUrl(rawImg),
    desc: apiProduct.desc || apiProduct.description || "",
    currency: apiProduct.currency || "RWF",
    unit: apiProduct.unit || "kg",
    stock: apiProduct.stock || apiProduct.quantity || 0,
    isAvailable: apiProduct.isAvailable !== false && apiProduct.availability !== "Unavailable",
    calories: apiProduct.calories || null,
    fat: apiProduct.fat || null,
    fiber: apiProduct.fiber || null,
    protein: apiProduct.protein || null,
    storageInstructions: apiProduct.storageInstructions || null,
    rawCreatedAt: apiProduct.rawCreatedAt || null,
  };
}

// ── Boot: load from API, fall back to static ──────────────────────────────
window.isProductsLoading = true;
window.productsLoadError = null;

window.fetchFreshProducts = function() {
  window.isProductsLoading = true;
  window.productsLoadError = null;
  document.dispatchEvent(new CustomEvent("productsLoading"));

  fetch(BACKEND_URL + "/api/products?availableOnly=false")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (json) {
      var raw = Array.isArray(json) ? json : (json.data || []);
      if (!Array.isArray(raw) || raw.length === 0) {
        window.products = STATIC_PRODUCTS.slice();
      } else {
        window.products = raw.map(mapApiProduct);
      }
      window.isProductsLoading = false;

      if (typeof window._freshLinkProductsReady === "function") {
        window._freshLinkProductsReady(window.products);
      }
      document.dispatchEvent(new CustomEvent("productsLoaded", { detail: window.products }));
    })
    .catch(function (err) {
      window.isProductsLoading = false;
      window.productsLoadError = err;
      console.warn("[FreshLink] Backend unavailable — using static products.", err.message);
      // Keep static products available immediately
      window.products = STATIC_PRODUCTS.slice();
      document.dispatchEvent(new CustomEvent("productsLoadError", { detail: err }));
    });
};

(function initProducts() {
  window.products = STATIC_PRODUCTS.slice();
  window.fetchFreshProducts();
})();

// ── Skeleton Placeholder Generator ───────────────────────────────────────
window.getSkeletonCardsHtml = function(count) {
  count = count || 6;
  let html = "";
  for (let i = 0; i < count; i++) {
    html += [
      '<div class="skeleton-card" aria-hidden="true">',
      '  <div>',
      '    <div class="skeleton-image skeleton-shimmer"></div>',
      '    <div class="skeleton-line title skeleton-shimmer"></div>',
      '    <div class="skeleton-line skeleton-shimmer" style="width: 85%;"></div>',
      '    <div class="skeleton-line skeleton-shimmer" style="width: 55%;"></div>',
      '  </div>',
      '  <div class="skeleton-footer">',
      '    <div class="skeleton-line price skeleton-shimmer"></div>',
      '    <div class="skeleton-button skeleton-shimmer"></div>',
      '  </div>',
      '</div>'
    ].join("");
  }
  return html;
};

// ── Shopping Cart Utility Functions ───────────────────────────────────────
window.getCart = function () {
  return JSON.parse(localStorage.getItem("fruitiva_cart")) || [];
};

window.saveCart = function (cart) {
  localStorage.setItem("fruitiva_cart", JSON.stringify(cart));
  if (typeof window.getCustomerUser === "function") {
    const user = window.getCustomerUser();
    if (user && user.id) {
      localStorage.setItem("fruitiva_user_cart_" + user.id, JSON.stringify(cart));
    }
  }
  window.updateCartBadges();
  if (typeof window.updateMobileDrawerAuth === "function") {
    window.updateMobileDrawerAuth();
  }
};

window.addToCart = function (productId, qty) {
  qty = qty || 1;
  const product = (window.products || STATIC_PRODUCTS).find(function (p) {
    return String(p.id) === String(productId) || String(p._uuid) === String(productId);
  });
  if (!product) return;

  let cart = window.getCart();
  const existing = cart.find(function (item) {
    return String(item.id) === String(product.id) || (product._uuid && String(item._uuid) === String(product._uuid));
  });

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      _uuid: product._uuid || null,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: qty
    });
  }
  window.saveCart(cart);
  window.showMiniAlert(product.name + " added to cart! 🛒");
};

window.updateCartBadges = function () {
  const cart = window.getCart();
  const totalCost = cart.reduce(function (sum, item) { return sum + (item.price * item.qty); }, 0);
  const totalCount = cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);

  const cartAmountElements = document.querySelectorAll(".cart-box span, #cart-amount");
  cartAmountElements.forEach(function (el) {
    el.innerText = totalCost.toLocaleString() + " RWF";
  });

  const drawerBadge = document.getElementById("drawerCartCount");
  if (drawerBadge) drawerBadge.innerText = totalCount;
};

// Custom toast alert
window.showMiniAlert = function (msg, isError) {
  let alertBox = document.getElementById("cart-mini-alert");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "cart-mini-alert";
    alertBox.style.cssText = [
      "position:fixed",
      "bottom:24px",
      "right:24px",
      "background:" + (isError ? "#ef4444" : "#16a34a"),
      "color:white",
      "padding:14px 24px",
      "border-radius:12px",
      "box-shadow:0 10px 25px rgba(0,0,0,0.2)",
      "font-weight:bold",
      "z-index:100000",
      "opacity:0",
      "transform:translateY(20px)",
      "transition:all 0.3s ease",
      "font-family:sans-serif"
    ].join(";");
    document.body.appendChild(alertBox);
  }
  alertBox.style.background = isError ? "#ef4444" : "#16a34a";
  alertBox.innerText = msg;
  alertBox.style.opacity = "1";
  alertBox.style.transform = "translateY(0)";

  setTimeout(function () {
    alertBox.style.opacity = "0";
    alertBox.style.transform = "translateY(20px)";
  }, 2500);
};

// ── Global Search Handler ─────────────────────────────────────────────────
function initGlobalSearch() {
  const searchContainers = document.querySelectorAll(".search-bar, .search-box");
  searchContainers.forEach(function (container) {
    const input = container.querySelector("input");
    const icon = container.querySelector("i, .fa-magnifying-glass");
    if (!input) return;

    if (!input.getAttribute("aria-label")) {
      input.setAttribute("aria-label", "Search for products");
    }

    const executeSearch = function () {
      const q = input.value.trim();
      const isShopPage = window.location.pathname.endsWith("shopp.html") || window.location.pathname.endsWith("/shopp");

      if (isShopPage) {
        const params = new URLSearchParams(window.location.search);
        if (q) params.set("search", q);
        else params.delete("search");
        window.history.replaceState({}, "", window.location.pathname + (params.toString() ? "?" + params.toString() : ""));
        if (typeof window.applyFilterAndSearch === "function") {
          window.applyFilterAndSearch();
        }
      } else {
        window.location.href = "../shop/shopp.html" + (q ? "?search=" + encodeURIComponent(q) : "");
      }
    };

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        executeSearch();
      }
    });

    if (icon) {
      icon.style.cursor = "pointer";
      icon.setAttribute("role", "button");
      icon.setAttribute("aria-label", "Search");
      icon.addEventListener("click", function (e) {
        e.preventDefault();
        executeSearch();
      });
    }
  });
}

// ── Mobile Navigation Drawer ──────────────────────────────────────────────
function initMobileNavigation() {
  const mainNav = document.querySelector(".main-nav");
  if (!mainNav || document.getElementById("mobileNavDrawer")) return;

  // Insert mobile hamburger button if missing
  let toggleBtn = mainNav.querySelector(".mobile-nav-toggle");
  if (!toggleBtn) {
    toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-nav-toggle";
    toggleBtn.type = "button";
    toggleBtn.setAttribute("aria-label", "Open navigation menu");
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    mainNav.insertBefore(toggleBtn, mainNav.firstChild);
  }

  // Create Overlay & Drawer
  let overlay = document.getElementById("mobileDrawerOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mobile-drawer-overlay";
    overlay.id = "mobileDrawerOverlay";
    document.body.appendChild(overlay);
  }

  const drawer = document.createElement("aside");
  drawer.className = "mobile-nav-drawer";
  drawer.id = "mobileNavDrawer";
  drawer.setAttribute("aria-label", "Mobile navigation menu");

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const cart = window.getCart();
  const cartCount = cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);

  drawer.innerHTML = [
    '<div class="mobile-drawer-header">',
    '  <a href="../home/home.html" class="drawer-logo" aria-label="Fresh Link Home">',
    '    <img src="../images/logo-removebg-preview.png" alt="Fresh Link logo">',
    '  </a>',
    '  <button class="mobile-drawer-close" id="mobileDrawerCloseBtn" aria-label="Close navigation menu">',
    '    <i class="fa-solid fa-xmark"></i>',
    '  </button>',
    '</div>',
    '<div class="mobile-drawer-auth" id="mobileDrawerAuthBlock"></div>',
    '<nav class="mobile-drawer-nav">',
    '  <ul>',
    '    <li><a href="../home/home.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-house menu-icon"></i> Home</span></a></li>',
    '    <li><a href="../shop/shopp.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-store menu-icon"></i> Shop Products</span></a></li>',
    '    <li><a href="../cart/cart.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-cart-shopping menu-icon"></i> Cart</span><span class="badge" style="background:#16a34a;color:white;padding:2px 8px;border-radius:999px;font-size:12px;" id="drawerCartCount">' + cartCount + '</span></a></li>',
    '    <li><a href="../wishlist/wishlist.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-heart menu-icon"></i> Wishlist</span><span class="badge" style="background:#ef4444;color:white;padding:2px 8px;border-radius:999px;font-size:12px;" id="drawerWishlistCount">' + wishlist.length + '</span></a></li>',
    '    <li><a href="../subscription/subscription.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-calendar-check menu-icon"></i> Grocery Subscription</span></a></li>',
    '    <li><a href="../about/aboutt.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-circle-info menu-icon"></i> About Us</span></a></li>',
    '    <li><a href="../contact/contact.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-envelope menu-icon"></i> Contact Us</span></a></li>',
    '    <li><a href="../orders/orders.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-circle-question menu-icon"></i> How to Order</span></a></li>',
    '    <li><a href="../delivery/delivery.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-truck-fast menu-icon"></i> Delivery Terms</span></a></li>',
    '    <li><a href="../delivery/return.html"><span style="display:flex;align-items:center;gap:10px;"><i class="fa-solid fa-rotate-left menu-icon"></i> Returns & Refunds</span></a></li>',
    '  </ul>',
    '</nav>',
    '<div class="mobile-drawer-footer">',
    '  <div><i class="fa-solid fa-truck" style="color:#16a34a;"></i> <span>Fast delivery everywhere in Kigali</span></div>',
    '  <div><i class="fa-solid fa-phone" style="color:#16a34a;"></i> <a href="tel:0783628833">0783628833</a></div>',
    '  <div><i class="fa-brands fa-instagram" style="color:#e11d48;"></i> <a href="https://www.instagram.com/freshy_board?igsh=MjNmemVvYXNna2Y1" target="_blank" rel="noopener">@freshy_board</a></div>',
    '</div>'
  ].join("");

  document.body.appendChild(drawer);

  const openDrawer = function () {
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    updateMobileDrawerAuth();
  };

  const closeDrawer = function () {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  toggleBtn.addEventListener("click", openDrawer);
  overlay.addEventListener("click", closeDrawer);
  const closeBtn = document.getElementById("mobileDrawerCloseBtn");
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("active")) {
      closeDrawer();
    }
  });

  window.updateMobileDrawerAuth = function () {
    const authBox = document.getElementById("mobileDrawerAuthBlock");
    if (!authBox) return;
    const user = typeof window.getCustomerUser === "function" ? window.getCustomerUser() : null;

    if (user && window.isCustomerLoggedIn && window.isCustomerLoggedIn()) {
      authBox.innerHTML = [
        '<div class="mobile-drawer-user">',
        '  <div class="user-greeting">',
        '    <i class="fa-solid fa-circle-user"></i>',
        '    <span>' + (user.name || "My Account") + '</span>',
        '  </div>',
        '  <div class="user-actions">',
        '    <a href="../orders/myorders.html" style="color:#16a34a;"><i class="fa-solid fa-box"></i> My Orders</a>',
        '    <span style="color:#d1d5db;">|</span>',
        '    <a href="#" id="mobileLogoutBtn" style="color:#ef4444;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>',
        '  </div>',
        '</div>'
      ].join("");
      const logoutBtn = document.getElementById("mobileLogoutBtn");
      if (logoutBtn) {
        logoutBtn.onclick = function (e) {
          e.preventDefault();
          window.customerLogout();
        };
      }
    } else {
      authBox.innerHTML = [
        '<div class="auth-links">',
        '  <i class="fa-regular fa-user" style="color:#9ca3af;font-size:18px;"></i>',
        '  <div>',
        '    <a href="login.html?tab=login" class="login-link">Login</a> or ',
        '    <a href="login.html?tab=register" class="reg-link">Create Account</a>',
        '  </div>',
        '</div>'
      ].join("");
    }

    const wishEl = document.getElementById("drawerWishlistCount");
    const cartEl = document.getElementById("drawerCartCount");
    if (wishEl) {
      const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
      wishEl.innerText = w.length;
    }
    if (cartEl && window.getCart) {
      const c = window.getCart();
      cartEl.innerText = c.reduce(function (sum, it) { return sum + (it.qty || 1); }, 0);
    }
  };

  updateMobileDrawerAuth();
}

// ── Clean Up Internal Navigation Links ────────────────────────────────────
function fixInternalNavigationLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    const href = (link.getAttribute("href") || "").trim();
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
      if (href.includes("instagram.com") || href.includes("google.com")) {
        return;
      }
    }
    if (
      href.endsWith(".html") ||
      href.includes(".html?") ||
      href.startsWith("#") ||
      href === "home.html" ||
      href === "shopp.html" ||
      href === "cart.html" ||
      href === "aboutt.html" ||
      href === "contact.html" ||
      href === "subscription.html" ||
      href === "wishlist.html" ||
      href === "login.html" ||
      href === "orders.html" ||
      href === "delivery.html" ||
      href === "return.html" ||
      href === "myorders.html" ||
      href === "checkout.html"
    ) {
      link.removeAttribute("target");
    }
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  window.updateCartBadges();
  initGlobalSearch();
  initMobileNavigation();
  fixInternalNavigationLinks();
});

// Auto-include customer-auth.js if not already included
if (typeof window.isCustomerLoggedIn === "undefined") {
  const authScript = document.createElement("script");
  authScript.src = "../shared/customer-auth.js";
  document.head.appendChild(authScript);
}

