import { products } from "@/data/products";

const demoLaboratories = [
  "Example Analytical Laboratory",
  "Demo Research Testing Lab",
  "Sample Quality Laboratory",
];
const round = (value) => Math.round(value * 100) / 100;

export const coaRecords = Object.fromEntries(
  products.flatMap((product, productIndex) =>
    (product.variants || []).map((variant, variantIndex) => {
      const index = productIndex * 7 + variantIndex;
      const purity = round(98.91 + ((index * 37) % 104) / 100);
      const label = variant.label || "Standard";
      const amount = Number.parseFloat(label);
      const content = Number.isFinite(amount)
        ? `${round(amount * (1.01 + (index % 6) / 100)).toFixed(2)} mg`
        : "Sample value";
      const accession = `DEMO-${String(2609140000 + index * 23).padStart(10, "0")}`;
      const record = {
        demo: true,
        purity,
        lot: `DEMO-${String(productIndex + 1).padStart(3, "0")}-${String(variantIndex + 1).padStart(2, "0")}`,
        testDate: "Sample record · 2026",
        accession,
        laboratory: demoLaboratories[index % demoLaboratories.length],
        pdfUrl: null,
        results: [
          {
            name: "Identity (LC-MS)",
            value: product.name,
            status: "Example only",
          },
          {
            name: "Purity (HPLC-UV)",
            value: `${purity.toFixed(2)}%`,
            status: "Example only",
          },
          { name: "Net content", value: content, status: "Example only" },
          {
            name: "Microbial (PCR)",
            value: "Not verified",
            status: "Demo field",
          },
          {
            name: "Laboratory",
            value: demoLaboratories[index % demoLaboratories.length],
            status: "Placeholder",
          },
        ],
      };
      return [`${product.slug}:${variant.id}`, record];
    }),
  ),
);
