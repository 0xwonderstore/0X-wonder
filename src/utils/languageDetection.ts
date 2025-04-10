import { Product } from '../types';

// Language patterns
const patterns = {
  arabic: /[\u0600-\u06FF]/,
  japanese: /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/,
  german: /[äöüßÄÖÜ]/,
  french: /[éèêëàâçîïôûùüÿñæœ]/i
};

export function detectLanguage(text: string): string[] {
  const languages: string[] = [];

  if (patterns.arabic.test(text)) languages.push('العربية');
  if (patterns.japanese.test(text)) languages.push('اليابانية');
  if (patterns.german.test(text)) languages.push('الألمانية');
  if (patterns.french.test(text)) languages.push('الفرنسية');
  if (!languages.length && /^[a-zA-Z\s]+$/.test(text)) languages.push('الإنجليزية');

  return languages;
}

export function getVendorLanguages(products: Product[]): Map<string, Set<string>> {
  const vendorLanguages = new Map<string, Set<string>>();

  products.forEach(product => {
    const languages = detectLanguage(product.title);
    const existingLanguages = vendorLanguages.get(product.vendor) || new Set();
    languages.forEach(lang => existingLanguages.add(lang));
    vendorLanguages.set(product.vendor, existingLanguages);
  });

  return vendorLanguages;
}