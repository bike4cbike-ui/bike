import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BikeCertificateCard from "@/components/BikeCertificateCard";
import { getBikeCertificateById } from "@/lib/certificates";

type CertificatePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CertificatePageProps): Promise<Metadata> {
  const { id } = await params;
  const certificate = await getBikeCertificateById(id);

  if (!certificate) {
    return { title: "Certificate not found" };
  }

  return {
    title: `${certificate.brand} ${certificate.model} certificate`,
    description: `BikeReg registration certificate for ${certificate.brand} ${certificate.model}`,
  };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { id } = await params;
  const certificate = await getBikeCertificateById(id);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl justify-center">
      <BikeCertificateCard certificate={certificate} />
    </div>
  );
}
