import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductDetails from "@/components/ProductDetails";

export function generateStaticParams() {
  return products
    .filter((product) => product.active !== false)
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug && item.active !== false,
  );

  if (!product) {
    return {
      title: "Product Not Found | Spectrum Biosciences",
    };
  }

  return {
    title: `${product.name} | Spectrum Biosciences`,
    description:
      product.description ||
      `${product.name} — For laboratory research use only.`,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug && item.active !== false,
  );

  if (!product) notFound();

  return <ProductDetails product={product} />;
}