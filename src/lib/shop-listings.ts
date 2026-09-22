export type SellerType = "private" | "shop";

export type ShopListing = {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  image: string;
  seller: string;
  sellerType: SellerType;
  district: string;
  condition: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  frameSize: string;
  description: string;
  phone: string;
  email: string;
  postedAt: string;
};

export const BIKE_IMAGES = [
  "https://images.unsplash.com/photo-1485965120182-f2355695cf85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511994298241-608e28f14d70?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=900&q=80",
];

const DISTRICTS = [
  "Сүхбаатар",
  "Баянзүрх",
  "Чингэлтэй",
  "Хан-Уул",
  "Баянгол",
  "Сонгинохайрхан",
];

const BRANDS = [
  "Giant",
  "Trek",
  "Specialized",
  "Merida",
  "Cannondale",
  "Scott",
  "Cube",
  "Liv",
  "GT",
  "Orbea",
];

const MODELS = [
  "Escape",
  "FX",
  "Sirrus",
  "Crossway",
  "Quick",
  "Aspect",
  "Nature",
  "Alight",
  "Aggregate",
  "Carpe",
];

const SELLERS = [
  "Бат",
  "Сараа",
  "Төмөр",
  "Нараа",
  "Эрдэнэ",
  "Мөнх",
  "Оюун",
  "Ганбат",
  "Дулмаа",
  "Болд",
];

const SHOP_NAMES = [
  "Nomad Cycles",
  "Pedal Mongolia",
  "Wheel Works",
  "Green Path Bikes",
  "Fixie Corner",
];

const CONDITIONS = ["Шинэ", "Маш сайн", "Сайн", "Дунд"];
const COLORS = ["Хар", "Цагаан", "Цэнхэр", "Улаан", "Саарал", "Ногоон"];
const FRAMES = ["S", "M", "L", "XL"];

export const PAGE_SIZE = 50;
export const TOTAL_SEED_LISTINGS = 120;
export const USER_LISTINGS_KEY = "bikereg-shop-listings";

export const VIP_SHOP = {
  name: "BikeReg VIP",
  tagline: "Албан ёсны дэлгүүр · баталгаатай бараа",
  background:
    "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1600&q=80",
  products: [
    {
      id: "vip-1",
      name: "City Cruiser 7",
      price: "₮1,890,000",
      image: BIKE_IMAGES[0],
    },
    {
      id: "vip-2",
      name: "Trail Nomad 29",
      price: "₮2,450,000",
      image: BIKE_IMAGES[1],
    },
    {
      id: "vip-3",
      name: "Fold Compact X",
      price: "₮1,120,000",
      image: BIKE_IMAGES[2],
    },
    {
      id: "vip-4",
      name: "E-assist Lite",
      price: "₮5,600,000",
      image:
        "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "vip-5",
      name: "Road Sprint S",
      price: "₮3,100,000",
      image: BIKE_IMAGES[9],
    },
  ],
};

function formatPrice(value: number) {
  return `₮${value.toLocaleString("en-US")}`;
}

function buildSeedListings(): ShopListing[] {
  return Array.from({ length: TOTAL_SEED_LISTINGS }, (_, index) => {
    const n = index + 1;
    const isShop = index % 4 === 0;
    const brand = BRANDS[index % BRANDS.length];
    const model = MODELS[index % MODELS.length];
    const year = 2016 + (index % 10);
    const priceValue = 450_000 + ((index * 73_000) % 2_800_000);
    const seller = isShop
      ? SHOP_NAMES[index % SHOP_NAMES.length]
      : SELLERS[index % SELLERS.length];
    const phoneTail = String(10000000 + ((index * 137) % 89999999)).padStart(
      8,
      "0",
    );

    return {
      id: `listing-${n}`,
      title: `${brand} ${model} ${year}`,
      price: formatPrice(priceValue),
      priceValue,
      image: BIKE_IMAGES[index % BIKE_IMAGES.length],
      seller,
      sellerType: isShop ? "shop" : "private",
      district: DISTRICTS[index % DISTRICTS.length],
      condition: CONDITIONS[index % CONDITIONS.length],
      brand,
      model,
      year,
      color: COLORS[index % COLORS.length],
      frameSize: FRAMES[index % FRAMES.length],
      description: isShop
        ? `${seller} дэлгүүрийн ${brand} ${model}. Баталгаатай засвар үйлчилгээтэй, шууд харах боломжтой.`
        : `Хувь хүний зар. ${year} оны ${brand} ${model}, ${COLORS[index % COLORS.length]} өнгөтэй. Хурдан холбогдоорой.`,
      phone: `+976 ${phoneTail.slice(0, 4)} ${phoneTail.slice(4)}`,
      email: isShop
        ? `info@${seller.toLowerCase().replace(/\s+/g, "")}.mn`
        : `${seller.toLowerCase()}${n}@mail.mn`,
      postedAt: `2026-0${(index % 9) + 1}-${String((index % 27) + 1).padStart(2, "0")}`,
    };
  });
}

export const VIP_LISTINGS: ShopListing[] = VIP_SHOP.products.map(
  (product, index) => ({
    id: product.id,
    title: product.name,
    price: product.price,
    priceValue: Number(product.price.replace(/[^\d]/g, "")),
    image: product.image,
    seller: VIP_SHOP.name,
    sellerType: "shop",
    district: "Сүхбаатар",
    condition: "Шинэ",
    brand: "BikeReg",
    model: product.name,
    year: 2025,
    color: COLORS[index % COLORS.length],
    frameSize: FRAMES[index % FRAMES.length],
    description: `${VIP_SHOP.name}-ийн албан ёсны бараа. Баталгаа, хүргэлт болон засвар үйлчилгээ орно.`,
    phone: "+976 7700 1122",
    email: "vip@bikereg.mn",
    postedAt: "2026-09-01",
  }),
);

export const SEED_LISTINGS = buildSeedListings();

export function getListingById(id: string): ShopListing | undefined {
  return (
    VIP_LISTINGS.find((item) => item.id === id) ??
    SEED_LISTINGS.find((item) => item.id === id)
  );
}

export function readUserListings(): ShopListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_LISTINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShopListing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserListing(listing: ShopListing) {
  const current = readUserListings();
  window.localStorage.setItem(
    USER_LISTINGS_KEY,
    JSON.stringify([listing, ...current]),
  );
}

export function getAllMarketplaceListings(
  userListings: ShopListing[] = [],
): ShopListing[] {
  return [...userListings, ...SEED_LISTINGS];
}
