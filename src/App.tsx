import React, { type ReactNode } from 'react';

type IconName = 'people' | 'key' | 'calendar' | 'task' | 'shop' | 'chart' | 'audit' | 'mail' | 'phone' | 'building' | 'clock' | 'check';
function Icon({ name, size = 34 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 2 4v3"/></>,
    key: <><circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-5-5 3-3m-6 0 3-3"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v5m10-5v5M3 11h18m-13 4h2m4 0h2m-8 3h2"/></>,
    task: <><rect x="5" y="4" width="15" height="18" rx="2"/><path d="M9 2h7v4H9zm0 11 2 2 5-5m-7 9h7"/></>,
    shop: <><path d="M3 9h18l-2-6H5L3 9Zm1 0v11h16V9M8 20v-7h5v7"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></>,
    chart: <><path d="M4 3v18h18M9 16v-5m5 5V7m5 9v-8"/></>,
    audit: <><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zm-1 9 2 2 5-5m-7 9h8"/></>,
    mail: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></>,
    phone: <path d="m7 3-3 1c-3 7 8 18 15 15l2-3-5-3-2 2c-3-1-5-3-6-6l2-2-3-4Z"/>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2m4 0h2M8 11h2m4 0h2m-7 9v-5h6v5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function Frame({ n, theme = 'white', name, children }: { n: number; theme?: string; name: string; children: ReactNode }) {
  return <section className={`frame ${theme} ${name}`} data-frame={n} aria-label={`${String(n).padStart(2, '0')}. ${name}`}>
    <img className="brand" src="./TMS.svg" alt="TMS" width={48} height={48}/>
    <div className="safe">{children}</div>
    <footer><span>TMS ASUB / Управленческий контур</span><span>{String(n).padStart(2, '0')} / 10</span></footer>
  </section>;
}
function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div>; }
function Head({ label, title, copy }: { label: string; title: ReactNode; copy: ReactNode }) {
  return <header className="section-head"><div><Eyebrow>{label}</Eyebrow><h2>{title}</h2></div><p className="support">{copy}</p></header>;
}
function Window({ title, note, children, className = '' }: { title: string; note?: string; children: ReactNode; className?: string }) {
  return <div className={`window ${className}`}><div className="window-top"><div className="traffic" aria-hidden="true"><i/><i/><i/></div><span>{title}</span>{note && <small>{note}</small>}</div>{children}</div>;
}
function Status({ tone, children }: { tone: string; children: ReactNode }) { return <span className={`status ${tone}`}><i/>{children}</span>; }

function Hero() {
  return <Frame n={1} name="hero">
    <div className="hero-copy"><Eyebrow>КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</Eyebrow>
      <h1>Управленческий<br/>контур TMS.<br/><em>Вся сеть —<br/>в одной системе.</em></h1>
      <p className="support">Дилеры, клиенты, задачи и календарь — в общем контексте. Руководитель видит работу сети, команда понимает следующий шаг.</p>
      <div className="hero-sign">Один бизнес. Одна система.</div>
    </div>
    <div className="hero-visual"><div className="visual-kicker">Доступ · работа · контроль</div>
      <Window title="Управленческий контур" note="TMS" className="hero-window">
        <div className="hero-director"><Icon name="people" size={38}/><div><span className="overline">РУКОВОДИТЕЛЬ</span><h3>Общая картина сети</h3></div></div>
        <div className="hero-split"><div><Icon name="key"/><h3>Дилер</h3><p>Свой аккаунт.<br/>Доступ от директора.</p></div><div><Icon name="calendar"/><h3>Команда</h3><p>Задачи, даты<br/>и напоминания.</p></div></div>
        <div className="hero-colors"><span>Клиенты не теряются из виду</span><div><i className="dot green"/><i className="dot yellow"/><i className="dot red"/><strong>Приоритет виден сразу</strong></div></div>
      </Window>
      <p className="visual-note">Схема решения по вашему запросу</p>
    </div>
  </Frame>;
}
function Contour() {
  const cols: { icon: IconName; title: string; lines: string[] }[] = [
    {icon:'chart',title:'Руководитель',lines:['Сводка по сети','План и факт','Работа менеджеров']},
    {icon:'people',title:'Дилеры и клиенты',lines:['Личные аккаунты','Регистрационные данные','Цветовые напоминания']},
    {icon:'task',title:'Ежедневная работа',lines:['Задачи и сроки','Календарь команды','Аудиты торговых точек']},
  ];
  return <Frame n={2} theme="canvas" name="contour">
    <Head label="ОДНО РАБОЧЕЕ ПРОСТРАНСТВО" title={<>Не отдельные сервисы.<br/>Связный контур.</>} copy="В одном пространстве видны участники, договорённости, задачи и результат. Не нужно собирать картину из разных разделов вручную."/>
    <Window title="TMS ASUB" note="Операционная система для бизнеса" className="contour-window"><div className="contour-columns">{cols.map(c=><div className="contour-column" key={c.title}><Icon name={c.icon} size={40}/><h3>{c.title}</h3><div>{c.lines.map(l=><p key={l}>{l}</p>)}</div></div>)}</div><div className="contour-bottom"><span>Торговый контур</span><strong>Заказы · товарный каталог · склады</strong></div></Window>
    <p className="source-note">Сводка, аудиты, менеджеры, задачи, календарь и торговля показаны на предоставленных экранах. Дилерский доступ и напоминания — акцент этого предложения.</p>
  </Frame>;
}
function Dealers() {
  return <Frame n={3} name="dealers">
    <div className="dealer-copy"><Eyebrow>ДИЛЕРСКИЙ ДОСТУП</Eyebrow><h2>У каждого дилера —<br/>свой аккаунт.</h2><p className="support">Доступ предоставляет директор. Почта используется как логин, пароль генерируется самостоятельно.</p>
      <div className="dealer-facts"><div><span>01</span><p>Директор предоставляет доступ.</p></div><div><span>02</span><p>У дилера появляется личный вход.</p></div><div><span>03</span><p>Данные регистрации собраны в одной записи.</p></div></div>
    </div>
    <Window title="Регистрация дилера" className="dealer-window" note="Состав данных"><div className="dealer-identity"><Icon name="building" size={42}/><div><span className="overline">ЛИЧНЫЙ АККАУНТ</span><h3>Дилер</h3></div><span className="access-label">Доступ от директора</span></div><div className="registration-rows"><div><Icon name="building"/><strong>ИНН</strong><span>Идентификатор компании</span></div><div><Icon name="phone"/><strong>Телефон</strong><span>Контактный номер</span></div><div><Icon name="mail"/><strong>Почта</strong><span>Контакт и логин</span></div></div><div className="login-band"><Icon name="key"/><div><h3>Пароль</h3><p>Генерируется самостоятельно</p></div></div></Window>
    <div className="bottom-note"><strong>Важные данные при регистрации:</strong><span>ИНН, телефон и почта.</span></div>
  </Frame>;
}
function Tasks() {
  return <Frame n={4} theme="navy" name="tasks">
    <Head label="ЗАДАЧИ И ОТВЕТСТВЕННОСТЬ" title={<>У задачи есть человек.<br/>И конкретная дата.</>} copy="Задачи команды, назначения и просрочки видны в одном разделе. Даты помогают не оставлять следующий шаг на уровне устной договорённости."/>
    <div className="task-stage"><div className="task-principle"><span className="large-index">01</span><h3>Что сделать</h3><p>Понятная задача<br/>для команды.</p></div><div className="task-principle"><span className="large-index">02</span><h3>Кто отвечает</h3><p>Назначенный<br/>исполнитель.</p></div><div className="task-principle"><span className="large-index">03</span><h3>К какой дате</h3><p>Срок в общей<br/>системе работы.</p></div></div>
    <div className="task-statuses"><span>Состояние задачи</span><div><b>К выполнению</b><b>В работе</b><b>На проверке</b><b className="complete">Выполнено</b></div></div>
    <p className="bottom-light">Руководитель видит назначения и просрочки, а не только общее количество задач.</p>
  </Frame>;
}
function Calendar() {
  const days = Array.from({length:35},(_,i)=>i===0?31:i>30?i-30:i);
  const events: Record<number,{text:string;kind:string}> = {7:{text:'Задача',kind:'task'},9:{text:'Звонок',kind:'call'},14:{text:'Встреча',kind:'meet'},16:{text:'Задача',kind:'task'},21:{text:'Напоминание',kind:'remind'},24:{text:'Встреча',kind:'meet'}};
  return <Frame n={5} name="calendar">
    <div className="calendar-copy"><Eyebrow>КАЛЕНДАРЬ КОМАНДЫ</Eyebrow><h2>Работа по датам.<br/><em>Не по памяти.</em></h2><p className="support">Задачи, напоминания, звонки и встречи видны по дням. Понятно, что запланировано и к чему нужно подготовиться.</p><div className="calendar-legend"><span><i className="cal-dot task"/>Задачи</span><span><i className="cal-dot remind"/>Напоминания</span><span><i className="cal-dot call"/>Звонки</span><span><i className="cal-dot meet"/>Встречи</span></div></div>
    <Window title="Сентябрь 2026" note="Пример отображения" className="calendar-window"><div className="calendar-week">{['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].map(x=><span key={x}>{x}</span>)}</div><div className="calendar-grid">{days.map((d,i)=><div key={i} className={`day ${i===0||i>30?'muted':''} ${d===14?'today':''}`}><span>{d}</span>{i>0&&i<=30&&events[d]&&(events[d].kind==='remind'?<span className="calendar-reminder-dot" aria-label="Напоминание"/>:<div className={`calendar-event ${events[d].kind}`}>{events[d].text}</div>)}</div>)}</div><div className="calendar-bottom"><Icon name="clock" size={24}/><span>Один календарь для ежедневной работы команды</span></div></Window>
  </Frame>;
}
function Reminders() {
  const rows=[{n:'01',tone:'green',label:'Актуальна',copy:'Актуальное напоминание'}, {n:'02',tone:'yellow',label:'Грядущая',copy:'Предстоящее напоминание'}, {n:'03',tone:'red',label:'Уделить внимание',copy:'Клиент требует внимания'}];
  return <Frame n={6} theme="canvas" name="reminders">
    <Head label="НАПОМИНАНИЯ В СПИСКЕ КЛИЕНТОВ" title={<>Нужный клиент<br/>сразу в поле зрения.</>} copy="Цвет выделяет состояние напоминания прямо в списке. Не нужно открывать каждую карточку, чтобы увидеть, кому уделить внимание."/>
    <Window title="Клиенты" note="Схема отображения" className="reminder-window"><div className="client-table-head"><span>Клиент</span><span>Напоминание</span><span>Что означает цвет</span></div>{rows.map(r=><div key={r.n} className={`client-row ${r.tone}`}><div className="client-name"><span>{r.n}</span><strong>Клиент</strong></div><Status tone={r.tone}>{r.label}</Status><p>{r.copy}</p></div>)}</Window>
    <div className="reminder-legend"><span><i className="dot green"/>Зелёный — актуальна</span><span><i className="dot yellow"/>Жёлтый — грядущая</span><span><i className="dot red"/>Красный — уделить внимание</span></div>
    <p className="source-note">Временные границы состояний напоминания фиксируем в техническом задании.</p>
  </Frame>;
}
function Director() {
  return <Frame n={7} theme="navy" name="director">
    <Head label="СВОДКА РУКОВОДИТЕЛЯ" title={<>Видеть сеть целиком.<br/>Не собирать её по частям.</>} copy="Продажи, выполнение плана и работа торговых точек — в одной управленческой картине. Детали остаются в профильных разделах."/>
    <div className="director-grid"><div className="director-main"><Icon name="chart" size={44}/><span className="overline">ПЛАН / ФАКТ</span><h3>Что планировали.<br/>Что получили.</h3><p>Общий план и фактическая отгрузка за выбранный месяц.</p><div className="plan-fact"><div><span>План</span><strong>Ориентир</strong></div><div><span>Факт</span><strong>Результат</strong></div></div></div><div className="director-detail"><div><Icon name="audit"/><section><h3>Аудиты</h3><p>Чек-лист, фотографии и история работы в торговых точках.</p></section></div><div><Icon name="people"/><section><h3>Менеджеры</h3><p>Выполнение звонков, аудитов и еженедельных задач.</p></section></div><div><Icon name="shop"/><section><h3>Торговля</h3><p>Заказы, товарный каталог, склады и операционная аналитика.</p></section></div></div></div>
  </Frame>;
}
function Devices() {
  return <Frame n={8} name="devices">
    <Head label="КОМПЬЮТЕР И ТЕЛЕФОН" title={<>В офисе — обзор.<br/>На месте — действие.</>} copy="Общий визуальный язык для руководителя и команды. Сводка, задачи, календарь и аудиты представлены на компьютере и телефоне."/>
    <div className="device-scene"><div className="desktop-example"><div className="device-label">На компьютере</div><Window title="Работа команды" note="Схема интерфейса"><div className="desktop-body"><h3>Общая картина</h3><div className="desktop-duo"><div><Icon name="chart"/><strong>План и факт</strong><span>Сводка по сети</span></div><div><Icon name="people"/><strong>Менеджеры</strong><span>Работа команды</span></div></div><div className="desktop-list"><span>Задачи и календарь</span><p>Назначения, даты, встречи и напоминания</p></div></div></Window></div><div className="mobile-example"><div className="device-label">На телефоне</div><div className="mobile-surface"><div className="mobile-top"><span>TMS ASUB</span><Icon name="audit" size={24}/></div><h3>Мои аудиты</h3><p>Работа в торговых точках</p><div className="mobile-entry"><Icon name="shop"/><strong>Торговая точка</strong><span>Чек-лист</span><span>Фотографии</span><span>История</span></div><div className="mobile-foot"><span>Задачи</span><span>Календарь</span></div></div></div></div>
  </Frame>;
}
function Scope() {
  const list=['Личный аккаунт каждого дилера','Регистрация: ИНН, телефон и почта','Доступ предоставляет директор','Задачи и календарь с датами','Цветовые напоминания в списке клиентов'];
  return <Frame n={9} theme="canvas" name="scope">
    <Head label="ОБЪЁМ ПРЕДЛОЖЕНИЯ" title={<>Понятный состав.<br/>Без скрытых допущений.</>} copy="Новый контур собираем вокруг дилеров и ежедневной работы команды. Детали доступа и правила напоминаний закрепляем до разработки."/>
    <div className="scope-grid"><div className="scope-main"><h3>Основа запроса</h3>{list.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><p>{x}</p></div>)}</div><div className="scope-aside"><h3>Что согласуем в ТЗ</h3><p>Права директора и дилера.</p><p>Кто генерирует и передаёт пароль.</p><p>Когда напоминание меняет цвет.</p><p>Данные и необходимые интеграции.</p><div className="scope-commercial"><span>Коммерческие условия</span><strong>Стоимость и сроки —<br/>после согласования объёма.</strong></div></div></div>
  </Frame>;
}
function Finale() {
  return <Frame n={10} theme="navy" name="finale">
    <div className="final-bridge"><div><span>ДИРЕКТОР</span><p>Предоставляет доступ.<br/>Видит общую картину.</p></div><div><span>ДИЛЕР</span><p>Получает свой аккаунт.<br/>Входит по своей почте.</p></div><div><span>КОМАНДА</span><p>Работает с задачами,<br/>датами и напоминаниями.</p></div></div>
    <h2 className="brand-statement">Один бизнес.<br/>Одна система.</h2><p className="final-category">TMS ASUB · Управленческий контур</p>
    <div className="final-invite"><p>Дилеры, команда и клиенты — в общем контексте.</p><strong>Обсудим вашу систему управления.</strong></div>
  </Frame>;
}
export default function App() { return <main className="deck"><Hero/><Contour/><Dealers/><Tasks/><Calendar/><Reminders/><Director/><Devices/><Scope/><Finale/></main>; }
