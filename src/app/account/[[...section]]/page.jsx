import { Suspense } from "react";
import AccountClient from "@/components/account/AccountClient";

export const metadata = {
  title: "My Account | Spectrum Biosciences",
  description: "Manage your Spectrum Biosciences account.",
};

export default async function AccountPage({ params }) {
  const { section = [] } = await params;
  return (
    <Suspense
      fallback={
        <main className="text-primary min-h-screen bg-white p-10">
          Loading your account...
        </main>
      }
    >
      <AccountClient section={section[0] || "dashboard"} />
    </Suspense>
  );
}
