"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  getAllMarketplaceListings,
  PAGE_SIZE,
  readUserListings,
  VIP_SHOP,
  type ShopListing,
} from "@/lib/shop-listings";

function getCardStep(el: HTMLDivElement) {
  const card = el.querySelector<HTMLElement>("[data-vip-card]");
  if (!card) return 300;
  const styles = window.getComputedStyle(el);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
  return card.getBoundingClientRect().width + gap;
}

function VipProductCarousel() {
  const products = VIP_SHOP.products;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const syncIndex = () => {
      const step = getCardStep(el);
      const index = Math.round(el.scrollLeft / step);
      setActiveIndex(Math.min(Math.max(index, 0), products.length - 1));
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };

    el.addEventListener("scroll", syncIndex, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    syncIndex();
    return () => {
      el.removeEventListener("scroll", syncIndex);
      el.removeEventListener("wheel", onWheel);
    };
  }, [products.length]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * getCardStep(el), behavior: "smooth" });
  };

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * getCardStep(el), behavior: "smooth" });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startScroll: el.scrollLeft,
    };
    el.classList.remove("snap-x", "snap-mandatory");
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active) return;
    el.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active) return;
    drag.active = false;
    el.classList.add("snap-x", "snap-mandatory");
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
    const step = getCardStep(el);
    const index = Math.round(el.scrollLeft / step);
    el.scrollTo({ left: index * step, behavior: "smooth" });
  };

  return (
    <div className="mt-auto space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/85">VIP бараа · дэлгүүр рүү орно</p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Өмнөх VIP бараа"
            onClick={() => scrollByCards(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-foreground hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Дараах VIP бараа"
            onClick={() => scrollByCards(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-foreground hover:bg-white"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href="/shopbikes/vip"
            data-vip-card
            className="relative h-[200px] w-[min(70vw,220px)] shrink-0 snap-start select-none overflow-hidden rounded-xl bg-black/40"
          >
            <img
              src={product.image}
              alt={product.name}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-3 text-white">
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="mt-1 text-xs text-white/90">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-1.5">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`${index + 1}-р VIP бараа`}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ShopBikesPage() {
  const [page, setPage] = useState(1);
  const [userListings, setUserListings] = useState<ShopListing[]>([]);

  useEffect(() => {
    setUserListings(readUserListings());
  }, []);

  const allListings = useMemo(
    () => getAllMarketplaceListings(userListings),
    [userListings],
  );
  const totalPages = Math.max(1, Math.ceil(allListings.length / PAGE_SIZE));

  const pageListings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allListings.slice(start, start + PAGE_SIZE);
  }, [allListings, page]);

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bike Shop
          </h1>
          <p className="mt-1 text-sm text-muted">
            VIP дэлгүүр болон хувь хүний / дэлгүүрийн зарууд
          </p>
        </div>
        <Link
          href="/shopbikes/new"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Зар оруулах
        </Link>
      </div>

      <section className="relative min-h-[420px] overflow-hidden rounded-2xl md:min-h-[460px]">
        <img
          src={VIP_SHOP.background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
        <div className="relative flex min-h-[420px] flex-col px-5 py-6 md:min-h-[460px] md:px-8 md:py-8">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              VIP дэлгүүр
            </span>
            <Link href="/shopbikes/vip" className="mt-3 block">
              <h2 className="text-4xl font-semibold tracking-tight text-white hover:underline md:text-5xl">
                {VIP_SHOP.name}
              </h2>
            </Link>
            <p className="mt-2 max-w-xl text-sm text-white/85 md:text-base">
              {VIP_SHOP.tagline}
            </p>
            <Link
              href="/shopbikes/vip"
              className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-white/90"
            >
              Дэлгүүрийн бараа үзэх →
            </Link>
          </div>
          <VipProductCarousel />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Хувь хүн / дэлгүүрийн зар
          </h2>
          <p className="mt-1 text-sm text-muted">
            Хуудас {page} · {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, allListings.length)} /{" "}
            {allListings.length} дугуй · зар дээр дарж холбогдоно
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/shopbikes/${listing.id}`}
              className="overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent"
            >
              <div className="relative aspect-[4/3] bg-foreground/5">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute left-2 top-2 rounded bg-black/65 px-2 py-0.5 text-xs text-white">
                  {listing.condition}
                </span>
                <span className="absolute right-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs text-foreground">
                  {listing.sellerType === "shop" ? "Дэлгүүр" : "Хувь хүн"}
                </span>
              </div>
              <div className="space-y-1 p-3">
                <h3 className="font-medium text-foreground">{listing.title}</h3>
                <p className="text-sm font-semibold text-accent">
                  {listing.price}
                </p>
                <p className="text-xs text-muted">
                  {listing.seller} · {listing.district}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Өмнөх
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goToPage(n)}
              className={`min-w-9 rounded-md px-3 py-2 text-sm ${
                n === page
                  ? "bg-accent text-white"
                  : "border border-border bg-surface hover:bg-accent-soft"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Дараах
          </button>
        </div>
      </section>
    </div>
  );
}
