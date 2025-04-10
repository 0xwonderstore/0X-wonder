export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice / 100);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Map of vendor names to their Facebook Ad Library URLs
const FACEBOOK_AD_LIBRARY_URLS: Record<string, string> = {
  'cozyhoome': 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=112757221912564',
  'elenoradz': 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&q=%22elenoradz%22&search_type=keyword_exact_phrase',
  'eleganceaccessoires': 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&q=%22eleganceaccessoires%22&search_type=keyword_exact_phrase',
  'latafastore': 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=107582595350263',
  'metashopjo': 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=167536333754597',
  'allaffaire': 'https://allaffaire.com/products/jupe-lumineuse-led-princess', // No Facebook Ad Library URL available
  'unknown': 'https://www.facebook.com/ads/library'
};

export function getFacebookAdLibraryUrl(vendor: string): string {
  const normalizedVendor = vendor.toLowerCase().replace('.shop', '').replace('.com', '');
  return FACEBOOK_AD_LIBRARY_URLS[normalizedVendor] || FACEBOOK_AD_LIBRARY_URLS['unknown'];
}