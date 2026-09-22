"use client";

import Link from "next/link";
import { VIP_LISTINGS, VIP_SHOP } from "@/lib/shop-listings";

export default function VipShopPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/shopbikes"
        className="inline-block text-sm text-muted hover:text-foreground"
      >
        ← Bike Shop
      </Link>

      <section className="relative overflow-hidden rounded-2xl">
        <img
          src={VIP_SHOP.background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="relative px-5 py-10 md:px-8 md:py-14">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            VIP дэлгүүр
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {VIP_SHOP.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 md:text-base">
            {VIP_SHOP.tagline}
          </p>
          <p className="mt-4 text-sm text-white/75">
            {VIP_LISTINGS.length} бараа · баталгаатай албан ёсны дэлгүүр
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Дэлгүүрийн бараа
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VIP_LISTINGS.map((product) => (
            <Link
              key={product.id}
              href={`/shopbikes/${product.id}`}
              className="overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-medium text-white">
                  VIP
                </span>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="font-medium text-foreground">{product.title}</h3>
                <p className="text-sm font-semibold text-accent">
                  {product.price}
                </p>
                <p className="text-xs text-muted">
                  {product.condition} · {product.frameSize} · {product.color}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">
          Холбоо барих
        </h2>
        <p className="mt-2 text-sm text-muted">
          Утас:{" "}
          <a href="tel:+97677001122" className="text-accent hover:underline">
            +976 7700 1122
          </a>
        </p>
        <p className="mt-1 text-sm text-muted">
          Имэйл:{" "}
          <a
            href="mailto:vip@bikereg.mn"
            className="text-accent hover:underline"
          >
            vip@bikereg.mn
          </a>
        </p>
        <p className="mt-1 text-sm text-muted">Хаяг: Сүхбаатар дүүрэг, Улаанбаатар</p>
      </section>
    </div>
  );
}
