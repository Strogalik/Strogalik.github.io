import copy from './site-copy.ru.json';
export const products = copy.products;
export type Product = typeof products[number];
export const findProduct = (slug: string) => products.find(item => item.slug === slug);
