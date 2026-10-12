import Link from 'next/link';
import { Product } from '@/content/products';
import { ProductPreview } from './ProductPreview';
import { LeadButton } from './LeadProvider';
export function ProductCard({ product }: { product: Product }) {
  return <section className="product-scene scene" id={`product-${product.slug}`}><div className="container scene-grid">
    <div className="scene-copy"><span className="eyebrow">{product.name} · по подписке</span><h2>{product.title}</h2><p>{product.description}</p><div className="actions"><Link className="button" href={product.detailHref} data-event="product_interest">Подробнее о {product.name}</Link><LeadButton className="text-button" intent="saas" productSlug={product.slug}>Обсудить подключение</LeadButton></div></div>
    <ProductPreview product={product.slug as 'crm'|'oms'|'crm-oms'} />
  </div></section>;
}
