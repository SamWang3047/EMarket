export function formatCurrency(priceInCents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(priceInCents / 100);
}
