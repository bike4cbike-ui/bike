"use client";

import { useEffect, useState } from "react";
import BikeCertificateCard from "@/components/BikeCertificateCard";
import type { BikeCertificateData } from "@/lib/certificates";

type CertificatePanelProps = {
  ownerName: string | null;
};

export default function CertificatePanel({ ownerName }: CertificatePanelProps) {
  const [bikes, setBikes] = useState<BikeCertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBikes() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/bikes");
        const data = (await response.json()) as
          | Array<{
              id: string;
              brand: string;
              model: string;
              color: string;
              serialNumber: string;
              notes: string;
              status: string;
              imageUrl: string | null;
              createdAt: string;
            }>
          | { error?: string };

        if (cancelled) return;

        if (!response.ok || !Array.isArray(data)) {
          setBikes([]);
          setSelectedId(null);
          setError(
            !Array.isArray(data) && data.error
              ? data.error
              : "Could not load certificates.",
          );
          return;
        }

        const certificates: BikeCertificateData[] = data.map((bike) => ({
          ...bike,
          notes: bike.notes ?? "",
          ownerName,
        }));

        setBikes(certificates);
        setSelectedId(certificates[0]?.id ?? null);
      } catch {
        if (!cancelled) {
          setBikes([]);
          setSelectedId(null);
          setError("Could not load certificates. Check your connection.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadBikes();
    return () => {
      cancelled = true;
    };
  }, [ownerName]);

  const selected = bikes.find((bike) => bike.id === selectedId) ?? null;

  return (
    <section className="rounded-lg border border-border bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Registration certificate
          </h2>
          <p className="mt-1 text-sm text-muted">
            Official bike details loaded from the database, with a QR code for
            verification.
          </p>
        </div>

        {bikes.length > 1 ? (
          <label className="text-sm text-muted">
            Bike{" "}
            <select
              value={selectedId ?? ""}
              onChange={(event) => setSelectedId(event.target.value)}
              className="ml-2 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
            >
              {bikes.map((bike) => (
                <option key={bike.id} value={bike.id}>
                  {bike.brand} {bike.model}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading certificates…</p>
      ) : null}

      {!loading && error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : null}

      {!loading && !error && bikes.length === 0 ? (
        <p className="text-sm text-muted">
          No registered bikes yet. Certificates appear here after you register a
          bicycle.
        </p>
      ) : null}

      {!loading && !error && selected ? (
        <BikeCertificateCard
          certificate={selected}
          footer="This certificate reflects the bike record currently stored in MongoDB for your account."
        />
      ) : null}
    </section>
  );
}
