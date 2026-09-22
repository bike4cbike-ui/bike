import { SignInButton, Show } from "@clerk/nextjs";
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
        description="Add bike details and an optional photo. Sign in to continue."
      />

      <Show when="signed-in">
        <RegisterForm />
      </Show>

      <Show when="signed-out">
        <div className="max-w-xl rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            You need to be signed in to register a bicycle.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="mt-4 rounded-md border border-accent px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent-soft"
            >
              Sign in
            </button>
          </SignInButton>
        </div>
      </Show>
    </div>
  );
}
