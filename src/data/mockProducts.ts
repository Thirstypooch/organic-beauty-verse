
import { Product, Category } from "../types/product";

export const categories: Category[] = [
  { 
    id: "1", 
    name: "Facial", 
    description: "Effective skincare solutions for your face", 
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500"
  },
  { 
    id: "2", 
    name: "Masajes", 
    description: "Relaxing massage oils and body products", 
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=500"
  },
  { 
    id: "3", 
    name: "Limpieza Facial", 
    description: "Deep cleansing products for facial care", 
    imageUrl: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=500"
  },
  { 
    id: "4", 
    name: "Corporal", 
    description: "Complete body care products", 
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd47?q=80&w=500"
  },
  { 
    id: "5", 
    name: "Cabello", 
    description: "Hair care products for all hair types", 
    imageUrl: "https://images.unsplash.com/photo-1595476108003-e467c597eca6?q=80&w=500"
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Facial Serum",
    price: 34.99,
    description: "This lightweight, fast-absorbing serum is enriched with vitamin C and hyaluronic acid to brighten and hydrate skin. Perfect for daily use, it helps reduce fine lines and enhance your natural glow.",
    category: "Facial",
    howToUse: "Apply 3-4 drops to clean, dry skin morning and night. Gently pat into face and neck before moisturizer.",
    warnings: "Discontinue use if irritation occurs. Avoid contact with eyes.",
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=500",
    ingredients: "Aloe Vera Juice, Glycerin, Vitamin C, Hyaluronic Acid, Jojoba Oil, Rosehip Oil, Lavender Essential Oil"
  },
  {
    id: "2",
    name: "Hydrating Face Cream",
    price: 28.50,
    description: "A rich, luxurious face cream that provides deep hydration without feeling heavy. Made with natural oils and butters to nourish and protect your skin.",
    category: "Facial",
    howToUse: "Apply a small amount to face and neck after cleansing and serum application. Can be used morning and night.",
    warnings: "For external use only. Keep out of reach of children.",
    imageUrl: "https://images.unsplash.com/photo-1562887284-8ba6be46c120?q=80&w=500",
    ingredients: "Shea Butter, Coconut Oil, Jojoba Oil, Rosehip Oil, Vitamin E, Glycerin, Aloe Vera"
  },
  {
    id: "3",
    name: "Relaxing Massage Oil",
    price: 22.99,
    description: "This soothing massage oil blends organic oils with calming essential oils to relieve tension and promote relaxation.",
    category: "Masajes",
    howToUse: "Warm a small amount between palms and apply to skin with gentle massage movements.",
    warnings: "For external use only. Do not apply to broken skin.",
    imageUrl: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=500",
    ingredients: "Sweet Almond Oil, Jojoba Oil, Lavender Essential Oil, Chamomile Essential Oil"
  },
  {
    id: "4",
    name: "Clay Facial Mask",
    price: 19.95,
    description: "This purifying clay mask draws out impurities and excess oils while tightening pores. Perfect for oily or combination skin types.",
    category: "Limpieza Facial",
    howToUse: "Apply a thin layer to clean skin, avoiding eye area. Leave on for 10-15 minutes, then rinse thoroughly with warm water.",
    warnings: "May cause temporary redness that should subside quickly after removal.",
    imageUrl: "https://images.unsplash.com/photo-1594612929411-f2425063e0c8?q=80&w=500",
    ingredients: "Kaolin Clay, Bentonite Clay, Activated Charcoal, Aloe Vera, Tea Tree Oil"
  },
  {
    id: "5",
    name: "Body Butter",
    price: 24.50,
    description: "A rich, creamy body butter that deeply moisturizes and nourishes dry skin. The luxurious formula melts into skin without feeling greasy.",
    category: "Corporal",
    howToUse: "Apply generously to clean skin, focusing on dry areas like elbows and knees.",
    warnings: "For external use only.",
    imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500",
    ingredients: "Shea Butter, Cocoa Butter, Coconut Oil, Vitamin E, Essential Oils Blend"
  },
  {
    id: "6",
    name: "Organic Shampoo",
    price: 16.99,
    description: "Gentle, sulfate-free shampoo that cleanses without stripping natural oils. Enriched with botanical extracts for healthy, shiny hair.",
    category: "Cabello",
    howToUse: "Apply to wet hair, massage into scalp, and rinse thoroughly. Follow with conditioner.",
    warnings: "Avoid contact with eyes. If contact occurs, rinse immediately with water.",
    imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=500",
    ingredients: "Aloe Vera Juice, Coconut-Derived Cleanser, Rosemary Extract, Lavender Oil, Jojoba Oil"
  },
  {
    id: "7",
    name: "Gentle Facial Cleanser",
    price: 18.99,
    description: "A mild, soap-free cleanser that effectively removes makeup and impurities without disturbing your skin's natural balance.",
    category: "Limpieza Facial",
    howToUse: "Apply to damp skin and massage in circular motions. Rinse thoroughly with warm water.",
    warnings: "Avoid contact with eyes.",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8d89a1581441?q=80&w=500",
    ingredients: "Aloe Vera, Glycerin, Chamomile Extract, Cucumber Extract, Green Tea Extract"
  },
  {
    id: "8",
    name: "Exfoliating Body Scrub",
    price: 21.50,
    description: "This natural scrub gently exfoliates to reveal smoother, more radiant skin. Made with organic sugar and nourishing oils.",
    category: "Corporal",
    howToUse: "Apply to wet skin in circular motions, focusing on rough areas. Rinse thoroughly.",
    warnings: "Not recommended for sensitive or irritated skin.",
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500",
    ingredients: "Organic Brown Sugar, Coconut Oil, Jojoba Oil, Sweet Orange Essential Oil, Vitamin E"
  },
  {
    id: "9",
    name: "Hair Conditioner",
    price: 17.95,
    description: "A replenishing conditioner that detangles and softens hair without weighing it down. Perfect for all hair types.",
    category: "Cabello",
    howToUse: "After shampooing, apply to mid-lengths and ends. Leave for 2-3 minutes, then rinse thoroughly.",
    warnings: "For external use only.",
    imageUrl: "https://images.unsplash.com/photo-1608248094078-1c5ca7b313fb?q=80&w=500",
    ingredients: "Aloe Vera, Argan Oil, Shea Butter, Panthenol, Vitamin E, Lavender Essential Oil"
  },
  {
    id: "10",
    name: "Vitamin C Toner",
    price: 15.99,
    description: "Alcohol-free toner that refreshes and balances skin while providing a boost of antioxidant protection.",
    category: "Facial",
    howToUse: "After cleansing, apply to face using a cotton pad or spray directly onto skin. Follow with serum and moisturizer.",
    warnings: "Avoid contact with eyes.",
    imageUrl: "https://images.unsplash.com/photo-1618330834871-dd22c2c226ac?q=80&w=500",
    ingredients: "Rose Water, Witch Hazel Extract, Vitamin C, Aloe Vera, Glycerin, Cucumber Extract"
  },
  {
    id: "11",
    name: "Anti-Aging Eye Cream",
    price: 32.99,
    description: "Specially formulated for the delicate eye area, this cream helps reduce the appearance of fine lines and dark circles.",
    category: "Facial",
    howToUse: "Apply a small amount around eyes using ring finger. Tap gently until absorbed. Use morning and night.",
    warnings: "Avoid direct contact with eyes.",
    imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=500",
    ingredients: "Shea Butter, Peptides, Hyaluronic Acid, Vitamin E, Chamomile Extract, Cucumber Extract"
  },
  {
    id: "12",
    name: "Hand Repair Cream",
    price: 12.50,
    description: "Rich, fast-absorbing hand cream that soothes and protects dry, rough hands. Non-greasy formula ideal for daily use.",
    category: "Corporal",
    howToUse: "Apply as needed throughout the day, especially after washing hands.",
    warnings: "For external use only.",
    imageUrl: "https://images.unsplash.com/photo-1617863560150-215d30e9f935?q=80&w=500",
    ingredients: "Shea Butter, Almond Oil, Glycerin, Chamomile Extract, Vitamin E, Lavender Essential Oil"
  },
];

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (productId: string, category: string): Product[] => {
  return products
    .filter(product => product.category === category && product.id !== productId)
    .slice(0, 3);
};

export const getAllCategories = (): Category[] => {
  return categories;
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find(category => category.name === name);
};
