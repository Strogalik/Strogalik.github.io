/** A four-answer local index. No I/O, history, telemetry or inferred answers. */
export type SearchableFaq = {id:string;label:string;question:string;answer:string;searchAliases:readonly string[]};
export function normalizeFaqQuery(value:string){
 return value.normalize('NFKC').toLocaleLowerCase('ru-RU').replace(/ё/gu,'е')
  .replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/gu,' ').trim();
}
const stop=new Set('а в во и или на по о об для ли как что это то у вы мы я можно мне пожалуйста'.split(' '));
export function searchFaq<T extends SearchableFaq>(items:readonly T[],query:string):T[]{
 const q=normalizeFaqQuery(query).slice(0,200),terms=q.split(' ').filter(t=>t&&!stop.has(t));
 if(!terms.length)return [];
 return items.map((item,index)=>{
  const aliases=item.searchAliases.map(normalizeFaqQuery);
  const text=normalizeFaqQuery([item.label,item.question,item.answer,...aliases].join(' '));
  if(!terms.every(term=>text.includes(term)))return null;
  const score=(aliases.includes(q)?100:0)+(normalizeFaqQuery(item.label).includes(q)?30:0)+(normalizeFaqQuery(item.question).includes(q)?20:0)+terms.length;
  return {item,score,index};
 }).filter(x=>x!==null).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.item);
}
