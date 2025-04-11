import { Product } from '../types';

export async function loadProducts(): Promise<Product[]> {
  const productFiles = [
    '/src/data/products_1.json',
    '/src/data/products_2.json',
    '/src/data/products_3.json',
    '/src/data/products_4.json',
    '/src/data/products_5.json',
    '/src/data/products_6.json',

  ];
  try {
    const products: Product[] = [];
    
    for (const file of productFiles) {
      const response = await fetch(file);
      const data = await response.json();
      products.push(...data.products);
    }

    return products.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}
