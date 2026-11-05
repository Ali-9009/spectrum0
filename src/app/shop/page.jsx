import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop Research Products | Spectrum Biosciences",
  description: "Browse the Spectrum Biosciences research product collection.",
};

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  return <ShopClient initialSearch={params?.search || ""} />;
}
