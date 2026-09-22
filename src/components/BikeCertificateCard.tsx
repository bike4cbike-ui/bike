"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { BikeCertificateData } from "@/lib/certificates";

type BikeCertificateCardProps = {
  certificate: BikeCertificateData;
  footer?: string;
};

export default function BikeCertificateCard({
  certificate,
  footer = "This certificate reflects the bike record currently stored in MongoDB.",
}: BikeCertificateCardProps) {
  const [certificateUrl, setCertificateUrl] = useState(
    `/certificate/${certificate.id}`,
  );

  useEffect(() => {
    setCertificateUrl(
      `${window.location.origin}/certificate/${certificate.id}`,
    );
  }, [certificate.id]);

  return (
    <article className="overflow-hidden rounded-md border-2 border-accent/30 bg-[linear-gradient(160deg,var(--accent-soft)_0%,var(--surface)_42%,var(--surface)_100%)]">
      <div className="border-b border-accent/20 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          BikeReg · Certificate of registration
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
          {certificate.brand} {certificate.model}
        </h3>
        <p className="mt-1 text-sm capitalize text-muted">
          Status: {certificate.status}
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[7.5rem_1fr]">
        <div className="overflow-hidden rounded-md border border-border bg-background">
          {certificate.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={certificate.imageUrl}
              alt={`${certificate.brand} ${certificate.model}`}
              className="h-28 w-full object-cover sm:h-full"
            />
          ) : (
            <div className="flex h-28 items-center justify-center px-2 text-center text-xs text-muted sm:h-full">
              No photo on file
            </div>
          )}
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <CertField label="Owner" value={certificate.ownerName || "—"} />
          <CertField label="Brand" value={certificate.brand} />
          <CertField label="Model" value={certificate.model} />
          <CertField label="Color" value={certificate.color || "—"} />
          <CertField
            label="Serial number"
            value={certificate.serialNumber}
            mono
          />
          <CertField
            label="Registered"
            value={formatDate(certificate.createdAt)}
          />
          <CertField label="Certificate ID" value={certificate.id} mono />
          {certificate.notes ? (
            <div className="sm:col-span-2">
              <CertField label="Notes" value={certificate.notes} />
            </div>
          ) : null}
        </dl>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-accent/20 px-5 py-4 sm:flex-row sm:items-center">
        <div className="shrink-0 rounded-md border border-border bg-white p-3">
          <QRCodeCanvas
            value={certificateUrl}
            size={144}
            bgColor="#ffffff"
            fgColor="#1a1f1c"
            level="M"
            marginSize={2}
            title={`QR code for certificate ${certificate.id}`}
            style={{ width: 144, height: 144, display: "block" }}
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-foreground">Scan to verify</p>
          <p className="mt-1 text-xs text-muted">
            This QR code opens the public certificate page for bike ID{" "}
            <span className="font-mono">{certificate.id}</span>.
          </p>
          <Link
            href={`/certificate/${certificate.id}`}
            className="mt-2 inline-block text-sm text-accent hover:underline"
          >
            Open certificate page
          </Link>
        </div>
      </div>

      <div className="border-t border-accent/20 px-5 py-3 text-xs text-muted">
        {footer}
      </div>
    </article>
  );
}

function CertField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[0.7rem] font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-foreground ${mono ? "font-mono text-xs break-all" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
