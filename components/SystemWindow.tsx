import { ProductPreview } from './ProductPreview';
export function SystemWindow({variant='connected'}:{variant?:'sales'|'operations'|'connected'|'custom';compact?:boolean}) {return <ProductPreview product={variant==='sales'?'crm':variant==='operations'?'oms':'crm-oms'}/>;}
