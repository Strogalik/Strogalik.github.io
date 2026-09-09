import React from 'react';

/** Static commercial proposal. No employee records, forms or backend are implemented here. */
type Children = { children: React.ReactNode };
type IconName = 'person' | 'building' | 'document' | 'money' | 'chart' | 'clock' | 'folder' | 'check';

function Icon({ name, size = 32 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    person: <g><circle cx="16" cy="10" r="5"/><path d="M6 29v-4a10 10 0 0 1 20 0v4"/></g>,
    building: <g><rect x="6" y="3" width="20" height="26" rx="2"/><path d="M12 10h2m4 0h2m-8 6h2m4 0h2M13 29v-7h6v7"/></g>,
    document: <g><path d="M8 3h11l6 6v20H8zM19 3v7h6M12 16h9M12 21h9"/></g>,
    money: <g><rect x="3" y="7" width="26" height="20" rx="3"/><path d="M3 12h26M21 20h4"/></g>,
    chart: <g><path d="M5 28V4M5 28h23M11 24V16M18 24V10M25 24V5"/></g>,
    clock: <g><circle cx="16" cy="16" r="12"/><path d="M16 8v9l6 3"/></g>,
    folder: <g><path d="M3 8h11l3 4h12v15H3zM3 8V5h10l3 3h11v4"/></g>,
    check: <path d="m7 16 6 6L26 8"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand({ large = false }: { large?: boolean }) {
  return <img className={`brand-mark${large ? ' brand-large' : ''}`} src="./TMS.svg" alt="TMS" />;
}
function Frame({ n, theme = 'white', className = '', children }: Children & { n: number; theme?: string; className?: string }) {
  return <section className={`frame theme-${theme} ${className}`} data-screen={n.toString().padStart(2, '0')}>
    <Brand large={n === 1 || n === 12}/>
    <div className="safe">{children}</div>
    <footer className="frame-footer"><span>TMS ASUB · Коммерческое предложение</span><span>{n.toString().padStart(2, '0')} / 12</span></footer>
  </section>;
}
function Label({ children, className = '' }: Children & { className?: string }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}
function Head({ eyebrow, title, supporting, className = '' }: { eyebrow: string; title: React.ReactNode; supporting?: React.ReactNode; className?: string }) {
  return <header className={`section-head ${className}`}><div><Label>{eyebrow}</Label><h2>{title}</h2></div>{supporting && <p className="support">{supporting}</p>}</header>;
}
function Window({ title, children, className = '', note }: Children & { title: string; className?: string; note?: string }) {
  return <div className={`system-window ${className}`}><div className="window-bar"><div className="traffic" aria-hidden="true"><i/><i/><i/></div><span>{title}</span>{note && <small>{note}</small>}</div>{children}</div>;
}
function Point({ title, children }: Children & { title: string }) {
  return <div className="text-point"><h3>{title}</h3><p>{children}</p></div>;
}
function Money({ children, className = '' }: Children & { className?: string }) {
  return <span className={`money ${className}`}>{children}</span>;
}

function Hero() {
  return <Frame n={1} className="hero">
    <div className="hero-copy"><Label>КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</Label>
      <h1>Сотрудники.<br/>Объекты.<br/>Финансы.<br/><em>Одна система.</em></h1>
      <p className="support">От оформления сотрудника и выхода на смену — до затрат по объекту и общей картины бизнеса.</p>
      <div className="hero-price"><Money>250 000 ₽</Money><span>за описанный объём разработки</span></div>
    </div>
    <div className="hero-visual">
      <div className="hero-caption">TMS ASUB / Единый рабочий контур</div>
      <div className="hero-workspace">
        <div className="hero-workspace-head"><span>Система управления компанией</span><Icon name="building"/></div>
        <div className="hero-main-area"><Icon name="person" size={38}/><div><h3>Сотрудник</h3><p>Данные · документы · договор</p></div></div>
        <div className="hero-duo"><div><Icon name="clock"/><h3>Объект и смена</h3><p>Люди, график,<br/>выходы и часы</p></div><div><Icon name="money"/><h3>Затраты и ФОТ</h3><p>Начисления,<br/>план и факт</p></div></div>
        <div className="hero-result"><span>Общая аналитика</span><strong>Результат компании<br/>виден из одной системы.</strong></div>
      </div>
    </div>
  </Frame>;
}

function Scope() {
  const items: { n: string; icon: IconName; title: string; copy: string; detail: string }[] = [
    { n:'01', icon:'person', title:'Сотрудники', copy:'Карточка сотрудника, документы и трудовой договор.', detail:'Кто работает в компании' },
    { n:'02', icon:'building', title:'Объекты', copy:'Команда объекта, график, смены и экономика.', detail:'Где и на каких условиях' },
    { n:'03', icon:'money', title:'Финансы', copy:'Доходы, затраты и фонд оплаты труда с планом и фактом.', detail:'Сколько получаем и тратим' },
    { n:'04', icon:'chart', title:'Аналитика', copy:'Объекты, люди, оформление и результат по периодам.', detail:'Что происходит с бизнесом' },
  ];
  return <Frame n={2} theme="canvas" className="scope">
    <Head eyebrow="ОБЪЁМ ПРОЕКТА" title={<span>Четыре раздела.<br/>Один контекст.</span>} supporting="Сотрудник связан с объектом, смена — с выплатой, выплата — с затратами. Руководитель видит не отдельные таблицы, а компанию целиком."/>
    <div className="scope-window">{items.map((x)=><div className="scope-column" key={x.n}><div className="scope-top"><span>{x.n}</span><Icon name={x.icon}/></div><h3>{x.title}</h3><p>{x.copy}</p><div className="scope-detail">{x.detail}</div></div>)}</div>
    <div className="scope-principle"><span>Принцип связности</span><p>Одни данные используются в кадровом, операционном и финансовом контуре.</p></div>
  </Frame>;
}

function Employee() {
  const basics = ['ФИО и дата рождения','Номер телефона','Фактическое место проживания','Семейное положение','Контакт на случай ЧП'];
  return <Frame n={3} className="employee">
    <div className="employee-copy"><Label>01 / СОТРУДНИКИ</Label><h2>Один сотрудник.<br/>Одна полная<br/>карточка.</h2><p className="support">Действие «Добавить сотрудника» открывает анкету. Основные сведения, документы и подписанный договор хранятся вместе.</p><div className="employee-note"><Icon name="person"/><p>Фото — по желанию.<br/>Обязательные поля определяем в ТЗ.</p></div></div>
    <Window title="Карточка сотрудника" className="employee-window">
      <div className="employee-window-body"><div className="photo-note"><div className="photo-placeholder"><Icon name="person" size={40}/></div><div><h3>Основные сведения</h3><p>Заполняются при добавлении</p></div></div>
      <div className="profile-fields">{basics.map((x)=><div key={x}><span>{x}</span></div>)}</div>
      <div className="children-info"><h3>Дети до 18 лет</h3><p>Есть дети — указываем ФИО и дату рождения каждого. Количество считается по записям.</p><div>Нет детей — дополнительные поля не показываются.</div></div></div>
    </Window>
  </Frame>;
}

function Documents() {
  const docs = ['СНИЛС','ИНН','Водительские права','Частное страхование','Удостоверение частного охранника','Повышение квалификации','Разрешение на оружие'];
  return <Frame n={4} theme="navy" className="documents">
    <Head eyebrow="01 / ЛИЧНОЕ ДЕЛО" title={<span>Реквизиты и сканы.<br/>В одном месте.</span>} supporting="Для каждого документа — данные и вложение. Скан или фотография сохраняются в карточке сотрудника."/>
    <div className="dossier">
      <div className="passport"><div className="passport-head"><Icon name="document" size={36}/><h3>Паспорт</h3></div><div className="passport-fields"><span>ФИО</span><span>Дата рождения</span><span>Серия и номер</span><span>Город рождения</span><span>Адрес регистрации</span><span>Дата выдачи</span></div><div className="passport-scan"><Icon name="folder"/><span>Скан документа</span></div></div>
      <div className="document-list"><div className="document-list-title">Остальные документы</div>{docs.map((d,i)=><div className="document-row" key={d}><span className="document-no">{String(i+1).padStart(2,'0')}</span><span>{d}</span><Icon name="document" size={26}/></div>)}</div>
    </div>
    <p className="document-note">Перечень обязательных документов и состав реквизитов каждого вида фиксируем в техническом задании.</p>
  </Frame>;
}

function Contract() {
  return <Frame n={5} className="contract">
    <div className="contract-copy"><Label>01 / ДОКУМЕНТООБОРОТ</Label><h2>Из карточки —<br/>в трудовой<br/>договор.</h2><p className="support">Система подставляет данные сотрудника в шаблон заказчика. Дата договора — текущая на момент формирования.</p>
      <div className="contract-steps"><Point title="Сформировать">Анкета сотрудника + предоставленный шаблон.</Point><Point title="Скачать">Готовый договор в DOCX или PDF.</Point><Point title="Вернуть подписанный">Загрузить файл в документы сотрудника.</Point></div>
    </div>
    <div className="contract-visual"><div className="document-back"/><div className="contract-paper"><div className="paper-label">ДОКУМЕНТ ПО ШАБЛОНУ ЗАКАЗЧИКА</div><h3>Трудовой<br/>договор</h3><div className="paper-rule"/><div className="paper-item"><span>Сотрудник</span><strong>Данные из карточки</strong></div><div className="paper-item"><span>Дата</span><strong>Дата формирования</strong></div><div className="paper-item"><span>Содержание</span><strong>Утверждённый шаблон</strong></div><div className="paper-formats">DOCX <span>/</span> PDF</div></div><div className="signed-note"><Icon name="check" size={34}/><div><strong>Подписанный экземпляр</strong><p>Хранится в личном деле сотрудника</p></div></div></div>
  </Frame>;
}

function Objects() {
  return <Frame n={6} theme="canvas" className="objects">
    <Head eyebrow="02 / ОБЪЕКТЫ" title={<span>Каждый объект —<br/>полный рабочий контекст.</span>} supporting="Адрес, сотрудники, условия работы и деньги собраны в одной карточке. Не нужно восстанавливать картину по перепискам."/>
    <Window title="Карточка объекта" className="object-window" note="Структура будущего интерфейса">
      <div className="object-body"><div className="object-identity"><Icon name="building" size={46}/><h3>Объект</h3><p>Название<br/>и местонахождение</p><div className="object-identity-bottom">Своя команда.<br/>Свой график.<br/>Своя экономика.</div></div>
        <div className="object-info"><Label>ЛЮДИ И РАБОТА</Label><Point title="Сотрудники">Назначение людей на объект.</Point><Point title="График">Расписание, продолжительность смен и часы.</Point><Point title="История">Выходы и невыходы на каждую смену.</Point></div>
        <div className="object-info"><Label>ЭКОНОМИКА</Label><Point title="Доход компании">Сколько объект приносит фирме.</Point><Point title="Способ оплаты">Наличные или безналичные расчёты.</Point><Point title="Оплата сотруднику">Ставка за смену и её длительность.</Point></div>
      </div>
    </Window>
  </Frame>;
}

function Shifts() {
  return <Frame n={7} className="shifts">
    <Head eyebrow="02 / СМЕНЫ И ВЫПЛАТЫ" title={<span>Кто вышел.<br/>Сколько начислено.</span>} supporting="Плановый график, фактические выходы и выплаты сотрудникам рассматриваются вместе. История смен сохраняется."/>
    <div className="shift-columns"><div className="shift-history"><Label>УЧЁТ СМЕН</Label><h3>План и факт<br/>по каждому сотруднику</h3><div className="shift-table"><div className="shift-table-head"><span>План</span><span>Факт</span></div><div><span>Назначенная смена</span><span>Вышел / не вышел</span></div><div><span>Часы и ставка</span><span>Отработанные часы</span></div><div><span>Ожидаемая выплата</span><span>Фактическая выплата</span></div></div></div>
      <div className="payroll-panel"><Label>ФОНД ОПЛАТЫ ТРУДА</Label><h3>Начисления отдельно.<br/>Способ выплаты отдельно.</h3><p>Основная зарплата и дополнительные начисления задаются вручную. Наличные и безналичные выплаты учитываются отдельно.</p><div className="payroll-band">Все суммы входят в общий ФОТ.</div><p className="payroll-small">Статус оформления сотрудника не подменяется способом выплаты. Правила начислений фиксируем в ТЗ.</p></div>
    </div>
  </Frame>;
}

function Costs() {
  return <Frame n={8} theme="ice" className="costs">
    <Head eyebrow="02 / ЗАТРАТЫ ОБЪЕКТА" title={<span>План рядом с фактом.<br/>По каждой статье.</span>} supporting="У каждого объекта — свой раздел затрат. Фонд оплаты труда подгружается из данных по сотрудникам и сменам."/>
    <div className="cost-window"><div className="cost-table-head"><span>Статья затрат</span><span>Источник</span><span>План</span><span>Факт</span></div>
      <div className="cost-table-row"><strong>Фонд оплаты труда</strong><span>Автоматически из общего ФОТ</span><span>Начисления</span><span>Выплаты</span></div>
      <div className="cost-table-row"><strong>Постоянные</strong><span>Регулярные затраты объекта</span><span>Плановая сумма</span><span>Фактическая сумма</span></div>
      <div className="cost-table-row"><strong>Единоразовые</strong><span>Разовые расходы</span><span>Плановая сумма</span><span>Фактическая сумма</span></div>
      <div className="cost-table-row"><strong>Другие статьи</strong><span>Добавляются вручную</span><span>Плановая сумма</span><span>Фактическая сумма</span></div>
      <div className="cost-total"><h3>Полная стоимость объекта</h3><p>ФОТ + постоянные + единоразовые + другие затраты</p></div>
    </div>
    <div className="cost-note">ФОТ используется как единый источник данных, а не вводится повторно в каждом отчёте.</div>
  </Frame>;
}

function Finance() {
  return <Frame n={9} theme="navy" className="finance">
    <Head eyebrow="03 / ФИНАНСЫ" title={<span>От общей суммы —<br/>до конкретной выплаты.</span>} supporting="Сколько компания зарабатывает и тратит сейчас. Каждый итог раскрывается до объекта, статьи затрат или сотрудника."/>
    <div className="finance-paths">
      <div className="finance-path"><div className="finance-path-title"><Icon name="money"/><h3>Доходы</h3></div><div className="finance-level"><span>Компания</span><p>Общий доход</p></div><div className="finance-level"><span>Объект</span><p>Сколько приносит каждый</p></div><div className="finance-level finance-last"><span>Детализация</span><p>Доход по выбранному объекту</p></div></div>
      <div className="finance-path"><div className="finance-path-title"><Icon name="folder"/><h3>Расходы</h3></div><div className="finance-level"><span>Компания</span><p>Все затраты</p></div><div className="finance-level"><span>Объект</span><p>Сколько потрачено на него</p></div><div className="finance-level finance-last"><span>Статья</span><p>На что именно ушли деньги</p></div></div>
      <div className="finance-path finance-path-blue"><div className="finance-path-title"><Icon name="person"/><h3>ФОТ</h3></div><div className="finance-level"><span>Компания</span><p>Общий фонд оплаты труда</p></div><div className="finance-level"><span>Сотрудник</span><p>Кому и сколько платим</p></div><div className="finance-level finance-last"><span>План / факт</span><p>Начислено и выплачено</p></div></div>
    </div>
  </Frame>;
}

function Analytics() {
  const metrics = ['Количество объектов','Количество сотрудников','Оформлены / не оформлены','Оборот компании','Общие затраты'];
  return <Frame n={10} theme="canvas" className="analytics">
    <Head eyebrow="04 / ОБЩАЯ АНАЛИТИКА" title={<span>Вся компания —<br/>в одной картине.</span>} supporting="Ключевые показатели, факт предыдущего периода и план следующего. Краткое сравнение и график изменений."/>
    <div className="analytics-window"><div className="analytics-metrics">{metrics.map((m,i)=><div key={m}><span className="metric-mark">{String(i+1).padStart(2,'0')}</span><strong>{m}</strong></div>)}</div>
      <div className="analytics-bottom"><div className="period-copy"><Label>ПО ПЕРИОДАМ</Label><h3>Что было.<br/>Что сейчас.<br/><em>Что запланировано.</em></h3><p>Факт и план не смешиваются: у каждого периода — свой статус.</p></div><div className="period-chart"><div className="chart-columns"><div><div className="period-bar previous"/><strong>Предыдущий</strong><span>Факт</span></div><div><div className="period-bar current"/><strong>Текущий</strong><span>Текущий срез</span></div><div><div className="period-bar next"/><strong>Следующий</strong><span>План</span></div></div><p>Схема отчёта. Реальные значения появятся после заполнения системы.</p></div></div>
    </div>
  </Frame>;
}

function Agreement() {
  return <Frame n={11} className="agreement">
    <Head eyebrow="ПЕРЕД НАЧАЛОМ РАЗРАБОТКИ" title={<span>Фиксируем детали.<br/>Не оставляем пробелов.</span>} supporting="Четыре функциональных раздела входят в предложение. Детальные правила работы согласуем в техническом задании."/>
    <div className="agreement-grid"><div className="agreement-panel"><Label>ОТ ЗАКАЗЧИКА</Label><Point title="Анкета и документы">Обязательные поля, виды документов и реквизиты.</Point><Point title="Шаблон трудового договора">Реквизиты работодателя, должность, дата начала работы и условия оплаты.</Point><Point title="Примеры учёта">Объекты, графики, статьи затрат и используемые периоды отчётности.</Point></div>
    <div className="agreement-panel agreement-blue"><Label>СОГЛАСУЕМ В ТЗ И ДОГОВОРЕ</Label><Point title="Расчёты и правила">Смены, неполные выходы, начисления, выплаты и распределение ФОТ по объектам.</Point><Point title="Работа с данными">Роли доступа, хранение сканов, данных сотрудников и сведений о детях.</Point><Point title="Условия проекта">Сроки, этапы оплаты, инфраструктура и сопровождение после запуска.</Point></div></div>
    <p className="agreement-note">Точные сроки и порядок оплаты в исходных вводных не заданы — фиксируются отдельно.</p>
  </Frame>;
}

function Final() {
  return <Frame n={12} theme="navy" className="final">
    <div className="final-top"><Label>СТОИМОСТЬ ПРОЕКТА</Label><p>Разработка TMS ASUB<br/>под описанные процессы компании.</p></div>
    <div className="final-offer"><div className="final-price"><Money>250 000 ₽</Money><span>за описанный объём работ</span></div><div className="final-included"><span>В предложении</span><div><b>01</b><p>Сотрудники и документооборот</p></div><div><b>02</b><p>Объекты, смены и затраты</p></div><div><b>03</b><p>Финансы и фонд оплаты труда</p></div><div><b>04</b><p>Общая аналитика, план / факт</p></div></div></div>
    <div className="final-bottom"><h2>Один бизнес.<br/>Одна система.</h2><div><h3>Согласуем ТЗ —<br/>перейдём к реализации.</h3><p>Первый шаг — утвердить обязательные поля,<br/>правила расчётов и шаблон договора.</p></div></div>
    <p className="final-terms">Сроки, порядок оплаты, сопровождение и инфраструктура фиксируются в договоре.</p>
  </Frame>;
}

export default function App() {
  return <main className="deck"><Hero/><Scope/><Employee/><Documents/><Contract/><Objects/><Shifts/><Costs/><Finance/><Analytics/><Agreement/><Final/></main>;
}
