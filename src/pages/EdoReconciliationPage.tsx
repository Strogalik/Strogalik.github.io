import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SemanticStatusText } from '../components/StatusPill';
import { ChoiceList, ChoiceRow, Overlay } from '../components/Overlay';

const items=[
 {id:'rec-1',doc:'УПД №268',from:'ООО «Транзит Северо-Восток»',issue:'Контрагент по ИНН не найден',meta:'ИНН 7724••••12 · 184 500 ₽',tone:'warning' as const},
 {id:'rec-2',doc:'Акт №91',from:'ООО «Склад Партнёр»',issue:'Нет связи с рейсом или заказом',meta:'ИНН 5029••••08 · 52 800 ₽',tone:'info' as const},
 {id:'rec-3',doc:'Счёт №4408',from:'АО «РегионТрейд»',issue:'Реквизиты отличаются от карточки',meta:'ИНН 7705••••31 · 76 000 ₽',tone:'danger' as const},
];

type ActionState = { itemId:string; mode:'assign'|'link' } | null;

export function EdoReconciliationPage(){
  const [action,setAction]=useState<ActionState>(null);
  const [choice,setChoice]=useState('');
  const current=items.find(item=>item.id===action?.itemId);
  const options=action?.mode==='assign'
    ? ['Анна Крылова · бухгалтер','Марина Лебедева · логист','Олег Васильев · руководитель']
    : ['ООО «ТрансЛогистика» · ИНН 7724••••12','Рейс TR-0248 · Москва → Казань','Заказ ORD-1842 · ООО «Транзит Северо-Восток»'];
  const open=(itemId:string,mode:'assign'|'link')=>{setChoice('');setAction({itemId,mode});};
  return <div className="page">
    <PageHeader kicker="Очередь разбора" title="Сопоставление входящих" description="Документы, которые система не может безопасно связать автоматически с контрагентом или рейсом." actions={<Link to="/edo" className="btn btn--ghost"><Icon name="back"/>К ЭДО</Link>}/>
    <section className="reconciliation-list">{items.map(x=><article className="panel reconciliation-card" key={x.id}>
      <div className="reconciliation-card__identity"><span className="document-icon"><Icon name="folder"/></span><div><span>{x.from}</span><h2>{x.doc}</h2><small>{x.meta}</small></div></div>
      <div className="reconciliation-card__issue"><SemanticStatusText label={x.issue} tone={x.tone}/></div>
      <div className="reconciliation-card__actions"><button type="button" className="btn btn--ghost" onClick={()=>open(x.id,'assign')}>Назначить ответственного</button><button type="button" className="btn btn--primary" onClick={()=>open(x.id,'link')}>Связать</button></div>
    </article>)}</section>
    <Overlay open={Boolean(action)} onClose={()=>setAction(null)} title={action?.mode==='assign'?'Назначить ответственного':'Связать документ'} description={current ? `${current.doc} · ${current.from}` : undefined} kicker={action?.mode==='assign'?'Ответственный':'Сопоставление'} presentation="sheet" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setAction(null)}>Отмена</button><button type="button" className="btn btn--primary" disabled={!choice} onClick={()=>setAction(null)}>Подтвердить</button></>}>
      <ChoiceList>{options.map(option=><ChoiceRow key={option} label={option} selected={choice===option} onClick={()=>setChoice(option)}/>)}</ChoiceList>
    </Overlay>
  </div>;
}
