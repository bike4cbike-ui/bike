import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div>
      <PageHeader
        title="Register a bicycle"
        description="Add bike details and an optional photo. Photos upload when you are signed in."
      />
      <RegisterForm />
    </div>
  );
}
