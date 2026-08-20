import { useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { ActionList, ActionListButton, ChoiceList, ChoiceRow, Overlay } from './Overlay';

type FilterKind = 'trips'|'epd'|'edo'|'fuel'|'directory'|'integrations'|'audit';
const filterSets: Record<FilterKind, {label:string; options:string[]}[]> = {
  trips:[{label:'Статус',options:['Все','Запланирован','Назначен','В пути','Завершён','Отменён']},{label:'Период',options:['Сегодня','7 дней','30 дней']},{label:'ТС',options:['Все ТС','КАМАЗ A123BC','Volvo X456YY']},{label:'Контрагент',options:['Все','ООО «Альфа»','ООО «ТрансЛогистика»']}],
  epd:[{label:'Тип',options:['Все','ЭПЛ','ЭТрН','ЭЗЗ']},{label:'Статус',options:['Все','Ожидает подписи','Отправлен','Принят','Ошибка']},{label:'Период',options:['Сегодня','7 дней','30 дней']}],
  edo:[{label:'Направление',options:['Все','Входящие','Исходящие']},{label:'Статус',options:['Все','На согласовании','Ожидает подписи','Подписан','Отклонён']},{label:'Период',options:['Сегодня','7 дней','30 дней']}],
  fuel:[{label:'Период',options:['Сегодня','7 дней','30 дней']},{label:'Статус',options:['Все','Подтверждено','На согласовании','Отклонено']},{label:'Контроль',options:['Все','Только аномалии','Без отклонений']},{label:'ТС',options:['Все ТС','КАМАЗ A123BC','Volvo X456YY']}],
  directory:[{label:'Статус',options:['Все','Активные','Неактивные']},{label:'Организация',options:['Все','Основная организация','Москва','Казань']}],
  integrations:[{label:'Система',options:['Все','Saby','1С/ERP']},{label:'Статус',options:['Все','В очереди','Выполняется','Успешно','Ошибка']},{label:'Период',options:['Сегодня','7 дней','30 дней']}],
  audit:[{label:'Результат',options:['Все результаты','Успешно','С предупреждением','Отказано']},{label:'Период',options:['Сегодня','7 дней','30 дней']},{label:'Источник',options:['Все','Пользователь','Сервисная учётная запись']}],
};

export function DateRangeButton({ initial='12–18 августа' }: { initial?:string }) {
  const [open,setOpen]=useState(false); const [value,setValue]=useState(initial);
  return <><button type="button" className="btn btn--secondary" onClick={()=>setOpen(true)}><Icon name="calendar"/>{value}</button><Overlay open={open} onClose={()=>setOpen(false)} title="Период отчёта" description="Выберите готовый период. Произвольный диапазон появится после подключения backend-календаря." kicker="Период" size="sm"><ChoiceList>{[initial,'Последние 7 дней','Последние 30 дней','Текущий месяц'].map(item=><ChoiceRow key={item} label={item} selected={item===value} onClick={()=>{setValue(item);setOpen(false)}}/>)}</ChoiceList></Overlay></>;
}

export function ExportButton({ title='Экспорт отчёта', label='Экспорт', formats=['XLSX','CSV','PDF'] }: { title?:string; label?:string; formats?:string[] }) {
  const [open,setOpen]=useState(false); const [format,setFormat]=useState('XLSX');
  return <><button type="button" className="btn btn--secondary" onClick={()=>setOpen(true)}>{label}</button><Overlay open={open} onClose={()=>setOpen(false)} title={title} description="Формат выбирается перед формированием файла. Реальные данные отдаст backend export-endpoint." kicker="Экспорт" size="sm" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setOpen(false)}>Отмена</button><button type="button" className="btn btn--primary" onClick={()=>setOpen(false)}>Подготовить {format}</button></>}><ChoiceList>{formats.map(item=><ChoiceRow key={item} label={item} description={item==='PDF'?'Печатная версия':'Табличные данные'} selected={format===item} onClick={()=>setFormat(item)}/>)}</ChoiceList></Overlay></>;
}

export function FilterButton({ kind, label='Фильтры' }: { kind:FilterKind; label?:string }) {
  const [open,setOpen]=useState(false); const [applied,setApplied]=useState(false);
  return <><button type="button" className={`btn btn--secondary btn--compact ${applied?'is-filtered':''}`} onClick={()=>setOpen(true)}><Icon name="filter"/>{label}{applied && <span className="filter-count">1</span>}</button><Overlay open={open} onClose={()=>setOpen(false)} title="Фильтры" description="Показываем только параметры, которые относятся к текущему реестру." kicker="Отбор" presentation="sheet" footer={<><button type="button" className="btn btn--ghost" onClick={()=>{setApplied(false);setOpen(false)}}>Сбросить</button><button type="button" className="btn btn--primary" onClick={()=>{setApplied(true);setOpen(false)}}>Применить</button></>}><div className="overlay-form-grid">{filterSets[kind].map(filter=><label key={filter.label}><span>{filter.label}</span><select defaultValue={filter.options[0]}>{filter.options.map(option=><option key={option}>{option}</option>)}</select></label>)}</div></Overlay></>;
}

type ContextAction = { title:string; description?:string; icon?:Parameters<typeof Icon>[0]['name']; danger?:boolean; onClick:()=>void };
export function MoreActionsButton({ title='Действия', buttonLabel, children, actions, icon='more' }: { title?:string; buttonLabel?:string; children?:ReactNode; actions?:ContextAction[]; icon?: Parameters<typeof Icon>[0]['name'] }) {
  const [open,setOpen]=useState(false);
  const content = children ?? <ActionList>{(actions ?? []).map(action=><ActionListButton key={action.title} icon={action.icon} title={action.title} description={action.description} danger={action.danger} onClick={()=>{action.onClick();setOpen(false)}}/>)}</ActionList>;
  return <>{buttonLabel ? <button type="button" className="btn btn--secondary" onClick={()=>setOpen(true)}><Icon name={icon}/>{buttonLabel}</button> : <button type="button" className="icon-btn" aria-label={title} title={title} onClick={()=>setOpen(true)}><Icon name={icon}/></button>}<Overlay open={open} onClose={()=>setOpen(false)} title={title} kicker="Контекст" size="sm">{content}</Overlay></>;
}

export function ConfirmActionButton({ className='btn btn--primary', icon, children, title, description, confirmLabel='Подтвердить', danger=false, disabled=false, onConfirm }: { className?:string; icon?:Parameters<typeof Icon>[0]['name']; children:ReactNode; title:string; description:string; confirmLabel?:string; danger?:boolean; disabled?:boolean; onConfirm?:()=>void }) {
  const [open,setOpen]=useState(false);
  return <><button type="button" className={className} disabled={disabled} onClick={()=>setOpen(true)}>{icon&&<Icon name={icon}/>} {children}</button><Overlay open={open} onClose={()=>setOpen(false)} title={title} description={description} kicker="Подтверждение" size="sm" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setOpen(false)}>Отмена</button><button type="button" className={danger?'btn btn--danger':'btn btn--primary'} onClick={()=>{onConfirm?.();setOpen(false)}}>{confirmLabel}</button></>}><div className={`confirmation-illustration ${danger?'is-danger':''}`}><Icon name={danger?'warning':'check'}/></div></Overlay></>;
}
