"use client";

import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";

type ShopKind = "bikes" | "accessories" | "mixed";

type ShopProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  cta: string;
};

type BikeShop = {
  id: string;
  name: string;
  district: string;
  kind: ShopKind;
  blurb: string;
  products: ShopProduct[];
};

const kindLabel: Record<ShopKind, string> = {
  bikes: "Дугуй",
  accessories: "Хэрэгсэл",
  mixed: "Дугуй + хэрэгсэл",
};

const shops: BikeShop[] = [
  {
    id: "1",
    name: "Nomad Cycles",
    district: "Сүхбаатар",
    kind: "bikes",
    blurb: "Хотын болон аяллын дугуй",
    products: [
      {
        id: "1a",
        name: "City Cruiser 7",
        price: "₮1,890,000",
        image:
          "https://images.unsplash.com/photo-1485965120182-f2355695cf85?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "1b",
        name: "Trail Nomad 29",
        price: "₮2,450,000",
        image:
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "1c",
        name: "Fold Compact X",
        price: "₮1,120,000",
        image:
          "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
    ],
  },
  {
    id: "2",
    name: "Pedal Mongolia",
    district: "Баянзүрх",
    kind: "bikes",
    blurb: "Оюутны өдөр тутмын дугуй",
    products: [
      {
        id: "2a",
        name: "Campus Ride 3",
        price: "₮980,000",
        image:
          "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "2b",
        name: "Urban Step",
        price: "₮1,350,000",
        image:
          "https://images.unsplash.com/photo-1511994298241-608e28f14d70?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "2c",
        name: "Lite Commute",
        price: "₮1,050,000",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
    ],
  },
  {
    id: "3",
    name: "Spoke & Chain",
    district: "Чингэлтэй",
    kind: "accessories",
    blurb: "Засвар, тос, хэрэгсэл",
    products: [
      {
        id: "3a",
        name: "Chain lube set",
        price: "₮28,000",
        image:
          "https://images.unsplash.com/photo-1621886292650-520f76c29281?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "3b",
        name: "Multi-tool 16",
        price: "₮45,000",
        image:
          "https://images.unsplash.com/photo-1595435742656-5272d0b55c70?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "3c",
        name: "Inner tube pack",
        price: "₮22,000",
        image:
          "https://images.unsplash.com/photo-1605281317010-fe5abb696471?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
    ],
  },
  {
    id: "4",
    name: "UB Bike Hub",
    district: "Хан-Уул",
    kind: "mixed",
    blurb: "Дугуй + хамгаалалт",
    products: [
      {
        id: "4a",
        name: "Hybrid Path 2",
        price: "₮1,780,000",
        image:
          "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "4b",
        name: "City lock U",
        price: "₮65,000",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "4c",
        name: "LED light pair",
        price: "₮39,000",
        image:
          "https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
    ],
  },
  {
    id: "5",
    name: "Helmet Zone",
    district: "Баянгол",
    kind: "accessories",
    blurb: "Малай, бээлий, гэрэл",
    products: [
      {
        id: "5a",
        name: "Urban helmet M",
        price: "₮120,000",
        image:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "5b",
        name: "Winter gloves",
        price: "₮55,000",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "5c",
        name: "Rear blinker",
        price: "₮18,000",
        image:
          "https://images.unsplash.com/photo-1517649763962-0c623066027c?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
    ],
  },
  {
    id: "6",
    name: "Mountain Trail Gear",
    district: "Сонгинохайрхан",
    kind: "bikes",
    blurb: "Уулын болон trail дугуй",
    products: [
      {
        id: "6a",
        name: "Ridge 27.5",
        price: "₮2,900,000",
        image:
          "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "6b",
        name: "Summit Hardtail",
        price: "₮3,400,000",
        image:
          "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "6c",
        name: "Dust Runner",
        price: "₮2,150,000",
        image:
          "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
    ],
  },
  {
    id: "7",
    name: "Wheel Works",
    district: "Сүхбаатар",
    kind: "mixed",
    blurb: "Засвар + шинэ дугуй",
    products: [
      {
        id: "7a",
        name: "Road Sprint S",
        price: "₮3,100,000",
        image:
          "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "7b",
        name: "Tire 700x28",
        price: "₮48,000",
        image:
          "https://images.unsplash.com/photo-1605281317010-fe5abb696471?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "7c",
        name: "Pump floor pro",
        price: "₮72,000",
        image:
          "https://images.unsplash.com/photo-1595435742656-5272d0b55c70?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
    ],
  },
  {
    id: "8",
    name: "Gear Garage",
    district: "Баянзүрх",
    kind: "accessories",
    blurb: "Цүнх, тулгуур, сав",
    products: [
      {
        id: "8a",
        name: "Pannier bag",
        price: "₮95,000",
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "8b",
        name: "Bottle cage",
        price: "₮15,000",
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "8c",
        name: "Phone mount",
        price: "₮32,000",
        image:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
    ],
  },
  {
    id: "9",
    name: "Green Path Bikes",
    district: "Хан-Уул",
    kind: "bikes",
    blurb: "Эко хотын дугуй",
    products: [
      {
        id: "9a",
        name: "Eco City 5",
        price: "₮1,420,000",
        image:
          "https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "9b",
        name: "Bamboo frame demo",
        price: "₮4,200,000",
        image:
          "https://images.unsplash.com/photo-1485965120182-f2355695cf85?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "9c",
        name: "E-assist Lite",
        price: "₮5,600,000",
        image:
          "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
    ],
  },
  {
    id: "10",
    name: "Fixie Corner",
    district: "Чингэлтэй",
    kind: "mixed",
    blurb: "Fixie болон хувцас",
    products: [
      {
        id: "10a",
        name: "Fixie Matte Black",
        price: "₮1,650,000",
        image:
          "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80",
        cta: "Үзэх",
      },
      {
        id: "10b",
        name: "Cap & socks set",
        price: "₮35,000",
        image:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
      {
        id: "10c",
        name: "Toe clips",
        price: "₮28,000",
        image:
          "https://images.unsplash.com/photo-1511994298241-608e28f14d70?auto=format&fit=crop&w=900&q=80",
        cta: "Авах",
      },
    ],
  },
];

function ShopProductRow({ shop }: { shop: BikeShop }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const card = el.querySelector<HTMLElement>("[data-product-card]");
      if (!card) return;
      const step = card.offsetWidth + 16;
      const index = Math.round(el.scrollLeft / step);
      setActiveIndex(
        Math.min(Math.max(index, 0), shop.products.length - 1),
      );
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [shop.products.length]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const step = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const step = (card?.offsetWidth ?? 280) + 16;
    el.scrollTo({ left: index * step, behavior: "smooth" });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {shop.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {kindLabel[shop.kind]} · {shop.district} — {shop.blurb}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label={`${shop.name} өмнөх`}
            onClick={() => scrollByCards(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg text-foreground hover:bg-accent-soft"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={`${shop.name} дараах`}
            onClick={() => scrollByCards(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg text-foreground hover:bg-accent-soft"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shop.products.map((product) => (
          <article
            key={product.id}
            data-product-card
            className="relative h-[360px] w-[min(78vw,300px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-foreground"
          >
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            <div className="relative flex h-full flex-col justify-between p-5 text-white">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                  {shop.name}
                </p>
                <p className="mt-1 text-lg font-semibold">{product.name}</p>
              </div>
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm font-medium text-white/90">
                  {product.price}
                </p>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground">
                  {product.cta}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {shop.products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`${shop.name} ${index + 1}-р бараа`}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex
                ? "w-5 bg-foreground"
                : "w-2 bg-border hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default function ShopBikesPage() {
  return (
    <div>
      <PageHeader
        title="Bike Shop"
        description="Дэлгүүр бүрийн нэр доор тухайн дэлгүүрийн бараа. Сумаар эсвэл чирж гүйлгэнэ үү."
      />

      <div className="space-y-14">
        {shops.map((shop) => (
          <ShopProductRow key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
}
