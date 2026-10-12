const cases=['b2b-wholesale','flooring-manufacturer','online-school'];
const products=['crm','oms','crm-oms'];
export function legacyDemoTarget(params:URLSearchParams){const c=params.get('case'),p=params.get('product');return c&&cases.includes(c)?`/cases/${c}`:p&&products.includes(p)?`/products/${p}`:'/#products';}
