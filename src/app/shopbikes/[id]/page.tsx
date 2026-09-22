"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  getListingById,
  readUserListings,
  type ShopListing,
} from "@/lib/shop-listings";

function findListing(id: string): ShopListing | undefined {
  return (
    getListingById(id) ?? readUserListings().find((item) => item.id === id)
  );
}

export default function ShopListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listing = useMemo(() => findListing(params.id), [params.id]);

  if (!listing) {
    return (
      <div className="space-y-4">
        <p className="text-muted">Зар олдсонгүй.</p>
        <Link href="/shopbikes" className="text-accent hover:underline">
          ← Bike Shop руу буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/shopbikes"
        className="inline-block text-sm text-muted hover:text-foreground"
      >
        ← Bike Shop
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <img
            src={listing.image}
            alt={listing.title}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <span className="rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
              {listing.sellerType === "shop" ? "Дэлгүүрийн зар" : "Хувь хүний зар"}
            </span>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {listing.title}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-accent">
              {listing.price}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
            <div>
              <dt className="text-muted">Нөхцөл</dt>
              <dd className="font-medium">{listing.condition}</dd>
            </div>
            <div>
              <dt className="text-muted">Он</dt>
              <dd className="font-medium">{listing.year}</dd>
            </div>
            <div>
              <dt className="text-muted">Брэнд</dt>
              <dd className="font-medium">{listing.brand}</dd>
            </div>
            <div>
              <dt className="text-muted">Модель</dt>
              <dd className="font-medium">{listing.model}</dd>
            </div>
            <div>
              <dt className="text-muted">Өнгө</dt>
              <dd className="font-medium">{listing.color}</dd>
            </div>
            <div>
              <dt className="text-muted">Рама</dt>
              <dd className="font-medium">{listing.frameSize}</dd>
            </div>
            <div>
              <dt className="text-muted">Дүүрэг</dt>
              <dd className="font-medium">{listing.district}</dd>
            </div>
            <div>
              <dt className="text-muted">Нийтэлсэн</dt>
              <dd className="font-medium">{listing.postedAt}</dd>
            </div>
          </dl>

          <div>
            <h2 className="text-base font-medium text-foreground">Тайлбар</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {listing.description}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-accent/30 bg-accent-soft p-5 md:p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Зарагчтай холбогдох
        </h2>
        <p className="mt-1 text-sm text-muted">
          Энэ дугуйг зарж буй хүний дэлгэрэнгүй мэдээлэл
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Нэр</p>
            <p className="mt-1 font-medium text-foreground">{listing.seller}</p>
            <p className="mt-1 text-sm text-muted">
              {listing.sellerType === "shop" ? "Дэлгүүр" : "Хувь хүн"} ·{" "}
              {listing.district}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Утас</p>
            <a
              href={`tel:${listing.phone.replace(/\s+/g, "")}`}
              className="mt-1 block font-medium text-accent hover:underline"
            >
              {listing.phone}
            </a>
            <p className="mt-1 text-xs text-muted">Дарж шууд залгана</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-wide text-muted">Имэйл</p>
            <a
              href={`mailto:${listing.email}?subject=${encodeURIComponent(listing.title)}`}
              className="mt-1 block font-medium text-accent hover:underline"
            >
              {listing.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
