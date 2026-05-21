/**
 * Full daily ordering menu — transcribed from Affy's official menu PDF.
 *
 * Variants are litre-based for stews / rice / soups, piece-based for
 * protein / pastries / small chops, and a mix for sides. Each variant
 * exposes a `serves` hint where relevant.
 */

export interface MenuVariant {
  size: string;
  serves?: string;
  price: number;
}

export interface DishImage {
  url: string;
  alt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  namePt?: string;
  description: string;
  category: MenuCategory;
  variants: MenuVariant[];
  monogram: string;
  gradient: string;
  /** Rich fields (optional — populated from the database when present). */
  longDescription?: string;
  ingredients?: string[];
  spiceLevels?: string[];
  videoUrl?: string;
  images?: DishImage[];
  isWeeklySpecial?: boolean;
}

/** The spice levels Affy offers (preference only — no price change). */
export const SPICE_LEVELS = ["mild", "spicy", "hot", "extra"] as const;
export type SpiceLevel = (typeof SPICE_LEVELS)[number];

/** Heat dots (filled count) for each level — for the spice-picker visual. */
export const SPICE_HEAT: Record<SpiceLevel, number> = {
  mild: 1,
  spicy: 2,
  hot: 3,
  extra: 4,
};

export type MenuCategory =
  | "Rice dishes"
  | "Stews"
  | "Sauces"
  | "Soups"
  | "Peppersoups"
  | "Traditional dishes"
  | "Specials"
  | "Sides"
  | "Protein"
  | "Swallows"
  | "Pastries & small chops";

export const MENU_CATEGORIES: MenuCategory[] = [
  "Rice dishes",
  "Stews",
  "Sauces",
  "Soups",
  "Peppersoups",
  "Traditional dishes",
  "Specials",
  "Sides",
  "Protein",
  "Swallows",
  "Pastries & small chops",
];

/** Standard variant sets that repeat across the menu. */
const TRAY_SERVINGS = [
  { size: "2 Litres", serves: "Feeds 3–4" },
  { size: "3 Litres", serves: "Feeds 5" },
  { size: "4 Litres", serves: "Feeds 6–7" },
];

const PIECE_SERVINGS_5_10_15 = [
  { size: "5 pcs", serves: "Small" },
  { size: "10 pcs", serves: "Medium" },
  { size: "15 pcs", serves: "Large" },
];

const PIECE_SERVINGS_3_5_10 = [
  { size: "3 pcs", serves: "Small" },
  { size: "5 pcs", serves: "Medium" },
  { size: "10 pcs", serves: "Large" },
];

const PUFF_PUFF_SERVINGS = [
  { size: "15 pcs", serves: "Small" },
  { size: "30 pcs", serves: "Medium" },
  { size: "50 pcs", serves: "Large" },
];

const SIDES_SERVINGS = [
  { size: "1L", serves: "Feeds 2" },
  { size: "2L", serves: "Feeds 4–5" },
  { size: "3L", serves: "Feeds 6" },
];

const PASTA_SERVINGS = [
  { size: "1L", serves: "Feeds 2" },
  { size: "2L", serves: "Feeds 4–5" },
  { size: "3L", serves: "Feeds 6" },
];

/** Tray-style menu helper. */
function trayVariants(prices: [number, number, number]): MenuVariant[] {
  return TRAY_SERVINGS.map((s, i) => ({ ...s, price: prices[i] }));
}

function pieceVariants(
  servings: { size: string; serves?: string }[],
  prices: [number, number, number],
): MenuVariant[] {
  return servings.map((s, i) => ({ ...s, price: prices[i] }));
}

// ===========================================================================
// Gradients — small palette to keep visual variety without going random
// ===========================================================================

const G = {
  red: "from-red via-red-soft to-espresso",
  redDeep: "from-red via-espresso to-forest",
  forest: "from-forest via-forest-soft to-espresso",
  forestDeep: "from-forest via-espresso to-red",
  gold: "from-gold via-gold-deep to-espresso",
  espresso: "from-espresso via-espresso-soft to-red",
};

// ===========================================================================
// Menu
// ===========================================================================

export const MENU_ITEMS: MenuItem[] = [
  // ----- Rice dishes -----
  {
    id: "jollof",
    name: "Jollof Rice",
    namePt: "Arroz Jollof à Nigeriana",
    description: "The legendary naija spiced tomato-infused rice.",
    category: "Rice dishes",
    variants: trayVariants([28, 42, 55]),
    monogram: "J",
    gradient: G.red,
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    namePt: "Arroz Frito com Legumes e Moelas",
    description: "Stir-fried rice with veggies and gizzard.",
    category: "Rice dishes",
    variants: trayVariants([30.5, 45.5, 60]),
    monogram: "F",
    gradient: G.gold,
  },
  {
    id: "native-rice",
    name: "Native Rice",
    namePt: "Arroz Tradicional",
    description: "Aromatic rice combo with dried fish, prawns, snail, vegetables and herbs.",
    category: "Rice dishes",
    variants: trayVariants([45.5, 68, 90]),
    monogram: "N",
    gradient: G.redDeep,
  },
  {
    id: "toast-beef-rice",
    name: "Toast Beef Rice",
    namePt: "Arroz Salteado com Carne de Vaca",
    description: "Rice with savory toasted beef chunks.",
    category: "Rice dishes",
    variants: trayVariants([35, 52, 70]),
    monogram: "T",
    gradient: G.espresso,
  },
  {
    id: "coconut-rice",
    name: "Coconut Rice",
    namePt: "Arroz de Coco",
    description: "Rice prepared with coconut cream and dried fish.",
    category: "Rice dishes",
    variants: trayVariants([35, 52, 70]),
    monogram: "C",
    gradient: G.forest,
  },
  {
    id: "plain-white-rice",
    name: "Plain White Rice",
    namePt: "Arroz Branco Simples",
    description: "Parboiled long grain / Basmati rice — steamed.",
    category: "Rice dishes",
    variants: trayVariants([30, 45, 60]),
    monogram: "P",
    gradient: G.gold,
  },

  // ----- Stews -----
  {
    id: "chicken-stew",
    name: "Chicken Stew",
    namePt: "Guisado de Frango à Nigeriana",
    description: "Tomato-based stew with juicy, spiced chicken.",
    category: "Stews",
    variants: trayVariants([40, 60, 80]),
    monogram: "C",
    gradient: G.red,
  },
  {
    id: "turkey-stew",
    name: "Turkey Stew",
    namePt: "Guisado de Peru à Nigeriana",
    description: "Tender turkey, marinated and slow-cooked.",
    category: "Stews",
    variants: trayVariants([40, 60, 80]),
    monogram: "T",
    gradient: G.espresso,
  },
  {
    id: "fish-stew",
    name: "Fish Stew",
    namePt: "Guisado de Peixe à Nigeriana",
    description: "Tomato-based stew with grilled/fried fish cutlets.",
    category: "Stews",
    variants: trayVariants([45, 67, 90]),
    monogram: "F",
    gradient: G.forestDeep,
  },
  {
    id: "beef-stew",
    name: "Beef Stew",
    namePt: "Guisado de Carne de Vaca à Nigeriana",
    description: "Tomato-based stew with tender beef chunks.",
    category: "Stews",
    variants: trayVariants([40, 60, 80]),
    monogram: "B",
    gradient: G.redDeep,
  },
  {
    id: "goat-meat-stew",
    name: "Goat Meat Stew",
    namePt: "Guisado de Cabrito à Nigeriana",
    description: "Tomato-based stew with soft goat meat chunks.",
    category: "Stews",
    variants: trayVariants([50, 75, 99]),
    monogram: "G",
    gradient: G.red,
  },
  {
    id: "buka-stew",
    name: "Buka Stew",
    namePt: "Guisado à Buka (Molho de Pimentos Assados)",
    description: "Street-style tomato stew in palm oil with mixed proteins.",
    category: "Stews",
    variants: trayVariants([40, 60, 80]),
    monogram: "B",
    gradient: G.gold,
  },

  // ----- Sauces -----
  {
    id: "chicken-curry",
    name: "Chicken Curry",
    namePt: "Molho de Frango com Caril",
    description: "Mild curry sauce with tender chicken and sweet peppers.",
    category: "Sauces",
    variants: trayVariants([30, 45, 60]),
    monogram: "C",
    gradient: G.gold,
  },
  {
    id: "ayamase-sauce",
    name: "Ayamase Sauce",
    namePt: "Molho de Pimentos Verde Ayamase",
    description: "Spicy green pepper sauce with assorted meats and boiled egg.",
    category: "Sauces",
    variants: trayVariants([40, 60, 79.5]),
    monogram: "A",
    gradient: G.forest,
  },
  {
    id: "ofada-sauce",
    name: "Ofada Sauce",
    namePt: "Molho de Pimentos Vermelhos Ofada",
    description: "Rich red pepper mix sauce with assorted meats and palm oil.",
    category: "Sauces",
    variants: trayVariants([40, 60, 79.5]),
    monogram: "O",
    gradient: G.red,
  },

  // ----- Soups -----
  {
    id: "vegetable-soup",
    name: "Vegetable Soup",
    namePt: "Sopa de Espinafres (Efo Riro / Edikaikong)",
    description: "Leafy greens in rich soup with mixed protein.",
    category: "Soups",
    variants: trayVariants([49.5, 75, 98]),
    monogram: "V",
    gradient: G.forest,
  },
  {
    id: "egusi-soup",
    name: "Egusi Soup",
    namePt: "Sopa de Sementes de Melão",
    description: "Melon-seed soup with mixed protein and palm oil.",
    category: "Soups",
    variants: trayVariants([49.5, 75, 98]),
    monogram: "E",
    gradient: G.gold,
  },
  {
    id: "ogbono-soup",
    name: "Ogbono Soup",
    namePt: "Sopa de Sementes Dika",
    description: "Soup with ogbono seeds, leafy greens and mixed protein.",
    category: "Soups",
    variants: trayVariants([49.5, 75, 98]),
    monogram: "O",
    gradient: G.espresso,
  },
  {
    id: "afang-soup",
    name: "Afang Soup",
    namePt: "Sopa de Folhas de Eru",
    description: "Soup with afang leaves and mixed protein — regional specialty.",
    category: "Soups",
    variants: trayVariants([55, 82.5, 109]),
    monogram: "A",
    gradient: G.forest,
  },
  {
    id: "bitterleaf-soup",
    name: "Bitterleaf Soup",
    namePt: "Sopa de Folha Amarga (Ofe Onugbu)",
    description: "Traditional soup with bitterleaf greens and mixed protein.",
    category: "Soups",
    variants: trayVariants([55, 82.5, 109]),
    monogram: "B",
    gradient: G.forestDeep,
  },
  {
    id: "banga-soup",
    name: "Banga Soup / Ofe Akwu",
    namePt: "Sopa de Fruto da Palmeira",
    description: "Aromatic soup with palm-fruit extracts and mixed protein.",
    category: "Soups",
    variants: trayVariants([55, 82.5, 109]),
    monogram: "B",
    gradient: G.red,
  },
  {
    id: "fisherman-soup",
    name: "Fisherman Soup",
    namePt: "Sopa de Pescador",
    description: "Native soup loaded with fresh seafood and palm oil.",
    category: "Soups",
    variants: trayVariants([65, 97.5, 130]),
    monogram: "F",
    gradient: G.espresso,
  },
  {
    id: "seafood-okra-soup",
    name: "Seafood Okra Soup",
    namePt: "Sopa de Quiabos com Marisco",
    description: "Okra soup loaded with fresh seafood — prawns and more.",
    category: "Soups",
    variants: trayVariants([60, 79.5, 109]),
    monogram: "O",
    gradient: G.forest,
  },

  // ----- Peppersoups -----
  {
    id: "chicken-peppersoup",
    name: "Chicken Peppersoup",
    namePt: "Caldo de Frango Picante",
    description: "Spicy soup with herbs and soft chicken parts.",
    category: "Peppersoups",
    variants: trayVariants([25.5, 38, 50]),
    monogram: "C",
    gradient: G.red,
  },
  {
    id: "turkey-peppersoup",
    name: "Turkey Peppersoup",
    namePt: "Caldo de Peru Picante",
    description: "Spicy soup with herbs and soft turkey parts.",
    category: "Peppersoups",
    variants: trayVariants([30, 45, 60]),
    monogram: "T",
    gradient: G.gold,
  },
  {
    id: "catfish-peppersoup",
    name: "Catfish Peppersoup",
    namePt: "Caldo de Bagre Picante",
    description: "Spicy soup with herbs and catfish cutlets.",
    category: "Peppersoups",
    variants: trayVariants([35, 49.5, 49.5]),
    monogram: "C",
    gradient: G.forestDeep,
  },
  {
    id: "goat-peppersoup",
    name: "Goat / Assorted Peppersoup",
    namePt: "Caldo de Cabra e Variadas Picante",
    description: "Spicy soup with herbs, goat or assorted meat parts.",
    category: "Peppersoups",
    variants: trayVariants([40, 60, 80]),
    monogram: "G",
    gradient: G.redDeep,
  },

  // ----- Traditional dishes -----
  {
    id: "abacha",
    name: "Abacha",
    namePt: "Salada de Mandioca",
    description: "Grated cassava salad with palm oil, dried fish, and traditional spices.",
    category: "Traditional dishes",
    variants: trayVariants([45, 67.5, 90]),
    monogram: "A",
    gradient: G.gold,
  },
  {
    id: "bole-and-fish",
    name: "Bole & Fish",
    namePt: "Banana-Pão Grelhada com Peixe",
    description: "Plantain and grilled fish, with a spicy pepper-and-onion mix.",
    category: "Traditional dishes",
    variants: trayVariants([45, 67.5, 90]),
    monogram: "B",
    gradient: G.red,
  },
  {
    id: "beans-pottage",
    name: "Beans Pottage",
    namePt: "Feijoada à Nigeriana",
    description: "Sweet honey beans cooked slowly in a rich palm-oil pepper sauce.",
    category: "Traditional dishes",
    variants: trayVariants([25, 37.5, 50]),
    monogram: "B",
    gradient: G.forest,
  },
  {
    id: "yam-pottage",
    name: "Yam Pottage / Asaro",
    namePt: "Inhame Estufado à Nigeriana",
    description: "Yam cooked in a flavourful vegetable + dried-fish sauce.",
    category: "Traditional dishes",
    variants: trayVariants([35, 52.5, 70]),
    monogram: "Y",
    gradient: G.gold,
  },
  {
    id: "gizdodo",
    name: "Gizdodo",
    namePt: "Moelas com Banana Pão",
    description: "Chicken gizzards & fried plantain in pepper sauce.",
    category: "Traditional dishes",
    variants: trayVariants([30, 45, 60]),
    monogram: "G",
    gradient: G.red,
  },
  {
    id: "asun",
    name: "Asun",
    namePt: "Cabra Grelhado e Picante",
    description: "Grilled goat meat in a rich blend of peppers and onions.",
    category: "Traditional dishes",
    variants: trayVariants([40, 60.5, 80]),
    monogram: "A",
    gradient: G.redDeep,
  },

  // ----- Specials -----
  {
    id: "affys-special-pasta",
    name: "Affy's Special Pasta",
    namePt: "Massa Especial da Affy's",
    description: "Pasta sautéed with our secret touch, fresh vegetables, and protein of your choice.",
    category: "Specials",
    variants: PASTA_SERVINGS.map((s, i) => ({ ...s, price: [15, 30, 45][i] })),
    monogram: "S",
    gradient: G.gold,
  },

  // ----- Sides -----
  {
    id: "fried-plantains",
    name: "Fried Plantains",
    namePt: "Banana Pão Frita (Dodo)",
    description: "Slices of fried ripe plantain, golden and caramelized.",
    category: "Sides",
    variants: SIDES_SERVINGS.map((s, i) => ({ ...s, price: [7, 15, 20][i] })),
    monogram: "D",
    gradient: G.gold,
  },
  {
    id: "coleslaw",
    name: "Coleslaw Salad",
    namePt: "Salada de Repolho",
    description: "Refreshing and crunchy blend of veggies with a creamy sauce.",
    category: "Sides",
    variants: SIDES_SERVINGS.map((s, i) => ({ ...s, price: [7, 15, 20][i] })),
    monogram: "C",
    gradient: G.forest,
  },

  // ----- Protein -----
  {
    id: "moi-moi",
    name: "Moi-Moi",
    namePt: "Pudim Salgado de Feijão",
    description: "Steamed bean cake — soft, spicy, comforting.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [25, 50, 75]),
    monogram: "M",
    gradient: G.red,
  },
  {
    id: "chicken-drumsticks",
    name: "Chicken (drumsticks / thighs)",
    namePt: "Frango (Coxas/Sobrecoxas)",
    description: "Grilled, fried or sauced chicken.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [15, 30, 45]),
    monogram: "C",
    gradient: G.gold,
  },
  {
    id: "chicken-quarters",
    name: "Chicken Quarters",
    namePt: "Frango (Quarto)",
    description: "Grilled, fried or sauced chicken quarters.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [17.5, 35, 51.5]),
    monogram: "Q",
    gradient: G.gold,
  },
  {
    id: "turkey-drumette",
    name: "Turkey (drumette / wingette)",
    namePt: "Peru (Asa ou Coxa)",
    description: "Grilled, fried or sauced turkey.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [17.5, 35, 51.5]),
    monogram: "T",
    gradient: G.red,
  },
  {
    id: "beef",
    name: "Beef",
    namePt: "Carne de Vaca",
    description: "Fried or stewed beef chunks.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [15, 30, 45]),
    monogram: "B",
    gradient: G.espresso,
  },
  {
    id: "fish",
    name: "Fish",
    namePt: "Peixe",
    description: "Grilled, fried or sauced fish cutlets.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [19.5, 39, 57.5]),
    monogram: "F",
    gradient: G.forest,
  },
  {
    id: "goat-lamb",
    name: "Goat Meat / Lamb",
    namePt: "Cabra / Borrego",
    description: "Grilled or stewed goat meat or lamb.",
    category: "Protein",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [17, 35, 50]),
    monogram: "G",
    gradient: G.redDeep,
  },

  // ----- Swallows -----
  {
    id: "eba",
    name: "Eba",
    namePt: "Massa de Mandioca Torrada",
    description: "Smooth cassava swallow, perfect with any soup.",
    category: "Swallows",
    variants: pieceVariants(PIECE_SERVINGS_3_5_10, [7.5, 12.5, 25]),
    monogram: "E",
    gradient: G.gold,
  },
  {
    id: "poundo",
    name: "Poundo",
    namePt: "Massa de Inhame Pilado",
    description: "Soft yam/potato swallow, perfect with any soup.",
    category: "Swallows",
    variants: pieceVariants(PIECE_SERVINGS_3_5_10, [9, 15, 30]),
    monogram: "P",
    gradient: G.forest,
  },

  // ----- Pastries & small chops -----
  {
    id: "meatpie",
    name: "Meatpie",
    namePt: "Pastéis de Carne",
    description: "Golden flaky pastry filled with minced meat and veggies.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [17.5, 35, 52.5]),
    monogram: "M",
    gradient: G.gold,
  },
  {
    id: "chickenpie",
    name: "Chickenpie",
    namePt: "Pastéis de Frango",
    description: "Golden flaky pastry stuffed with seasoned chicken and veggies.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [18.5, 37, 54.5]),
    monogram: "C",
    gradient: G.gold,
  },
  {
    id: "fishroll",
    name: "Fish Roll",
    namePt: "Enrolados de Peixe",
    description: "Golden flaky pastry roll filled with fish.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [18.5, 38, 54.5]),
    monogram: "F",
    gradient: G.red,
  },
  {
    id: "sausageroll",
    name: "Sausage Roll",
    namePt: "Enrolados de Salsicha",
    description: "Golden flaky pastry roll filled with beef sausage.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [18.5, 38, 54.5]),
    monogram: "S",
    gradient: G.espresso,
  },
  {
    id: "springroll",
    name: "Spring Roll",
    namePt: "Chamuça de Legumes ou Carne",
    description: "Crunchy roll wrap filled with protein and veggies.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [7.5, 15, 22.5]),
    monogram: "S",
    gradient: G.forest,
  },
  {
    id: "samosa",
    name: "Samosa",
    namePt: "Chamuça (Triângulos)",
    description: "Triangle crunchy pastry filled with protein and veggies.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [7.5, 15, 22.5]),
    monogram: "S",
    gradient: G.gold,
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    namePt: "Asinhas de Frango",
    description: "Spicy and flavorful chicken wings.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [5, 10, 15]),
    monogram: "W",
    gradient: G.red,
  },
  {
    id: "suya-skewers",
    name: "Suya Skewers",
    namePt: "Espetadas de Carne",
    description: "Specially spiced and flavorful beef on skewers.",
    category: "Pastries & small chops",
    variants: pieceVariants(PIECE_SERVINGS_5_10_15, [25, 45, 70]),
    monogram: "S",
    gradient: G.redDeep,
  },
  {
    id: "puff-puff",
    name: "Puff Puff",
    namePt: "Bolinhos de Chuva Tradicionais",
    description: "Soft, sweet dough balls.",
    category: "Pastries & small chops",
    variants: pieceVariants(PUFF_PUFF_SERVINGS, [10, 20, 35]),
    monogram: "P",
    gradient: G.gold,
  },
];

/**
 * Lock toggle — set to true during the Portimão festival to disable the
 * normal-ordering menu so festival customers don't accidentally order
 * weekly preorder items. Wire to admin later.
 */
export const NORMAL_ORDERING_LOCKED = false;
export const LOCK_MESSAGE =
  "We're cooking for the Portimão pop-up this week — daily ordering reopens after the festival. Festival bowls available on the Portimão page.";

export const MIN_ORDER_NOTE =
  "Minimum daily/biweekly order is €20. Small orders need 24h notice; large catering orders need 10 days. We deliver across Portugal — fees calculated at checkout.";
