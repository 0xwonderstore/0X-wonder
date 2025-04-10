export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numericPrice.toString();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}