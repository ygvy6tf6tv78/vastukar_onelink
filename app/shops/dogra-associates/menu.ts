// Mango – Pure Vegetarian Restaurant – Menu as per 17-01-2025

export interface MenuItem {
  id: string
  name: string
  description?: string
  quantity: string
  price: string
  category: MenuCategoryKey
  image?: string
}

export type MenuCategoryKey =
  | 'burgerPizza'
  | 'sandwichSalad'
  | 'momos'
  | 'pastaMaggiFries'
  | 'healthyDrinks'
  | 'wraps'
  | 'mojitosSmoothies'
  | 'shakesIceCream'
  | 'starters'
  | 'hotBeverages'
  | 'riceNoodlesSoups'
  | 'combos'
  | 'mainCourse'
  | 'thali'

function getItemImage(category: string, itemName: string): string {
  const imageName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `/menu-items/${category}/${imageName}.jpg`
}

function item(
  id: string,
  name: string,
  price: string,
  category: MenuCategoryKey,
  quantity = '1 portion',
  description?: string
): MenuItem {
  return {
    id,
    name,
    quantity,
    price: `₹${price}`,
    category,
    description,
    image: getItemImage(category, name),
  }
}

export interface MenuCategoryConfig {
  name: string
  shortDescription: string
  icon: string
  image: string
  items: MenuItem[]
}

// Category images (Unsplash – veg/food themed)
const categoryImages: Record<MenuCategoryKey, string> = {
  burgerPizza: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  sandwichSalad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  momos: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
  pastaMaggiFries: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
  healthyDrinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  wraps: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
  mojitosSmoothies: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
  shakesIceCream: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
  starters: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  hotBeverages: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
  riceNoodlesSoups: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
  combos: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  mainCourse: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  thali: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
}

export const menuCategories: Record<MenuCategoryKey, MenuCategoryConfig> = {
  burgerPizza: {
    name: 'Burger & Pizza',
    shortDescription: 'Burgers, fries and small pizzas.',
    icon: '🍔',
    image: categoryImages.burgerPizza,
    items: [
      item('bp-1', 'Veg. Burger', '110', 'burgerPizza'),
      item('bp-2', 'Veg. Burger + Fries', '130', 'burgerPizza'),
      item('bp-3', 'Cheese Stuffing Burger + Fries', '190', 'burgerPizza'),
      item('bp-4', 'Coleslaw Burger + Fries', '190', 'burgerPizza'),
      item('bp-5', 'Crispy Paneer Burger + Fries', '250', 'burgerPizza'),
      item('bp-6', 'Mango Special Burger + Fries', '250', 'burgerPizza'),
      item('bp-7', 'Double Decker Burger + Fries', '250', 'burgerPizza'),
      item('bp-8', 'Double Cheese Burger + Fries', '250', 'burgerPizza'),
      item('bp-9', 'Multigrain Burger + Fries', '250', 'burgerPizza'),
      item('bp-10', 'Veg Corn Pizza Small', '70', 'burgerPizza'),
      item('bp-11', 'Crispy Paneer Pizza Small', '90', 'burgerPizza'),
      item('bp-12', 'Plain Cheese Pizza', '120', 'burgerPizza'),
      item('bp-13', 'Capsicum Onion Pizza', '130', 'burgerPizza'),
      item('bp-14', 'Mexican Pizza', '130', 'burgerPizza'),
      item('bp-15', 'Mushroom Capsicum Onion Pizza', '130', 'burgerPizza'),
      item('bp-16', 'Barbeque Mushroom Pizza', '140', 'burgerPizza'),
      item('bp-17', 'Mango Special Pizza', '140', 'burgerPizza'),
      item('bp-18', 'Thai Pizza', '140', 'burgerPizza'),
      item('bp-19', 'Italian Pizza', '140', 'burgerPizza'),
      item('bp-20', 'Veg Schezwan Pizza', '250', 'burgerPizza'),
      item('bp-21', 'Paneer Makhni Pizza', '250', 'burgerPizza'),
      item('bp-22', 'Exotic Vegetable Pizza', '250', 'burgerPizza'),
      item('bp-23', 'Pineapple Corn Pizza', '250', 'burgerPizza'),
      item('bp-24', 'Devil Baby Corn Pizza', '250', 'burgerPizza'),
      item('bp-25', 'Paneer Manchurian Pizza', '250', 'burgerPizza'),
      item('bp-26', 'Paneer Makhani Pizza', '250', 'burgerPizza'),
      item('bp-27', 'Paneer Tikka Pizza', '250', 'burgerPizza'),
      item('bp-28', 'Special Corn Pizza', '250', 'burgerPizza'),
    ],
  },
  sandwichSalad: {
    name: 'Sandwich & Salad',
    shortDescription: 'Salads & sandwiches.',
    icon: '🥪',
    image: categoryImages.sandwichSalad,
    items: [
      item('ss-1', 'Protein Rich Salad (Broccoli, Iceberg, Corn, Mushroom)', '150', 'sandwichSalad'),
      item('ss-2', 'Protein Rich Salad (Corn, Tomato, Onion, Cucumber, Carrot With Paneer)', '150', 'sandwichSalad'),
      item('ss-3', 'Multigrain Bread Sandwich', '100', 'sandwichSalad'),
      item('ss-4', 'Peanut Butter Sandwich', '100', 'sandwichSalad'),
      item('ss-5', 'Brown Bread Sandwich (Customise your Sandwich)', '100', 'sandwichSalad'),
      item('ss-6', 'Multigrain Sub', '150', 'sandwichSalad'),
      item('ss-7', 'Multigrain Sub with Paneer / Soya', '150', 'sandwichSalad'),
      item('ss-8', 'Corn Veg Grilled Sandwich', '59', 'sandwichSalad'),
      item('ss-9', 'Coleslaw Sandwich', '69', 'sandwichSalad'),
      item('ss-10', 'Grilled Sandwich Thai', '69', 'sandwichSalad'),
      item('ss-11', 'Italian Sandwich Grilled', '69', 'sandwichSalad'),
      item('ss-12', 'Cheese Toast', '99', 'sandwichSalad'),
      item('ss-13', 'Garlic Bread', '99', 'sandwichSalad'),
      item('ss-14', 'Paneer Manchurian Sandwich', '99', 'sandwichSalad'),
      item('ss-15', 'Zingy Zesty Moroccan Grilled (Paneer/Corn/Mushroom)', '110', 'sandwichSalad'),
      item('ss-16', 'Club Sandwich', '110', 'sandwichSalad'),
      item('ss-17', 'Special Tikki Sandwich', '110', 'sandwichSalad'),
      item('ss-18', 'Grilled Paneer Makhani Sandwich', '99', 'sandwichSalad'),
      item('ss-19', 'Paneer Tikka Grilled Sandwich', '99', 'sandwichSalad'),
      item('ss-20', 'French Cheese Sandwich', '100', 'sandwichSalad'),
    ],
  },
  momos: {
    name: 'Momos',
    shortDescription: 'Steam, fried or pan fried. Half/Full portions.',
    icon: '🥟',
    image: categoryImages.momos,
    items: [
      item('mo-1', 'Veg Classic Momos (Steam)', '80/110', 'momos', 'Half/Full'),
      item('mo-2', 'Chilli Paneer Momos (Steam)', '90/140', 'momos', 'Half/Full'),
      item('mo-3', 'Pure Paneer Momos (Steam)', '100/150', 'momos', 'Half/Full'),
      item('mo-4', 'Veg Classic Momos (Fried)', '80/120', 'momos', 'Half/Full'),
      item('mo-5', 'Chilli Paneer Momos (Fried)', '100/140', 'momos', 'Half/Full'),
      item('mo-6', 'Pure Paneer Momos (Fried)', '100/160', 'momos', 'Half/Full'),
      item('mo-7', 'Veg Classic Momos (Pan Fried)', '80/140', 'momos', 'Half/Full'),
      item('mo-8', 'Chilli Paneer Momos (Pan Fried)', '100/160', 'momos', 'Half/Full'),
      item('mo-9', 'Pure Paneer Momos (Pan Fried)', '100/170', 'momos', 'Half/Full'),
      item('mo-10', 'Kurkure Momos (Steam + Fried + Pan Fried)', '110/200', 'momos', 'Half/Full'),
      item('mo-11', 'Afghani Momos (Steam + Fried + Pan Fried)', '110/200', 'momos', 'Half/Full'),
      item('mo-12', 'Momo Platter (9 pcs)', '240', 'momos'),
    ],
  },
  pastaMaggiFries: {
    name: 'Pasta, Maggi & Fries',
    shortDescription: 'Pasta, Maggi and Belgium fries.',
    icon: '🍝',
    image: categoryImages.pastaMaggiFries,
    items: [
      item('pm-1', 'Pasta White/Red', '150', 'pastaMaggiFries'),
      item('pm-2', 'Mixed Pasta', '150', 'pastaMaggiFries'),
      item('pm-3', 'Baked Pasta', '200', 'pastaMaggiFries'),
      item('pm-4', 'Pasta with Garlic Bread', '200', 'pastaMaggiFries'),
      item('pm-5', 'Cheese Garlic Bread (3 pcs)', '110', 'pastaMaggiFries'),
      item('pm-6', 'Vegetable Maggi', '60', 'pastaMaggiFries'),
      item('pm-7', 'Schezwan Maggi', '60', 'pastaMaggiFries'),
      item('pm-8', 'Paneer Maggi', '70', 'pastaMaggiFries'),
      item('pm-9', 'Baked Maggi', '100', 'pastaMaggiFries'),
      item('pm-10', 'Maggi Tadka', '80', 'pastaMaggiFries'),
      item('pm-11', 'Corn & Paneer Maggi', '90', 'pastaMaggiFries'),
      item('pm-12', 'Cheese Maggi', '90', 'pastaMaggiFries'),
      item('pm-13', 'Finger Chips', '100', 'pastaMaggiFries'),
      item('pm-14', 'Fries Peri Peri', '120', 'pastaMaggiFries'),
      item('pm-15', 'Masala Fries with Cheese', '140', 'pastaMaggiFries'),
      item('pm-16', 'Mexican Salsa Fries', '140', 'pastaMaggiFries'),
      item('pm-17', 'Loaded Fries', '150', 'pastaMaggiFries'),
    ],
  },
  healthyDrinks: {
    name: 'Healthy Drinks',
    shortDescription: 'Nimbu pani, Rooh Afza, chia seeds and more.',
    icon: '🥤',
    image: categoryImages.healthyDrinks,
    items: [
      item('hd-1', 'Nimbu Pani', '80', 'healthyDrinks'),
      item('hd-2', 'Fresh Lime Soda', '80', 'healthyDrinks'),
      item('hd-3', 'Rooh Afza', '80', 'healthyDrinks'),
      item('hd-4', 'Rooh Afza with Fresh Lemon', '90', 'healthyDrinks'),
      item('hd-5', 'Chia Seeds Shakes', '100', 'healthyDrinks'),
      item('hd-6', 'Fresh Lemon Water with Chia Seeds', '90', 'healthyDrinks'),
      item('hd-7', 'Fresh Lemon Soda with Chia Seeds', '100', 'healthyDrinks'),
      item('hd-8', 'Date Smoothie with Oats', '140', 'healthyDrinks'),
      item('hd-9', 'Banana & Dates Smoothie', '140', 'healthyDrinks'),
      item('hd-10', 'Banana & Oats with Honey', '140', 'healthyDrinks'),
      item('hd-11', 'Date & Choco Smoothie', '140', 'healthyDrinks'),
      item('hd-12', 'Healthy Chocolate Banana Smoothie', '140', 'healthyDrinks'),
      item('hd-13', 'Peanut Butter Banana Smoothie (Almond Milk)', '140', 'healthyDrinks'),
    ],
  },
  wraps: {
    name: 'Wraps',
    shortDescription: 'Masala chaap, mushroom, veg, corn and paneer wraps.',
    icon: '🌯',
    image: categoryImages.wraps,
    items: [
      item('wr-1', 'Masala Chaap Wraps', '110', 'wraps'),
      item('wr-2', 'Mushroom Wraps', '100', 'wraps'),
      item('wr-3', 'Veg Wraps', '100', 'wraps'),
      item('wr-4', 'Corn Wraps', '100', 'wraps'),
      item('wr-5', 'Paneer Tikka Wraps', '120', 'wraps'),
      item('wr-6', 'Paneer Manchurian Wrap', '130', 'wraps'),
      item('wr-7', 'Vegetable Cheese Wrap', '130', 'wraps'),
      item('wr-8', 'Zingy Zesty Moroccan Grilled Wrap (Paneer/Corn/Mushroom)', '130', 'wraps'),
    ],
  },
  mojitosSmoothies: {
    name: 'Mojitos & Smoothies',
    shortDescription: 'Mojitos and healthy smoothies.',
    icon: '🍹',
    image: categoryImages.mojitosSmoothies,
    items: [
      item('ms-1', 'Lemon Ice Tea', '100', 'mojitosSmoothies'),
      item('ms-2', 'Peach Ice Tea', '100', 'mojitosSmoothies'),
      item('ms-3', 'Kiwi Mojito', '100', 'mojitosSmoothies'),
      item('ms-4', 'Black Currant Mojito', '100', 'mojitosSmoothies'),
      item('ms-5', 'Mix Berries Mojito', '100', 'mojitosSmoothies'),
      item('ms-6', 'Strawberry Mojito', '100', 'mojitosSmoothies'),
      item('ms-7', 'Blue Cancans Mojito', '100', 'mojitosSmoothies'),
      item('ms-8', 'Lemon Mojito', '100', 'mojitosSmoothies'),
      item('ms-9', 'Green Apple Mojito', '100', 'mojitosSmoothies'),
      item('ms-10', 'Litchi Mojito', '100', 'mojitosSmoothies'),
      item('ms-11', 'Paan Mojito', '100', 'mojitosSmoothies'),
      item('ms-12', 'Mulberry Mojito', '100', 'mojitosSmoothies'),
    ],
  },
  shakesIceCream: {
    name: 'Shakes & Ice Cream',
    shortDescription: 'Shakes and ice cream.',
    icon: '🍦',
    image: categoryImages.shakesIceCream,
    items: [
      item('si-1', 'Mulberry Shake', '110', 'shakesIceCream'),
      item('si-2', 'Cold Coffee', '110', 'shakesIceCream'),
      item('si-3', 'Mango Shake', '110', 'shakesIceCream'),
      item('si-4', 'Strawberry Shake', '110', 'shakesIceCream'),
      item('si-5', 'Kiwi Shake', '110', 'shakesIceCream'),
      item('si-6', 'Butter Scotch Shake', '110', 'shakesIceCream'),
      item('si-7', 'Banana Shake', '110', 'shakesIceCream'),
      item('si-8', 'Vanilla Shake', '110', 'shakesIceCream'),
      item('si-9', 'Chocolate Cookie Shake', '110', 'shakesIceCream'),
      item('si-10', 'Oreo Shake', '110', 'shakesIceCream'),
      item('si-11', 'Bubblegum Shake', '110', 'shakesIceCream'),
      item('si-12', 'Kit-Kat Shake', '110', 'shakesIceCream'),
      item('si-13', 'Cold Coffee with Ice Cream', '110', 'shakesIceCream'),
      item('si-14', 'Choco Brownie Shake', '120', 'shakesIceCream'),
      item('si-15', 'Ice Cream (Real Strawberry/Pineapple/Mix Berries)', '90', 'shakesIceCream'),
      item('si-16', 'Hot Chocolate', '130', 'shakesIceCream'),
      item('si-17', 'Fruit Cocktail', '140', 'shakesIceCream'),
      item('si-18', 'Choco Brownie with Ice Cream', '120', 'shakesIceCream'),
    ],
  },
  starters: {
    name: 'Spring Rolls & Appetizers',
    shortDescription: 'Spring rolls and appetizers/snacks.',
    icon: '🥡',
    image: categoryImages.starters,
    items: [
      item('st-1', 'Vegetables Spring Rolls', '70', 'starters'),
      item('st-2', 'Kurkure Spring Rolls', '150', 'starters'),
      item('st-3', 'Paneer Corn Spring Rolls', '150', 'starters'),
      item('st-4', 'Paneer Corn Kurkure Spring Rolls', '150', 'starters'),
      item('st-5', 'Masala Sweet Corn', '150', 'starters'),
      item('st-6', 'Crispy Corn', '150', 'starters'),
      item('st-7', 'Veg Manchurian Dry', '180', 'starters'),
      item('st-8', 'Chilli Paneer Dry', '120', 'starters'),
      item('st-9', 'Chilli Mushroom', '120', 'starters'),
      item('st-10', 'Kurkure Paneer Fingers', '180', 'starters'),
      item('st-11', 'Crispy Baby Corn', '150', 'starters'),
      item('st-12', 'Chilli Soya', '260', 'starters'),
      item('st-13', 'Kurkure Soya Nuggets', '150', 'starters'),
      item('st-14', 'Loaded Cheesy Nachos', '110', 'starters'),
      item('st-15', 'Honey Chilli Potato', '130', 'starters'),
      item('st-16', 'Lotus Stem Honey Chilli', '140', 'starters'),
      item('st-17', 'Chilli Potato', '150', 'starters'),
      item('st-18', 'Veg Masala Chaap', '160', 'starters'),
      item('st-19', 'Paneer Manchurian Dry', '170', 'starters'),
    ],
  },
  hotBeverages: {
    name: 'Hot Beverages',
    shortDescription: 'Coffee, tea and winter specials.',
    icon: '☕',
    image: categoryImages.hotBeverages,
    items: [
      item('hb-1', 'Coffee', '40', 'hotBeverages'),
      item('hb-2', 'Tea', '30', 'hotBeverages'),
      item('hb-3', 'Organic Tea', '40', 'hotBeverages'),
      item('hb-4', 'Lemon Tea', '40', 'hotBeverages'),
      item('hb-5', 'Shashi Qawah (Winter Special)', '60', 'hotBeverages'),
    ],
  },
  riceNoodlesSoups: {
    name: 'Rice, Noodles & Soups',
    shortDescription: 'Fried rice, noodles and soups.',
    icon: '🍜',
    image: categoryImages.riceNoodlesSoups,
    items: [
      item('rn-1', 'Veg Fried Rice', '100', 'riceNoodlesSoups'),
      item('rn-2', 'Golden Corn Fried Rice', '100', 'riceNoodlesSoups'),
      item('rn-3', 'Exotic Vegetable Fried Rice', '100', 'riceNoodlesSoups'),
      item('rn-4', 'Veg Special Noodles', '100', 'riceNoodlesSoups'),
      item('rn-5', 'Chilli Garlic Noodles', '100', 'riceNoodlesSoups'),
      item('rn-6', 'Schezwan Noodles', '130', 'riceNoodlesSoups'),
      item('rn-7', 'Vegetable Paneer Noodles', '150', 'riceNoodlesSoups'),
      item('rn-8', 'Exotic Vegetable Noodles', '150', 'riceNoodlesSoups'),
      item('rn-9', 'Veg Corn Soup', '180', 'riceNoodlesSoups'),
      item('rn-10', 'Manchow Soup', '200', 'riceNoodlesSoups'),
      item('rn-11', "Hot 'n' Sour Soup", '260', 'riceNoodlesSoups'),
      item('rn-12', 'Exotic Vegetables Healthy Soup', '290', 'riceNoodlesSoups'),
      item('rn-13', 'Lemon Coriander Soup', '320', 'riceNoodlesSoups'),
    ],
  },
  combos: {
    name: 'Combos',
    shortDescription: 'Burger, wrap, momos and Chinese platter combos.',
    icon: '🍱',
    image: categoryImages.combos,
    items: [
      item('co-1', 'Special Burger + Coke', '150', 'combos'),
      item('co-2', 'Paneer Tikka Wrap + Coke', '170', 'combos'),
      item('co-3', 'Crispy Paneer Burger + Coke', '190', 'combos'),
      item('co-4', 'Multigrain Healthy Sandwich + Fresh Lime Soda', '150', 'combos'),
      item('co-5', 'Veg Cheese Wrap + Coke', '150', 'combos'),
      item('co-6', 'Kurkure Veg Momos + Coke', '160', 'combos'),
      item('co-7', 'Pasta (Red/White) + Garlic Bread', '180', 'combos'),
      item('co-8', 'Chinese Platter (Spring Roll, Momos 4pcs, Honey Chilli Potato)', '180', 'combos'),
      item('co-9', 'Veg Fried Rice/Noodles With Veg Manchurian', '150', 'combos'),
      item('co-10', 'Chilli Paneer With Noodles/Fried Rice', '150', 'combos'),
    ],
  },
  mainCourse: {
    name: 'Main Course & Gravy',
    shortDescription: 'Gravy, rice plate, pulao and special Indian combos.',
    icon: '🍛',
    image: categoryImages.mainCourse,
    items: [
      item('mc-1', 'Vegetables in Hot Garlic Sauce', '130', 'mainCourse'),
      item('mc-2', 'Vegetables in Mushroom & Oyster Sauce', '150', 'mainCourse'),
      item('mc-3', 'Vegetables Manchurian Gravy', '150', 'mainCourse'),
      item('mc-4', 'Veg Rogan Josh With Punjabi Kulcha', '130', 'mainCourse'),
      item('mc-5', 'Chilly Paneer Gravy', '110', 'mainCourse'),
      item('mc-6', 'Jammu Ke Rajhma', '110', 'mainCourse'),
      item('mc-7', 'Kashmiri Palak Paneer', '120', 'mainCourse'),
      item('mc-8', 'Palak Corn', '60', 'mainCourse'),
      item('mc-9', 'Kabuli Chana', '60', 'mainCourse'),
      item('mc-10', 'Vegetarian Masala Chaap', '110', 'mainCourse'),
      item('mc-11', 'Rice Plate', '140', 'mainCourse'),
      item('mc-12', 'Vegetarian Pulao', '140', 'mainCourse'),
      item('mc-13', 'Mixed Raita', '110', 'mainCourse'),
      item('mc-14', 'Rajhma + Rice', '130', 'mainCourse'),
      item('mc-15', 'Palak Paneer + Veg Pulao', '140', 'mainCourse'),
      item('mc-16', 'Palak Corn + Veg Pulao', '110', 'mainCourse'),
      item('mc-17', 'Kabuli Chana + Rice', '110', 'mainCourse'),
      item('mc-18', 'Tuesday Special Curry Pakora + Rice', '60', 'mainCourse'),
      item('mc-19', 'Veg Special Chaap + Rice', '150', 'mainCourse'),
      item('mc-20', 'Veg Chaap + Kulcha', '220', 'mainCourse'),
      item('mc-21', 'Dahi Bhalla', '160', 'mainCourse'),
      item('mc-22', 'Lassi Sweet/Salty', '240', 'mainCourse'),
      item('mc-23', 'Rajhma Dip Kulcha', '180', 'mainCourse'),
      item('mc-24', 'Chana Dip Kulcha', '250', 'mainCourse'),
    ],
  },
  thali: {
    name: 'Thali',
    shortDescription: 'Full thali with raita, roti, vegetables and rice.',
    icon: '🍽️',
    image: categoryImages.thali,
    items: [
      item('th-1', 'Thali With Raita + Sweet Dish + 2 Tawa Roti + 2 Vegetable Dishes + Paneer Dish + Veg Pulao', '210', 'thali'),
      item('th-2', 'Thali With Raita & 2 Tawa Roti + 2 Dishes + 1 Paneer + Rice', '180', 'thali'),
    ],
  },
}

export function generateWhatsAppOrderMessage(item: MenuItem): string {
  return `Hi Mango, I would like to order:

${item.name}
${item.quantity} – ${item.price}

Please confirm availability. Thank you!`
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export function generateWhatsAppCartMessage(cartItems: CartItem[], totalPrice: number): string {
  const itemsList = cartItems
    .map((item) => {
      const priceStr = item.price.replace('₹', '').replace(',', '')
      const unitPrice = parseFloat(priceStr.replace(/\/.*/, '').trim())
      const totalItemPrice = (isNaN(unitPrice) ? 0 : unitPrice) * item.cartQuantity
      return `• ${item.name}\n  ${item.quantity} × ${item.cartQuantity} = ₹${totalItemPrice.toFixed(0)}`
    })
    .join('\n\n')

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)

  return `Hi Mango, I would like to place an order:

${itemsList}

━━━━━━━━━━━━━━━━━━━━
Total items: ${totalItemsCount}
Estimated total: ₹${totalPrice.toFixed(0)}
━━━━━━━━━━━━━━━━━━━━

Please confirm availability and final price. Thank you!`
}
