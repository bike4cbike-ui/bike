"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BIKE_IMAGES,
  saveUserListing,
  type SellerType,
  type ShopListing,
} from "@/lib/shop-listings";

export default function NewShopListingPage() {
  const router = useRouter();
  const [sellerType, setSellerType] = useState<SellerType>("private");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const seller = String(form.get("seller") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const priceRaw = String(form.get("price") ?? "").replace(/[^\d]/g, "");
    const priceValue = Number(priceRaw);

    if (!title || !seller || !phone || !email || !priceValue) {
      setError("Заавал бөглөх талбаруудыг гүйцэд бөглөнө үү.");
      return;
    }

    const listing: ShopListing = {
      id: `user-${Date.now()}`,
      title,
      price: `₮${priceValue.toLocaleString("en-US")}`,
      priceValue,
      image: BIKE_IMAGES[Math.floor(Math.random() * BIKE_IMAGES.length)],
      seller,
      sellerType,
      district: String(form.get("district") ?? "Сүхбаатар"),
      condition: String(form.get("condition") ?? "Сайн"),
      brand: String(form.get("brand") ?? "").trim() || "Бусад",
      model: String(form.get("model") ?? "").trim() || title,
      year: Number(form.get("year") ?? new Date().getFullYear()),
      color: String(form.get("color") ?? "").trim() || "—",
      frameSize: String(form.get("frameSize") ?? "M"),
      description:
        String(form.get("description") ?? "").trim() ||
        `${seller}-ийн зарсан ${title}.`,
      phone,
      email,
      postedAt: new Date().toISOString().slice(0, 10),
    };

    saveUserListing(listing);
    router.push(`/shopbikes/${listing.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/shopbikes"
        className="inline-block text-sm text-muted hover:text-foreground"
      >
        ← Bike Shop
      </Link>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Зар оруулах
        </h1>
        <p className="mt-2 text-sm text-muted">
          Хувь хүн эсвэл дэлгүүр өөрийн дугуйны зараа нийтлэнэ.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSellerType("private")}
          className={`rounded-md px-4 py-2 text-sm ${
            sellerType === "private"
              ? "bg-accent text-white"
              : "border border-border bg-surface"
          }`}
        >
          Хувь хүн
        </button>
        <button
          type="button"
          onClick={() => setSellerType("shop")}
          className={`rounded-md px-4 py-2 text-sm ${
            sellerType === "shop"
              ? "bg-accent text-white"
              : "border border-border bg-surface"
          }`}
        >
          Дэлгүүр
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-5">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Гарчиг *</span>
          <input
            name="title"
            required
            placeholder="Trek FX 3 2022"
            className="w-full rounded-md border border-border bg-background px-3 py-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">
              {sellerType === "shop" ? "Дэлгүүрийн нэр *" : "Таны нэр *"}
            </span>
            <input
              name="seller"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Үнэ (₮) *</span>
            <input
              name="price"
              required
              inputMode="numeric"
              placeholder="1500000"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Утас *</span>
            <input
              name="phone"
              required
              placeholder="+976 9911 2233"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Имэйл *</span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@mail.mn"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Дүүрэг</span>
            <select
              name="district"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
              defaultValue="Сүхбаатар"
            >
              {[
                "Сүхбаатар",
                "Баянзүрх",
                "Чингэлтэй",
                "Хан-Уул",
                "Баянгол",
                "Сонгинохайрхан",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Нөхцөл</span>
            <select
              name="condition"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
              defaultValue="Сайн"
            >
              {["Шинэ", "Маш сайн", "Сайн", "Дунд"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Брэнд</span>
            <input
              name="brand"
              placeholder="Giant"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Модель</span>
            <input
              name="model"
              placeholder="Escape 3"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Он</span>
            <input
              name="year"
              type="number"
              defaultValue={2022}
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Өнгө</span>
            <input
              name="color"
              placeholder="Хар"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Рамын хэмжээ</span>
            <select
              name="frameSize"
              className="w-full rounded-md border border-border bg-background px-3 py-2"
              defaultValue="M"
            >
              {["S", "M", "L", "XL"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-muted">Тайлбар</span>
          <textarea
            name="description"
            rows={4}
            placeholder="Дугуйны нөхцөл, яагаад зарж байгаа гэх мэт..."
            className="w-full rounded-md border border-border bg-background px-3 py-2"
          />
        </label>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Зар нийтлэх
        </button>
      </form>
    </div>
  );
}
