export const PACK_OPTIONS = [
  { quantity: 2, label: "2 Bottles", discountPercent: 5 },
  { quantity: 5, label: "5 Bottles", discountPercent: 9 },
  { quantity: 10, label: "10 Bottles", discountPercent: 15 },
];

export const getPackPrice = (unitPrice, quantity, discountPercent) =>
  Math.round(unitPrice * quantity * (1 - discountPercent / 100) * 100) / 100;

export const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
