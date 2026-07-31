(() => {
  'use strict';

  const app = document.getElementById('app');
  const params = new URLSearchParams(location.search);
  const isFigma = params.get('figma') === '1';
  let storedRole = 'leader';
  try { storedRole = localStorage.getItem('tms-role') || 'leader'; } catch (_) {}
  const requestedRole = params.get('role') || storedRole;
  const initialRole = ['leader','manager','logistics'].includes(requestedRole) ? requestedRole : 'leader';

  const state = {
    route: location.hash.replace('#', '') || 'home',
    role: initialRole,
    sheet: params.get('sheet') || null,
    toast: '',
    reportSort: 'plan',
    clientSort: 'activity',
    clientPlanPeriod: 'month',
    taskFilter: 'today',
    calendarDate: 29,
    shopTab: 'orders',
    orderStatus: 'new',
    expandedOrder: '00421',
    analyticsMetric: 'revenue',
    reportPeriod: 'july',
    notificationFilter: 'all',
    shopPeriod: 'month',
    reportPeriod: 'july',
    shopPeriod: 'month',
    notificationFilter: 'all',
    selectedEmployee: 'anna',
    dialNumber: '+7 999 123-45-67',
    callContact: { name: 'Дом декора', phone: '+7 910 442-18-09', initials: 'ДД' },
    callSource: 'calls',
    callGoal: 'Узнать ситуацию',
    selectedContractor: 'artstena',
    contractorStatuses: {
      artstena: 'Активен',
      river: 'Требует проверки',
    },
    callMuted: false,
    callSpeaker: false,
    ratings: {},
    forceFigmaSheet: false,
  };

  const ROLE = {
    leader: {
      name: 'Александр Крылов',
      initials: 'АК',
      label: 'Руководитель направления',
      subtitle: 'ALTDEKOR · Все регионы',
    },
    manager: {
      name: 'Анна Соколова',
      initials: 'АС',
      label: 'Менеджер',
      subtitle: 'ALTDEKOR · Южный регион',
    },
    logistics: {
      name: 'Сергей Логинов',
      initials: 'СЛ',
      label: 'Логист',
      subtitle: 'ALTDEKOR · Торговый контур',
    },
  };

  const CONTRACTORS = {
    artstena: {
      name: 'ООО «АртСтена»',
      shortName: 'АртСтена',
      initials: 'АС',
      inn: '7701234567',
      ogrn: '1157746123456',
      city: 'Москва',
      contact: 'Марина Орлова',
      phone: '+7 999 421-18-07',
      email: 'office@artstena.ru',
      collections: 'Все коллекции',
    },
    river: {
      name: 'River House',
      shortName: 'River House',
      initials: 'RH',
      inn: '6901020304',
      ogrn: '1186952012345',
      city: 'Тверь',
      contact: 'Алексей Малев',
      phone: '+7 999 213-44-10',
      email: 'sales@riverhouse.ru',
      collections: 'Loft, Provence',
    },
  };

  const screens = {
    leader: [
      ['home','01. Главная — руководитель'],['revenue-detail','02. Выручка — детализация'],['reports','03. План-факт'],['report-month','04. Аналитика месяца'],['report-stores','05. План-факт по магазинам'],['stores','06. Магазины'],['store-detail','07. Карточка магазина'],['store-plan','08. Выполнение плана'],['store-history','09. Вся история'],['audit-dashboard','10. Аудиты — аналитика'],['audit-detail','11. Просмотр аудита'],['tasks','12. Задачи руководителя'],['task-detail','13. Карточка задачи'],['calendar','14. Календарь'],['leads','15. Клиенты и дилеры'],['lead-detail','16. Карточка клиента'],['calls','17. Телефония команды'],['call-dialer','18. Набор номера'],['call-active','19. Экран звонка'],['call-ended','20. Звонок завершён'],['call-detail','21. AI-анализ звонка'],['assistant','22. AI-ассистент руководителя'],['notifications','23. Уведомления'],['more','24. Все модули'],['profile','25. Профиль'],['profile-edit','26. Личные данные'],['team','27. Сотрудники'],['team-member','28. Роль сотрудника'],
    ],
    manager: [
      ['home','01. Главная — менеджер'],['revenue-detail','02. Моя выручка'],['reports','03. Мой план-факт'],['report-month','04. Моя аналитика месяца'],['report-stores','05. Мои магазины в отчёте'],['stores','06. Мои магазины'],['store-detail','07. Карточка моего магазина'],['store-plan','08. Выполнение плана магазина'],['store-history','09. История магазина'],['audits','10. Мои аудиты'],['audit','11. Новый аудит'],['audit-detail','12. Мой аудит'],['tasks','13. Мои задачи'],['task-detail','14. Карточка задачи'],['calendar','15. Мой календарь'],['leads','16. Мои клиенты'],['lead-detail','17. Карточка клиента'],['calls','18. Моя телефония'],['call-dialer','19. Набор номера'],['call-active','20. Экран звонка'],['call-ended','21. Звонок завершён'],['call-detail','22. AI-анализ моего звонка'],['product-ai','23. AI по продукции'],['notifications','24. Уведомления'],['more','25. Все модули'],['profile','26. Профиль'],['profile-edit','27. Личные данные'],
    ],
    logistics: [
      ['home','01. Главная — логист'],['logistics-stores','02. Рейтинг торговых точек'],['shop-orders','03. Заказы'],['shop-order-detail','04. Детали заказа'],['shop-analytics','05. Аналитика торговли'],['shop-analytics-detail','06. Детали аналитики'],['shop-catalog','07. Каталог'],['shop-warehouses','08. Склады'],['shop-collections','09. Коллекции'],['shop-products','10. Товары'],['shop-stock','11. Остатки'],['shop-contractors','12. Контрагенты'],['notifications','13. Уведомления'],['more','14. Все модули'],['profile','15. Профиль'],['profile-edit','16. Личные данные'],
    ],
  };

  const shopScreens = [
    ['shop-orders','Торговля — заказы'],['shop-order-detail','Торговля — карточка заказа'],['shop-analytics','Торговля — аналитика'],['shop-analytics-detail','Торговля — подробная аналитика'],['shop-catalog','Торговля — каталог'],['shop-warehouses','Торговля — склады'],['shop-collections','Торговля — коллекции'],['shop-products','Торговля — товары'],['shop-stock','Торговля — остатки'],['shop-contractors','Торговля — контрагенты'],['form-warehouse','Форма склада'],['form-collection','Форма коллекции'],['form-product','Форма товара'],['form-stock','Форма остатка'],['form-contractor','Форма контрагента'],
  ];

  const svgPaths = {
    home:'<path d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    store:'<path d="M4 10h16l-1.5-6h-13z"/><path d="M5 10v10h14V10M8 20v-6h8v6"/>',
    tasks:'<path d="M9 5h11M9 12h11M9 19h11"/><path d="m3 5 1.5 1.5L7 3.5M3 12l1.5 1.5L7 10.5M3 19l1.5 1.5L7 17.5"/>',
    ai:'<path d="M12 3a7 7 0 0 0-7 7c0 4.5-2 6-2 6h7v3l3-3h1a7 7 0 0 0 0-14z"/><path d="M9 9h.01M13 9h.01M17 9h.01"/>',
    more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users:'<path d="M16 21a6 6 0 0 0-12 0M10 11a4 4 0 1 0 0-8"/><path d="M17 11a3 3 0 1 0 0-6M22 21a5 5 0 0 0-5-5"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/>',
    mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/>',
    chart:'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
    camera:'<path d="M14.5 4 16 7h4a2 2 0 0 1 2 2v10H2V9a2 2 0 0 1 2-2h4l1.5-3z"/><circle cx="12" cy="13" r="4"/>',
    wifiOff:'<path d="m2 2 20 20M8.5 8.5A9 9 0 0 1 20 10M5 12a9 9 0 0 1 1.5-1.3M9 16a4 4 0 0 1 6 0M12 20h.01"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    repeat:'<path d="m17 1 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    play:'<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
    sparkle:'<path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    box:'<path d="m21 8-9-5-9 5 9 5z"/><path d="m3 8 9 5 9-5v10l-9 5-9-5zM12 13v10"/>',
    warehouse:'<path d="M3 21V8l9-5 9 5v13M7 21v-8h10v8M7 16h10"/>',
    collection:'<path d="m12 2 4 4-4 4-4-4zM5 10l4 4-4 4-4-4zM19 10l4 4-4 4-4-4zM12 14l4 4-4 4-4-4z"/>',
    balance:'<path d="M12 3v18M5 6h14M5 6l-3 6h6zM19 6l-3 6h6zM8 21h8"/>',
    grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    edit:'<path d="M4 20h4L20 8l-4-4L4 16zM14 6l4 4"/>',
    trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 14v7h16v-7"/>',
    close:'<path d="M5 5l14 14M19 5 5 19"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
    trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v5M8 21h8M9 18h6"/>',
    trend:'<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    sort:'<path d="M8 6h12M8 12h9M8 18h6M4 5v14m-2-2 2 2 2-2"/>',
    eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    logout:'<path d="M10 17l5-5-5-5M15 12H3M21 3v18h-8"/>',
    keypad:'<circle cx="6" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="18" cy="6" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="12" cy="18" r="1"/><circle cx="18" cy="18" r="1"/>',
    volume:'<path d="M11 5 6 9H2v6h4l5 4zM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
    mute:'<path d="M11 5 6 9H2v6h4l5 4zM18 9l-6 6M12 9l6 6"/>',
    phoneOff:'<path d="m2 2 20 20M16.5 16.5c1.2.4 2.5.7 3.8.8a2 2 0 0 1 1.7 2v2a2 2 0 0 1-2.2 2A20 20 0 0 1 3 6.2 2 2 0 0 1 5 4h2a2 2 0 0 1 2 1.7c.1.8.3 1.6.5 2.4"/>',
    truck:'<path d="M3 5h11v12H3zM14 9h4l3 3v5h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    save:'<path d="M5 3h12l2 2v16H5z"/><path d="M8 3v6h8V3M8 21v-8h8v8"/>',
  };

  function icon(name, size = 20, extra = '') {
    return `<svg ${extra} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name] || svgPaths.info}</svg>`;
  }

  function profileData() { return ROLE[state.role]; }
  function isLeader() { return state.role === 'leader'; }
  function isManager() { return state.role === 'manager'; }
  function isLogistics() { return state.role === 'logistics'; }
  function roleGuard(route) {
    if (isLogistics()) {
      const allowed = new Set(['home','logistics-stores','shop-orders','shop-catalog','shop-order-detail','shop-analytics','shop-analytics-detail','shop-warehouses','shop-collections','shop-products','shop-stock','shop-contractors','form-warehouse','form-collection','form-product','form-stock','form-contractor','call-dialer','call-active','call-ended','notifications','more','profile','profile-edit']);
      if (route === 'stores' || route === 'report-stores' || route === 'reports') return 'logistics-stores';
      return allowed.has(route) ? route : 'home';
    }
    const leaderOnly = ['assistant','audit-dashboard','team','team-member'];
    const managerOnly = ['audit'];
    if (!isLeader() && leaderOnly.includes(route)) return route === 'assistant' ? 'product-ai' : route === 'team' || route === 'team-member' ? 'profile' : 'audits';
    if (isLeader() && managerOnly.includes(route)) return 'audit-dashboard';
    return route;
  }
  function go(route, options = {}) {
    state.route = roleGuard(route);
    state.sheet = options.sheet || null;
    if (!isFigma) location.hash = state.route;
    render();
  }

  function switchRole(role) {
    state.role = ['leader','manager','logistics'].includes(role) ? role : 'leader';
    try { localStorage.setItem('tms-role', state.role); } catch (_) {}
    state.route = 'home';
    state.sheet = null;
    if (!isFigma) location.hash = 'home';
    render();
  }
  function showSheet(type) { state.sheet = type; render(); }
  function closeSheet() { state.sheet = null; render(); }
  function selectedContractor() { return CONTRACTORS[state.selectedContractor] || CONTRACTORS.artstena; }
  function callBackRoute() { return state.callSource === 'shop-contractors' ? 'shop-contractors' : 'calls'; }
  function toast(text) {
    state.toast = text;
    render();
    setTimeout(() => { state.toast = ''; render(); }, 1900);
  }

  function shell(content, route, options = {}) {
    const nav = options.nav !== false;
    return `<div class="phone role-${state.role} ${nav?'':'no-nav'} ${options.className || ''}">
      ${topbar(options.title || 'ALTDEKOR', options.subtitle || profileData().label, options.back)}
      <main class="screen-scroll"><section class="screen ${options.noBottom ? 'no-bottom' : ''}">${content}</section></main>
      ${nav ? bottomNav(route) : ''}
      ${state.sheet && (!isFigma || state.forceFigmaSheet) ? sheet(state.sheet) : ''}
      ${state.toast && !isFigma ? `<div class="toast">${state.toast}</div>` : ''}
    </div>`;
  }
  function topbar(title, subtitle, back) {
    const p = profileData();
    const aiRoute = isLeader() ? 'assistant' : 'product-ai';
    return `<header class="topbar">
      <button class="brand-lockup" data-go="${back || 'home'}" aria-label="Назад на главную">
        <img src="assets/tms-logo.svg" alt="TMS">
        <span class="brand-copy"><strong>${title}</strong><span>${subtitle}</span></span>
      </button>
      <div class="top-actions">
        ${isLogistics() ? '' : `<button class="icon-button ai-top-button" data-go="${aiRoute}" aria-label="Открыть AI">${icon('sparkle',19)}</button>`}
        <button class="icon-button has-dot" data-go="notifications" aria-label="Уведомления">${icon('bell',19)}</button>
        <button class="avatar" data-sheet="role" aria-label="Открыть профиль">${p.initials}</button>
      </div>
    </header>`;
  }
  function bottomNav(route) {
    let items;
    if (isLogistics()) {
      items = [
        ['home','home','Обзор'],['logistics-stores','store','Точки'],['shop-orders','grid','Заказы'],['shop-catalog','box','Каталог'],['more','more','Ещё'],
      ];
    } else {
      items = [
        ['home','home','Главная'],['stores','store','Магазины'],['tasks','tasks','Задачи'],['shop-orders','box','Торговля'],['more','more','Ещё'],
      ];
    }
    const active = isLogistics()
      ? (route === 'home' ? 'home'
        : route === 'logistics-stores' ? 'logistics-stores'
        : route.startsWith('shop-order') || route === 'shop-orders' ? 'shop-orders'
        : ['shop-catalog','shop-products','shop-collections','shop-stock','form-product','form-collection','form-stock'].includes(route) ? 'shop-catalog'
        : 'more')
      : (route.startsWith('store') || route === 'audit' ? 'stores' : route.startsWith('task') || route === 'calendar' ? 'tasks' : route.startsWith('shop-') || route.startsWith('form-') ? 'shop-orders' : ['home','reports','report-month','report-stores','revenue-detail'].includes(route) ? 'home' : 'more');
    return `<nav class="bottom-nav">${items.map(([r,i,l]) => `<button class="nav-item ${active === r ? 'active' : ''}" data-go="${r}">${icon(i,22)}<span>${l}</span></button>`).join('')}</nav>`;
  }
  function pageHead(kicker, title, subtitle, action = '') {
    return `<div class="page-kicker">${kicker}</div><div class="page-title-row"><div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${action}</div>`;
  }

  function home() {
    if (isLogistics()) return logisticsHome();
    const leader = isLeader();
    return shell(`
      ${pageHead('Июль 2026', leader ? 'План выполняется на 72%' : 'Ваш план выполняется на 78%', leader ? 'Сводка по всем регионам. Данные из 1С обновлены в 14:32.' : 'Сводка только по вашим магазинам и задачам. Данные из 1С обновлены в 14:32.')}
      <article class="metric-hero clickable" data-go="reports">
        <div class="metric-head"><div><div class="metric-label">${leader ? 'Общий объём отгрузок' : 'Мой объём отгрузок'}</div><div class="metric-value">${leader ? '18 420' : '4 880'} м²</div></div><span class="status-pill success">+8,4%</span></div>
        <div class="progress-track"><div class="progress-bar" style="width:${leader ? 72 : 78}%"></div></div>
        <div class="metric-foot"><span>План ${leader ? '25 600' : '6 240'} м²</span><span>Осталось ${leader ? '7 180' : '1 360'} м²</span></div>
      </article>
      <div class="grid-2" style="margin-top:10px">
        ${kpi('chart','Выручка',leader ? '24,8 млн ₽' : '6,4 млн ₽',leader ? '+6,2% к июню' : '+9,1% к июню','revenue-detail',leader?'plan-summary':'')}
        ${kpi('store','Магазины',leader ? '38 / 42' : '10 / 12',leader ? '4 ниже плана' : '2 требуют внимания','stores',leader?'operations-summary':'')}
        ${kpi('phone','Звонки',leader ? '214 / 260' : '48 / 60',leader ? '82% плана' : '80% личного плана','calls')}
        ${kpi('tasks','Задачи',leader ? '31 открыта' : '7 открыто',leader ? '5 просрочено' : '1 просрочена','tasks')}
      </div>
      ${leader ? attentionBlock() : managerTodayBlock()}
      <div class="section-title"><h2>${leader ? 'Регионы' : 'Мои магазины'}</h2><button class="link-button" data-go="${leader ? 'report-month' : 'stores'}">Вся аналитика</button></div>
      <div class="card card-pad bar-list">
        ${leader ? `${barRow('Центральный регион','86%',86)}${barRow('Северо-Запад','74%',74)}${barRow('Южный регион','61%',61)}` : `${barRow('River House','91%',91)}${barRow('Интерьер PRO','66%',66)}${barRow('Дом декора','43%',43)}`}
      </div>
    `,'home');
  }

  function kpi(ic, label, value, caption, route, sheetType='') {
    const action=sheetType?`data-sheet="${sheetType}"`:`data-go="${route}"`;
    return `<button class="card kpi-card clickable-card" ${action}><span class="kpi-icon">${icon(ic,18)}</span><strong>${value}</strong><span>${label} · ${caption}</span><i class="card-arrow">${icon('chevron',14)}</i></button>`;
  }

  function attentionBlock() {
    return `<div class="section-title"><h2>Требует внимания</h2><button class="link-button" data-go="tasks">Все задачи</button></div>
      <div class="card card-pad attention-list">
        ${listItem('trend','Южный регион отстаёт','61% плана · отклонение −18 п.п.','report-month','danger')}
        ${listItem('camera','3 магазина без аудита','Нет актуальных данных более 30 дней','audit-dashboard','warning')}
        ${listItem('clock','5 просроченных задач','2 у менеджеров Южного региона','tasks','danger')}
      </div>`;
  }

  function managerTodayBlock() {
    return `<div class="section-title"><h2>Мои задачи на сегодня</h2><button class="link-button" data-go="calendar">Календарь</button></div>
      <div class="card card-pad">
        ${listItem('camera','Аудит: Дом декора','Тверь · сегодня до 16:00','task-detail','warning')}
        ${listItem('phone','Обзвон дилеров','12 контактов · 7 выполнено','calls','info')}
        ${listItem('repeat','Проверка статусов клиентов','Создано автоматически · ежемесячно','task-detail','violet')}
      </div>`;
  }

  function barRow(label,val,width){return `<button class="bar-row bar-button" data-go="report-stores"><div class="bar-meta"><span>${label}</span><strong>${val}</strong></div><div class="bar"><i style="width:${width}%"></i></div></button>`;}

  function listItem(ic,title,sub,route,kind='info') {
    return `<button class="list-item list-button" data-go="${route}"><span class="list-icon ${kind}">${icon(ic,18)}</span><span class="list-copy"><strong>${title}</strong><span>${sub}</span></span><span class="chevron">${icon('chevron',17)}</span></button>`;
  }

  function reports() {
    const leader = isLeader();
    return shell(`
      ${pageHead('Отчёты',leader ? 'План-факт компании' : 'Мой план-факт','Фактом считается только отгрузка из 1С. Период и объект указаны в каждом показателе.')}
      <div class="period-switch animated-switch plan-period-switch"><button class="${state.clientPlanPeriod==='month'?'active':''}" data-client-plan-period="month">Месяц</button><button class="${state.clientPlanPeriod==='quarter'?'active':''}" data-client-plan-period="quarter">3 месяца</button><button class="${state.clientPlanPeriod==='year'?'active':''}" data-client-plan-period="year">Год</button><span class="switch-glider ${state.clientPlanPeriod==='quarter'?'to-second':state.clientPlanPeriod==='year'?'to-third':''}"></span></div>
      ${clientPlanVisual()}
      <button class="card report-summary" data-go="report-month">
        <div class="row between"><div><span class="tiny muted">Июль 2026 · ${leader ? 'все регионы' : 'мои магазины'}</span><h2>${leader ? '18 420' : '4 880'} м²</h2></div><span class="score-ring compact"><strong>${leader ? 72 : 78}%</strong></span></div>
        <div class="metric-pair"><div><span>План</span><strong>${leader ? '25 600' : '6 240'} м²</strong></div><div><span>Факт</span><strong>${leader ? '18 420' : '4 880'} м²</strong></div></div>
        <div class="report-link">Подробнее за месяц ${icon('arrow',16)}</div>
      </button>
      <div class="year-month-grid">
        <button class="card year-card" data-go="report-month"><span>За месяц</span><strong>${leader ? '72%' : '78%'}</strong><small>Июль 2026</small></button>
        <button class="card year-card" data-go="report-month"><span>За год</span><strong>${leader ? '68%' : '73%'}</strong><small>Январь — июль</small></button>
      </div>
      <div class="section-title"><h2>Показатели</h2><button class="link-button" data-go="report-month">Подробная аналитика</button></div>
      <div class="card card-pad stack">
        ${metricLine('Выручка',leader ? '24,8 млн ₽' : '6,4 млн ₽',leader ? '32,0 млн ₽' : '7,5 млн ₽','77%',77)}
        ${metricLine('Посещения',leader ? '46' : '12',leader ? '60' : '15','77%',77)}
        ${metricLine('Звонки',leader ? '214' : '48',leader ? '260' : '60','82%',82)}
        ${metricLine('Мероприятия',leader ? '9' : '3',leader ? '12' : '4','75%',75)}
      </div>
      <div class="section-title"><h2>Магазины</h2><button class="link-button" data-go="report-stores">Все магазины</button></div>
      <div class="stack">
        ${storeCard('River House',`Москва · ${leader ? 'Анна Соколова' : 'мой магазин'}`,'91%',91,'success')}
        ${storeCard('Интерьер PRO',`Краснодар · ${leader ? 'Дмитрий Козлов' : 'мой магазин'}`,'66%',66,'warning')}
        ${storeCard('Дом декора',`Тверь · ${leader ? 'Алексей Крылов' : 'мой магазин'}`,'43%',43,'danger')}
      </div>
    `,'home',{back:'home'});
  }

  function clientPlanVisual() {
    const plans={
      month:{label:'План месяца',plan:'100 000 ₽',fact:'85 000 ₽',percent:'85%',status:'В работе',kind:'warning',width:85},
      quarter:{label:'Квартальный план',plan:'300 000 ₽',fact:'300 000 ₽',percent:'100%',status:'План выполнен за квартал',kind:'success',width:100},
      year:{label:'Годовой план',plan:'1 200 000 ₽',fact:'1 080 000 ₽',percent:'90%',status:'Выполнение выше ожиданий',kind:'info',width:90},
    };
    const item=plans[state.clientPlanPeriod]||plans.month;
    return `<section class="card card-pad client-plan-visual"><div class="row between"><div><span class="tiny muted">Планы клиентов</span><h2>${item.label}</h2></div><span class="status-pill ${item.kind}">${item.status}</span></div><div class="client-plan-values"><div><span>${state.clientPlanPeriod==='quarter'?'План':'План'}</span><strong>${item.plan}</strong></div><div><span>Факт</span><strong>${item.fact}</strong></div><div><span>Выполнение</span><strong>${item.percent}</strong></div></div><div class="progress-track light"><div class="progress-bar" style="width:${item.width}%"></div></div>${state.clientPlanPeriod==='quarter'?'<p class="tiny muted client-plan-note">Один из месяцев был ниже плана, но итог за 3 месяца выполнен.</p>':''}</section>`;
  }

  function metricLine(label,fact,plan,pct,width){return `<button class="metric-line" data-go="report-month"><div class="row between"><div><strong>${label}</strong><span>${fact} из ${plan}</span></div><b>${pct}</b></div><div class="bar"><i style="width:${width}%"></i></div></button>`;}

  function revenueDetail() {
    const leader = isLeader();
    return shell(`
      ${pageHead('Выручка',leader ? '24,8 млн ₽ за июль' : '6,4 млн ₽ за июль',leader ? 'Сводка по компании, регионам и магазинам.' : 'Только ваши магазины и отгрузки.')}
      <div class="year-month-grid">
        <article class="card year-card"><span>За месяц</span><strong>${leader ? '24,8' : '6,4'} млн ₽</strong><small>+${leader ? '6,2' : '9,1'}% к июню</small></article>
        <article class="card year-card"><span>За год</span><strong>${leader ? '149,2' : '38,6'} млн ₽</strong><small>72% годового плана</small></article>
      </div>
      <div class="section-title"><h2>Динамика</h2><button class="link-button">2026</button></div>
      ${lineChart(['Янв','Фев','Мар','Апр','Май','Июн','Июл'],[42,51,48,62,66,71,79], 'Выручка, млн ₽')}
      <div class="section-title"><h2>${leader ? 'По регионам' : 'По магазинам'}</h2><button class="link-button" data-go="report-stores">Рейтинг</button></div>
      <div class="card card-pad bar-list">
        ${leader ? `${barRow('Центральный','10,8 млн ₽',87)}${barRow('Северо-Запад','7,6 млн ₽',72)}${barRow('Южный','6,4 млн ₽',61)}` : `${barRow('River House','2,8 млн ₽',91)}${barRow('Интерьер PRO','2,0 млн ₽',66)}${barRow('Дом декора','1,6 млн ₽',43)}`}
      </div>
      <button class="secondary full" style="margin-top:12px" data-go="reports">Открыть полный план-факт</button>
    `,'home',{back:'home'});
  }

  function reportMonth() {
    const leader = isLeader();
    const periods = {
      july: {
        label: 'Июль',
        title: 'Июль 2026',
        stamp: 'На 29 июля',
        metrics: [
          ['Отгрузки', leader ? '18 420 м²' : '4 880 м²', '72% плана', 'trend'],
          ['Выручка', leader ? '24,8 млн ₽' : '6,4 млн ₽', '+6,2%', 'chart'],
          ['Звонки', leader ? '214' : '48', '82% плана', 'phone'],
          ['Аудиты', leader ? '31' : '8', leader ? '74% покрытия' : '2 на неделе', 'camera'],
        ],
        variance: [
          ['План по м²', leader ? '−7 180 м²' : '−1 360 м²', 'danger'],
          ['Выручка', leader ? '−7,2 млн ₽' : '−1,1 млн ₽', 'warning'],
          ['Звонки', leader ? '−46' : '−12', 'warning'],
          ['Посещения', leader ? '−14' : '−3', 'danger'],
        ],
      },
      june: {
        label: 'Июнь',
        title: 'Июнь 2026',
        stamp: 'На 30 июня',
        metrics: [
          ['Отгрузки', leader ? '17 180 м²' : '4 540 м²', '68% плана', 'trend'],
          ['Выручка', leader ? '23,3 млн ₽' : '5,9 млн ₽', '+4,8%', 'chart'],
          ['Звонки', leader ? '206' : '44', '79% плана', 'phone'],
          ['Аудиты', leader ? '28' : '7', leader ? '69% покрытия' : '2 на неделе', 'camera'],
        ],
        variance: [
          ['План по м²', leader ? '−8 020 м²' : '−1 580 м²', 'danger'],
          ['Выручка', leader ? '−8,1 млн ₽' : '−1,4 млн ₽', 'warning'],
          ['Звонки', leader ? '−54' : '−15', 'warning'],
          ['Посещения', leader ? '−18' : '−4', 'danger'],
        ],
      },
      year: {
        label: 'Год',
        title: '2026 год',
        stamp: 'Январь — июль',
        metrics: [
          ['Отгрузки', leader ? '149 200 м²' : '38 540 м²', '68% годового плана', 'trend'],
          ['Выручка', leader ? '149,2 млн ₽' : '38,6 млн ₽', '+11,4% к 2025', 'chart'],
          ['Звонки', leader ? '1 486' : '366', '76% годового плана', 'phone'],
          ['Аудиты', leader ? '214' : '51', leader ? '81% покрытия' : '12 завершено', 'camera'],
        ],
        variance: [
          ['План по м²', leader ? '−70 400 м²' : '−11 880 м²', 'warning'],
          ['Выручка', leader ? '−22,8 млн ₽' : '−3,7 млн ₽', 'warning'],
          ['Звонки', leader ? '−472' : '−84', 'warning'],
          ['Посещения', leader ? '−39' : '−7', 'danger'],
        ],
      },
    };
    const period = periods[state.reportPeriod] || periods.july;
    const periodButtons = [
      ['july', 'Июль'],
      ['june', 'Июнь'],
      ['year', 'Год'],
    ];
    return shell(`
      ${pageHead('Подробная аналитика',period.title,leader ? 'Показатели компании с детализацией до региона и магазина.' : 'Ваши показатели с детализацией по собственным магазинам.')}
      <div class="segmented segmented-3 report-period-tabs">${periodButtons.map(([key,label])=>`<button class="${state.reportPeriod===key?'active':''}" data-report-period="${key}">${label}</button>`).join('')}</div>
      <div class="switch-panel" data-switch-surface="report-${state.reportPeriod}">
        <div class="analytics-grid">
          ${period.metrics.map(item=>analyticsCard(item[0],item[1],item[2],item[3])).join('')}
        </div>
        <div class="section-title"><h2>Темп по дням</h2><span class="pill">${period.stamp}</span></div>
        ${areaChart()}
        <div class="section-title"><h2>Отклонения</h2><button class="link-button" data-go="report-stores">Магазины</button></div>
        <div class="card card-pad stack">
          ${period.variance.map(item=>varianceRow(item[0],item[1],item[2])).join('')}
        </div>
      </div>
      <button class="primary full" style="margin-top:12px" data-go="report-stores">Перейти к магазинам</button>
    `,'home',{back:'reports'});
  }

  function analyticsCard(label,value,sub,ic){return `<article class="card analytics-card"><span>${icon(ic,18)}</span><strong>${value}</strong><small>${label} · ${sub}</small></article>`;}
  function varianceRow(label,value,kind){return `<div class="row between variance"><span>${label}</span><strong class="${kind}">${value}</strong></div>`;}

  function reportStores() {
    const sorts = [
      ['plan','По выполнению'],['revenue','Топ выручки'],['growth','Топ роста'],['bottom','Отстающие'],
    ];
    const stores = sortedStores();
    return shell(`
      ${pageHead('План-факт','Магазины','Нажмите на магазин, чтобы открыть показатели, аудиты и историю.')}
      <div class="sort-head"><span>${icon('sort',17)} Сортировка топов</span></div>
      <div class="filter-row">${sorts.map(([k,l])=>`<button class="chip ${state.reportSort===k?'active':''}" data-report-sort="${k}">${l}</button>`).join('')}</div>
      <div class="rank-summary card card-pad">
        <div><span>Лидер</span><strong>${stores[0].name}</strong></div><span class="status-pill success">${stores[0].plan}%</span>
      </div>
      <div class="stack" style="margin-top:12px">${stores.map((s,i)=>rankedStoreCard(s,i+1)).join('')}</div>
    `,'home',{back:'reports'});
  }

  function sortedStores() {
    const data = [
      {name:'River House',city:'Москва',plan:91,revenue:2800,growth:14,audit:4.6},
      {name:'АртСтена',city:'Санкт-Петербург',plan:86,revenue:2420,growth:11,audit:4.4},
      {name:'Интерьер PRO',city:'Краснодар',plan:66,revenue:1980,growth:7,audit:3.8},
      {name:'Стильный дом',city:'Псков',plan:58,revenue:1710,growth:3,audit:3.5},
      {name:'Дом декора',city:'Тверь',plan:43,revenue:1580,growth:-4,audit:3.2},
    ];
    if (!isLeader()) return data.filter(s=>['River House','Интерьер PRO','Дом декора'].includes(s.name));
    const key = state.reportSort;
    return [...data].sort((a,b)=> key==='revenue' ? b.revenue-a.revenue : key==='growth' ? b.growth-a.growth : key==='bottom' ? a.plan-b.plan : b.plan-a.plan);
  }

  function rankedStoreCard(s,rank){
    const kind=s.plan>=80?'success':s.plan>=60?'warning':'danger';
    return `<button class="card ranked-store ${s.plan<60?'underperforming':''}" data-go="store-detail"><span class="rank">${rank}</span><div class="rank-copy"><strong>${s.name}</strong><small>${s.city} · ${s.revenue.toLocaleString('ru-RU')} тыс. ₽</small><div class="bar"><i style="width:${s.plan}%"></i></div></div><div class="rank-side"><span class="status-pill ${kind}">${s.plan}%</span><small>аудит ${s.audit}</small></div></button>`;
  }
  function stores() {
    const leader=isLeader();
    return shell(`
      ${pageHead('Торговые точки',leader?'Все магазины':'Мои магазины',leader?'Фильтрация по регионам, рейтинг и оценочная выжимка по аудитам.':'Только закреплённые за вами магазины.')}
      <div class="search">${icon('search',18)}<input placeholder="Магазин, город или менеджер"></div>
      <div class="filter-row" style="margin-top:10px"><button class="chip active">Все</button>${leader?'<button class="chip">Центр</button><button class="chip">Северо-Запад</button><button class="chip">Юг</button>':''}<button class="chip">Ниже плана</button></div>
      ${leader?`<div class="section-title"><h2>Оценка сети</h2><button class="link-button" data-go="audit-dashboard">Все аудиты</button></div>${networkAuditSummary()}`:''}
      <div class="stack" style="margin-top:12px">
        ${storeCard('River House',leader?'Москва · Анна Соколова':'Москва · мой магазин','91%',91,'success')}
        ${storeCard('Интерьер PRO',leader?'Краснодар · Дмитрий Козлов':'Краснодар · мой магазин','66%',66,'warning')}
        ${storeCard('Дом декора',leader?'Тверь · Алексей Крылов':'Тверь · мой магазин','43%',43,'danger')}
        ${leader?storeCard('Стильный дом','Псков · Мария Иванова','58%',58,'warning'):''}
      </div>
    `,'stores');
  }

  function networkAuditSummary(){return `<button class="card audit-summary-card" data-go="audit-dashboard"><div class="audit-score-big">4,1</div><div><strong>Средняя оценка аудитов</strong><span>31 аудит · 74% магазинов покрыто</span><div class="mini-bars"><i style="height:35%"></i><i style="height:48%"></i><i style="height:52%"></i><i style="height:68%"></i><i style="height:73%"></i></div></div>${icon('chevron',18)}</button>`;}

  function storeCard(name,meta,val,width,status='info') {
    return `<button class="card store-card clickable-card ${width<60?'underperforming':''}" data-go="store-detail">
      <div class="top"><div><div class="store-name">${name}</div><div class="store-meta">${meta}</div></div><span class="status-pill ${status}">${val}</span></div>
      <div class="mini-progress"><div class="bar"><i style="width:${width}%"></i></div><span>${val}</span></div>
      <div class="store-bottom"><span>Аудит ${name==='River House'?'4,6':name==='Интерьер PRO'?'3,8':'3,2'} / 5</span><span>${name==='River House'?'2 800':'1 580'} тыс. ₽</span></div>
    </button>`;
  }
  function storeDetail() {
    const leader=isLeader();
    return shell(`
      ${pageHead('Карточка магазина','Дом декора','Тверь · Южный регион · '+(leader?'Ответственный: Алексей Крылов':'Ваш магазин'))}
      <button class="detail-hero clickable" data-go="store-plan">
        <div class="row between"><div><div class="tiny opacity">Выполнение плана</div><h2>43%</h2></div><span class="status-pill danger">Ниже плана</span></div>
        <div class="year-month-inline"><div><span>За месяц</span><strong>43%</strong></div><div><span>За год</span><strong>67%</strong></div></div>
        <div class="detail-stats"><div><span>План</span><strong>2 400 м²</strong></div><div><span>Факт</span><strong>1 032 м²</strong></div><div><span>Выручка</span><strong>1,8 млн ₽</strong></div></div>
        <div class="hero-link">Подробное выполнение плана ${icon('arrow',16)}</div>
      </button>
      <div class="store-actions ${leader?'single':''}" style="margin-top:10px">
        ${leader?'':`<button class="primary full" data-go="audit">${icon('camera',18)} Начать аудит</button>`}
        <button class="secondary full" data-sheet="store-ai">${icon('ai',18)} Спросить AI о магазине</button>
      </div>
      ${leader?`<div class="section-title"><h2>Выжимка аудитов</h2><button class="link-button" data-go="audit-dashboard">Все аудиты</button></div>${auditTrendCard()}`:''}
      <div class="section-title"><h2>Показатели</h2><button class="link-button" data-go="report-month">Июль 2026</button></div>
      <div class="card card-pad stack">
        ${miniStat('Звонки','12 / 20','60%')}
        ${miniStat('Посещения','2 / 4','50%')}
        ${miniStat('Лояльность дилера','3,8 / 5','+0,4')}
        ${miniStat('Состояние выставки','3,2 / 5','−0,3')}
      </div>
      <div class="section-title"><h2>Последние события</h2><button class="link-button" data-go="store-history">Вся история</button></div>
      <div class="card card-pad timeline">
        ${timeline('18 июля','Проведён аудит','6 live-фото · оценка визита 4/5')}
        ${timeline('12 июля','Комментарий менеджера','Договорились обновить стенд до 1 августа')}
        ${timeline('3 июля','Отгрузка из 1С','312 м² · 480 000 ₽')}
      </div>
    `,'stores',{back:'stores'});
  }

  function auditTrendCard(){return `<button class="card card-pad audit-trend-card" data-go="audit-dashboard"><div class="row between"><div><strong>Динамика 6 аудитов</strong><span>Средняя оценка 3,6 из 5</span></div><span class="status-pill warning">−0,5 к топу</span></div>${multiLineChart()}<div class="legend"><span><i class="blue"></i>Лояльность</span><span><i class="green"></i>Выставка</span><span><i class="orange"></i>Качество визита</span></div></button>`;}

  function storePlan() {
    return shell(`
      ${pageHead('Дом декора','Выполнение плана','Подробно за июль и с начала 2026 года.')}
      <div class="year-month-grid">
        <article class="card year-card accent"><span>За месяц</span><strong>43%</strong><small>1 032 из 2 400 м²</small></article>
        <article class="card year-card"><span>За год</span><strong>67%</strong><small>11 480 из 17 200 м²</small></article>
      </div>
      <div class="section-title"><h2>Динамика по месяцам</h2><span class="pill">2026</span></div>
      ${lineChart(['Фев','Мар','Апр','Май','Июн','Июл'],[76,69,82,71,58,43],'Выполнение, %')}
      <div class="section-title"><h2>План-факт июля</h2></div>
      <div class="card card-pad stack">
        ${metricLine('Отгрузки','1 032 м²','2 400 м²','43%',43)}
        ${metricLine('Выручка','1,8 млн ₽','3,4 млн ₽','53%',53)}
        ${metricLine('Звонки','12','20','60%',60)}
        ${metricLine('Посещения','2','4','50%',50)}
      </div>
      <div class="section-title"><h2>Причины отклонения</h2></div>
      <div class="card card-pad stack">
        ${listItem('clock','Темп отгрузок ниже ожидаемого','−1 368 м² до плана','report-month','danger')}
        ${listItem('phone','Не выполнен план звонков','12 из 20','calls','warning')}
        ${listItem('camera','Состояние выставки снизилось','3,2 из 5 · −0,3','audit-dashboard','warning')}
      </div>
    `,'stores',{back:'store-detail'});
  }

  function storeHistory() {
    return shell(`
      ${pageHead('Дом декора','Вся история','Отгрузки, звонки, аудиты, комментарии и изменения задач.')}
      <div class="filter-row"><button class="chip active">Все</button><button class="chip">Аудиты</button><button class="chip">Звонки</button><button class="chip">Отгрузки</button><button class="chip">Комментарии</button></div>
      <div class="history-date">Июль 2026</div>
      <div class="card card-pad timeline">
        ${timeline('29 июля, 14:18','План обновлён','Автор: Александр Крылов · 2 400 м²')}
        ${timeline('28 июля, 17:20','Исходящий звонок','4:38 · AI-оценка 82/100')}
        ${timeline('18 июля, 15:42','Проведён аудит','6 live-фото · оценка визита 4/5')}
        ${timeline('12 июля, 11:06','Комментарий менеджера','Обновить стенд до 1 августа')}
        ${timeline('3 июля, 09:31','Отгрузка из 1С','312 м² · 480 000 ₽')}
      </div>
      <div class="history-date">Июнь 2026</div>
      <div class="card card-pad timeline">
        ${timeline('26 июня','Аудит торговой точки','Средняя оценка 3,4 / 5')}
        ${timeline('15 июня','Отгрузка из 1С','580 м² · 742 000 ₽')}
      </div>
    `,'stores',{back:'store-detail'});
  }

  function miniStat(label,value,delta){return `<button class="row between mini-stat" data-go="report-month"><div><div class="small semibold">${label}</div><div class="tiny muted">Текущий месяц</div></div><div class="right"><div class="small bold">${value}</div><div class="tiny brand">${delta}</div></div></button>`;}
  function timeline(date,title,text){return `<div class="timeline-item"><div class="timeline-marker"><span class="timeline-dot"></span></div><div class="timeline-content"><div class="tiny muted">${date}</div><strong>${title}</strong><p>${text}</p></div></div>`;}

  function auditDashboard() {
    return shell(`
      ${pageHead('Контроль сети','Аудиты магазинов','Просмотр всех аудитов и оценочная выжимка. Создание аудитов недоступно руководителю.')}
      <div class="analytics-grid">
        ${analyticsCard('Проведено','31','за июль','camera')}
        ${analyticsCard('Покрытие','74%','31 из 42 точек','store')}
        ${analyticsCard('Средняя оценка','4,1','из 5','trophy')}
        ${analyticsCard('Ниже нормы','6','магазинов','trend')}
      </div>
      <div class="section-title"><h2>Отклонение от топов</h2><span class="pill">Июль</span></div>
      <div class="card card-pad deviation-chart">
        ${deviationRow('River House','4,6','Топ',100,'success')}
        ${deviationRow('АртСтена','4,4','−0,2',93,'success')}
        ${deviationRow('Интерьер PRO','3,8','−0,8',72,'warning')}
        ${deviationRow('Дом декора','3,2','−1,4',55,'danger')}
      </div>
      <div class="section-title"><h2>Все аудиты</h2><button class="link-button">Фильтры</button></div>
      <div class="stack">
        ${auditCard('Дом декора','18 июля · Алексей Крылов','4,0','−0,6 к топу')}
        ${auditCard('River House','17 июля · Анна Соколова','4,7','+0,1 к топу')}
        ${auditCard('Интерьер PRO','14 июля · Дмитрий Козлов','3,8','−0,8 к топу')}
      </div>
    `,'more',{back:'more'});
  }

  function deviationRow(name,score,delta,width,kind){return `<button class="deviation-row" data-go="store-detail"><div class="row between"><strong>${name}</strong><span class="status-pill ${kind}">${score} · ${delta}</span></div><div class="bar"><i style="width:${width}%"></i></div></button>`;}
  function auditCard(name,meta,score,delta){return `<button class="card audit-card" data-go="audit-detail"><div class="audit-score">${score}</div><div class="flex-1"><strong>${name}</strong><span>${meta}</span><small>${delta}</small></div>${icon('chevron',17)}</button>`;}

  function audits() {
    return shell(`
      ${pageHead('Полевая работа','Мои аудиты','Только ваши торговые точки, черновики и завершённые визиты.')}
      <div class="tabs"><button class="active">Активные</button><button>Завершённые</button><button>Черновики</button></div>
      <div class="stack" style="margin-top:12px">
        <button class="card audit-card" data-go="audit"><div class="audit-score pending">!</div><div class="flex-1"><strong>Дом декора</strong><span>Сегодня до 16:00 · Тверь</span><small>Не начат</small></div>${icon('chevron',17)}</button>
        ${auditCard('River House','18 июля · Анна Соколова','4,7','Завершён')}
        ${auditCard('Интерьер PRO','14 июля · Анна Соколова','3,8','Завершён')}
      </div>
    `,'more',{back:'more'});
  }

  function audit() {
    const photoSlots = Array.from({length:6},(_,i)=>`<label class="photo-slot ${i<2?'done':''}">${i<2?`${icon('check',20)}<span>Фото ${i+1}</span>`:`${icon('camera',20)}<span>Фото ${i+1}</span>`}<input type="file" accept="image/*" capture="environment"></label>`).join('');
    return shell(`
      ${pageHead('Аудит торговой точки','Дом декора','Черновик сохраняется на устройстве и синхронизируется после восстановления связи.')}
      <div class="offline-banner">${icon('wifiOff',17)} Нестабильная связь — офлайн-сохранение включено</div>
      <div class="stepper" style="margin-top:16px"><span class="step done">1</span><span class="step-line done"></span><span class="step active">2</span><span class="step-line"></span><span class="step">3</span></div>
      <div class="section-title"><h2>Live-фотографии</h2><span class="status-pill info">2 из 6</span></div>
      <p class="subtitle audit-note">Снимки делаются только камерой устройства. Загрузка из галереи отключена.</p>
      <div class="photo-grid">${photoSlots}</div>
      <div class="section-title"><h2>Оценки визита</h2><span class="tiny muted">Все поля обязательны</span></div>
      <div class="card card-pad stack">
        ${ratingField('Лояльность дилера','loyalty')}
        ${ratingField('Готовность к целевой продукции','target')}
        ${ratingField('Состояние выставочных образцов','showcase')}
        ${ratingField('Качество посещения','visit')}
        ${ratingField('Готовность к обучениям','training')}
        ${field('Выручка за период, ₽','0','number')}
        ${field('Комментарий и следующий шаг','Что обсудили и что сделать дальше','textarea')}
      </div>
      <button class="primary full" style="margin-top:12px" data-action="audit-save">Сохранить черновик</button>
      <button class="secondary full" style="margin-top:8px" data-action="audit-finish">Завершить аудит</button>
    `,'stores',{back:'audits'});
  }

  function ratingField(label,key){return `<div class="field"><label>${label}</label><div class="rating" data-rating="${key}">${[1,2,3,4,5].map(n=>`<button data-rate="${n}" class="${state.ratings[key]===n?'active':''}">${n}</button>`).join('')}</div></div>`;}

  function auditDetail() {
    return shell(`
      ${pageHead('Аудит завершён','Дом декора','18 июля 2026 · Алексей Крылов · геометка подтверждена')}
      <div class="card audit-result-head"><div class="audit-score-large">4,0</div><div><strong>Оценка визита</strong><span>На 0,6 ниже топ-уровня сети</span></div></div>
      <div class="section-title"><h2>Оценки</h2></div>
      <div class="card card-pad stack">
        ${scoreLine('Лояльность дилера',4.2)}${scoreLine('Целевая продукция',3.5)}${scoreLine('Состояние выставки',3.2)}${scoreLine('Качество визита',4.5)}${scoreLine('Обучения',4.4)}
      </div>
      <div class="section-title"><h2>6 live-фотографий</h2><span class="pill">18 июля · 15:42</span></div>
      <div class="audit-photos">${Array.from({length:6},(_,i)=>`<div class="audit-photo"><span>${i+1}</span>${icon('camera',21)}</div>`).join('')}</div>
      <div class="section-title"><h2>Комментарий</h2></div>
      <article class="card card-pad"><p class="small audit-comment">Выставка требует частичного обновления. Дилер готов обсудить новую линейку после получения образцов.</p><span class="tiny muted">Следующий шаг: отправить образцы до 1 августа.</span></article>
      ${isLeader()?'<button class="secondary full" style="margin-top:12px" data-go="store-detail">Открыть карточку магазина</button>':''}
    `,'more',{back:isLeader()?'audit-dashboard':'audits'});
  }

  function scoreLine(label,value){return `<div class="score-line"><div class="row between"><span>${label}</span><strong>${value.toFixed(1)}</strong></div><div class="score-dots">${[1,2,3,4,5].map(n=>`<i class="${n<=Math.round(value)?'active':''}"></i>`).join('')}</div></div>`;}

  function tasks() {
    const leader=isLeader();
    return shell(`
      ${pageHead('Планировщик',leader?'Задачи руководителя':'Мои задачи',leader?'Контроль команды, просрочек и задач, требующих решения.':'Только назначенные вам задачи. Цикличные создаются автоматически по расписанию.')}
      <button class="calendar-open card" data-go="calendar">${icon('calendar',20)}<div><strong>Календарь</strong><span>Июль 2026 · 8 задач на неделе</span></div>${icon('chevron',17)}</button>
      <div class="filter-row" style="margin-top:12px"><button class="chip ${state.taskFilter==='today'?'active':''}" data-task-filter="today">Сегодня</button><button class="chip ${state.taskFilter==='overdue'?'active':''}" data-task-filter="overdue">Просроченные</button><button class="chip ${state.taskFilter==='week'?'active':''}" data-task-filter="week">Неделя</button>${leader?'<button class="chip" data-task-filter="attention">Требуют внимания</button>':''}</div>
      <div class="task-create-zone"><button class="primary full task-create-button" data-sheet="task">${icon('plus',18)} Создать задачу</button></div>
      ${leader?leaderTasks():managerTasks()}
    `,'tasks');
  }

  function leaderTasks(){return `<div class="section-title"><h2>Обратить внимание</h2><span class="status-pill danger">5</span></div><div class="stack">
    ${taskCard('Разобрать отставание Южного региона','Регион · отклонение −18 п.п.','Сегодня, 15:00','high','Решение','Александр Крылов')}
    ${taskCard('Назначить ответственного на 3 аудита','3 магазина без визита более 30 дней','Сегодня, 17:00','high','Нужно решение','Александр Крылов')}
    ${taskCard('Проверить просроченные задачи команды','5 просрочено · 2 сотрудника','Сегодня, 18:30','medium','Контроль','Александр Крылов')}
    </div><div class="section-title"><h2>Задачи команды</h2><span class="pill">31 открыта</span></div><div class="stack">
    ${taskCard('Аудит магазина «Дом декора»','Алексей Крылов · Тверь','Сегодня, 16:00','high','В работе','Алексей Крылов')}
    ${taskCard('Обзвон дилеров Южного региона','Мария Иванова · 12 контактов','31 июля','medium','В работе','Мария Иванова')}
    </div>`;}

  function managerTasks(){return `<div class="section-title"><h2>Сегодня</h2><span class="status-pill danger">1 просрочена</span></div><div class="stack">
    ${taskCard('Аудит магазина «Дом декора»','Тверь','Сегодня, 16:00','high','В работе','Анна Соколова')}
    ${taskCard('Связаться с дилером «Интерьер PRO»','Краснодар','Сегодня, 18:30','medium','Новая','Анна Соколова')}
    ${taskCard('Проверка статусов клиентов','Автоматически повторяется ежемесячно','31 июля','low','Цикличная','Анна Соколова')}
    </div>`;}

  function taskCard(title,object,date,priority,status,assignee){return `<button class="card task-card clickable-card" data-go="task-detail"><div class="task-card-head"><div class="task-main"><i class="priority ${priority}"></i><div class="task-copy"><h3>${title}</h3><div class="small muted">${object}</div></div></div><span class="status-pill ${status==='В работе'?'warning':status==='Цикличная'?'violet':status.toLowerCase().includes('реш')?'danger':'info'}">${status}</span></div><div class="task-meta"><span>${icon('calendar',13)}${date}</span><span>${icon('user',13)}${assignee}</span></div></button>`;}

  function taskDetail() {
    return shell(`
      ${pageHead('Задача','Аудит магазина «Дом декора»','Тверь · высокий приоритет')}
      <div class="card card-pad stack">
        ${detailLine('Статус','В работе','warning')}
        ${detailLine('Ответственный',isLeader()?'Алексей Крылов':'Анна Соколова')}
        ${detailLine('Срок','Сегодня, 16:00','danger')}
        ${detailLine('Связано с','Магазин «Дом декора»')}
        ${detailLine('Повторение','Нет')}
      </div>
      <div class="section-title"><h2>Описание</h2></div>
      <article class="card card-pad"><p class="small task-description">Провести аудит торговой точки, сделать 6 live-фотографий, заполнить все оценки и зафиксировать следующий шаг.</p></article>
      <div class="section-title"><h2>Комментарии</h2></div>
      <div class="card card-pad timeline">${timeline('Сегодня, 10:12','Александр Крылов','Проверьте состояние стенда и готовность к новой линейке.')}${timeline('Вчера, 18:42','Система','Напоминание о приближении срока.')}</div>
      <div class="task-detail-actions"><button class="secondary" data-action="task-reschedule">Перенести</button>${isLeader()?'<button class="primary" data-action="task-control">Отметить проверенной</button>':'<button class="primary" data-action="task-done">Завершить</button>'}</div>
    `,'tasks',{back:'tasks'});
  }

  function detailLine(label,value,kind=''){return `<div class="row between detail-line"><span>${label}</span>${kind?`<span class="status-pill ${kind}">${value}</span>`:`<strong>${value}</strong>`}</div>`;}

  function calendar() {
    return shell(`
      ${pageHead('Планировщик','Июль 2026',isLeader()?'Задачи команды и руководителя по датам.':'Только ваши задачи и автоматически созданные цикличные.')}
      <div class="calendar-card card">
        <div class="calendar-head"><button>${icon('chevron',17,'style="transform:rotate(180deg)"')}</button><strong>Июль 2026</strong><button>${icon('chevron',17)}</button></div>
        <div class="calendar-week">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=>`<span>${d}</span>`).join('')}</div>
        <div class="calendar-grid">${Array.from({length:35},(_,i)=>{const day=i-1;return `<button class="calendar-cell ${day===state.calendarDate?'active':''} ${[3,8,12,18,22,29].includes(day)?'has-task':''}" data-calendar-date="${day}">${day>0&&day<=31?day:''}</button>`}).join('')}</div>
      </div>
      <div class="section-title"><h2>29 июля</h2><span class="pill">3 задачи</span></div>
      <div class="stack">
        ${taskCard('Аудит магазина «Дом декора»','Тверь','16:00','high','В работе',isLeader()?'Алексей Крылов':'Анна Соколова')}
        ${taskCard('Связаться с дилером','Интерьер PRO','18:30','medium','Новая',isLeader()?'Анна Соколова':'Анна Соколова')}
        ${taskCard('Проверка статусов клиентов','Автоматическая задача','До конца дня','low','Цикличная',isLeader()?'Мария Иванова':'Анна Соколова')}
      </div>
    `,'tasks',{back:'tasks'});
  }

  function leads() {
    const sorts=[['activity','По активности'],['stage','По этапу'],['date','По контакту'],['city','По городу']];
    return shell(`
      ${pageHead('CRM',isLeader()?'Клиенты и дилеры':'Мои клиенты и дилеры','Этап работы, комментарии и история изменений.')}
      <div class="search">${icon('search',18)}<input placeholder="Компания, город или контакт"></div>
      <div class="sort-head"><span>${icon('sort',17)} Сортировка</span></div>
      <div class="filter-row">${sorts.map(([k,l])=>`<button class="chip ${state.clientSort===k?'active':''}" data-client-sort="${k}">${l}</button>`).join('')}</div>
      <button class="primary fab" data-sheet="lead">${icon('plus',18)} Добавить клиента</button>
      <div class="stack" style="margin-top:12px">
        ${leadCard('ООО «АртСтена»','Москва · Сергей Орлов','Переговоры','warning','Сегодня')}
        ${leadCard('Декор Центр','Рязань · Ольга Петрова','Новый','info','Вчера')}
        ${leadCard('Loft Market','Тула · Ирина Волкова','Договор','success','30 июля')}
        ${isLeader()?leadCard('Дом фактур','Ярославль · Павел Серов','Повторный контакт','violet','2 августа'):''}
      </div>
    `,'more',{className:'leads-screen'});
  }

  function leadCard(name,meta,status,kind,next){return `<button class="card lead-card clickable-card" data-go="lead-detail"><div class="top"><div><h3>${name}</h3><div class="small muted">${meta}</div></div><span class="status-pill ${kind}">${status}</span></div><div class="row between lead-next"><span>Следующий контакт: ${next}</span>${icon('chevron',16)}</div></button>`;}

  function leadDetail() {
    return shell(`
      ${pageHead('Карточка клиента','ООО «АртСтена»','Потенциальный дилер · Москва')}
      <div class="card card-pad"><div class="row between"><div><div class="tiny muted">Текущий этап</div><h2 class="client-stage">Переговоры</h2></div><button class="icon-button">${icon('edit',17)}</button></div><div class="row contact-row"><span class="list-icon">${icon('phone',17)}</span><div><div class="small semibold">+7 (999) 321-54-76</div><div class="tiny muted">Сергей Орлов · директор</div></div></div></div>
      <div class="grid-2" style="margin-top:10px"><button class="primary full" data-go="call-dialer">${icon('phone',17)} Позвонить</button><button class="secondary full" data-sheet="task">${icon('tasks',17)} Задача</button></div>
      <div class="section-title"><h2>Комментарий</h2><button class="link-button">Редактировать</button></div>
      <article class="card card-pad"><p class="small client-comment">Интересуется коллекциями для коммерческих интерьеров. Нужно отправить образцы и согласовать встречу с закупщиком.</p><div class="tiny muted">Изменил ${profileData().name} · сегодня, 12:14</div></article>
      <div class="section-title"><h2>История</h2></div>
      <div class="card card-pad timeline">${timeline('Сегодня, 12:14','Обновлён комментарий','Добавлена договорённость об отправке образцов')}${timeline('Вчера, 17:42','Исходящий звонок · 4:38','AI-оценка 82/100 · следующий шаг согласован')}${timeline('25 июля','Создан лид','Источник: рекомендация партнёра')}</div>
    `,'more',{back:'leads'});
  }

  function calls() {
    const leader=isLeader();
    return shell(`
      ${pageHead('Телефония',leader?'Звонки команды':'Мои звонки',leader?'План, факт, быстрый набор и AI-анализ по сотрудникам.':'Ваши звонки, быстрый набор, записи и личная AI-оценка.',`<button class="icon-button dialer-shortcut" data-go="call-dialer">${icon('keypad',20)}</button>`)}
      <button class="dial-card card" data-go="call-dialer"><span class="dial-icon">${icon('phone',22)}</span><div><strong>Позвонить из приложения</strong><small>Введите номер или выберите клиента</small></div>${icon('chevron',18)}</button>
      <div class="grid-2"><article class="card kpi-card"><span class="kpi-icon">${icon('phone',18)}</span><strong>${leader?'214 / 260':'48 / 60'}</strong><span>Июль · ${leader?'82':'80'}% плана</span></article><article class="card kpi-card"><span class="kpi-icon">${icon('sparkle',18)}</span><strong>${leader?'78':'84'} / 100</strong><span>Средняя AI-оценка</span></article></div>
      ${leader?`<div class="section-title"><h2>По менеджерам</h2></div><div class="card card-pad bar-list">${barRow('Анна Соколова','91%',91)}${barRow('Алексей Крылов','82%',82)}${barRow('Мария Иванова','76%',76)}</div>`:''}
      <div class="filter-row" style="margin-top:12px"><button class="chip active">Все</button><button class="chip">Результативные</button><button class="chip">Пропущенные</button></div>
      <div class="stack" style="margin-top:12px">
        ${callCard('ООО «АртСтена»',(leader?'Алексей Крылов':'Вы')+' · 4:38','82','success')}
        ${callCard('Дом фактур',(leader?'Мария Иванова':'Вы')+' · 2:17','64','warning')}
        ${callCard('Декор Центр',(leader?'Дмитрий Козлов':'Вы')+' · 0:48','—','danger')}
        ${leader?callCard('Интерьер PRO','Анна Соколова · 6:04','91','success'):''}
      </div>
    `,'more');
  }
  function callCard(name,meta,score,kind){return `<button class="card call-card clickable-card" data-go="call-detail"><div class="top"><div><h3>${name}</h3><div class="small muted">${meta}</div></div><span class="status-pill ${kind}">${score==='—'?'Неуспешный':score+'/100'}</span></div><div class="waveform compact-wave">${[12,20,9,27,15,31,19,8,22,17,29,12,24,16,7,21,14,26,11,18].map(h=>`<i style="height:${h}px"></i>`).join('')}</div></button>`;}

  function callDetail() {
    return shell(`
      ${pageHead('AI-анализ звонка','ООО «АртСтена»','Вчера, 17:42 · '+(isLeader()?'Алексей Крылов':'Анна Соколова')+' · 4:38')}
      <article class="card card-pad"><div class="row between"><div class="score-ring"><strong>82</strong></div><div class="flex-1"><h3>Хороший результат</h3><p class="small muted call-summary">Цель звонка достигнута. Следующий шаг согласован, но презентацию продукта можно сделать точнее.</p></div></div><div class="waveform">${[18,29,13,36,22,42,27,12,33,19,38,16,28,31,15,40,21,30,12,26,18,35,23,14].map(h=>`<i style="height:${h}px"></i>`).join('')}</div><button class="secondary full" style="margin-top:10px">${icon('play',17)} Прослушать запись</button></article>
      <div class="section-title"><h2>Реперные точки</h2><span class="tiny muted">6 из 7</span></div>
      <div class="card card-pad checklist">${checkLine('Менеджер представился',true)}${checkLine('Обозначил цель звонка',true)}${checkLine('Уточнил ситуацию клиента',true)}${checkLine('Презентовал продукцию',false)}${checkLine('Отработал возражения',true)}${checkLine('Согласовал следующий шаг',true)}${checkLine('Зафиксировал итог',true)}</div>
      <div class="section-title"><h2>Краткий итог</h2></div>
      <article class="card card-pad"><p class="small call-summary">Клиент заинтересован в образцах коллекции. Договорились отправить материалы и связаться повторно 30 июля.</p><button class="link-button">Открыть расшифровку</button></article>
    `,'more',{back:'calls'});
  }

  function checkLine(text,ok){return `<div class="checkline"><span><i class="check ${ok?'':'cross'}">${icon(ok?'check':'close',13)}</i>${text}</span><strong class="${ok?'success':'danger'}">${ok?'Да':'Нет'}</strong></div>`;}

  function assistant() {
    return shell(`
      ${pageHead('AI-ассистент','Спросите о бизнесе','Доступен руководителю. Ответы только по данным системы, действия — после явного подтверждения.')}
      <div class="filter-row"><button class="chip">Как идут дела за месяц?</button><button class="chip">Кто не выполняет план?</button><button class="chip">Что с задачами?</button></div>
      <div class="chat"><div class="bubble user">Что по Южному региону за июль?</div><div class="bubble ai"><strong>Южный регион выполняет план на 61%.</strong><div class="answer-metrics"><div class="answer-metric"><span>Отгрузки</span><strong>4 820 м²</strong></div><div class="answer-metric"><span>Выручка</span><strong>6,4 млн ₽</strong></div><div class="answer-metric"><span>Просрочено</span><strong>5 задач</strong></div><div class="answer-metric"><span>Аудиты</span><strong>7 из 12</strong></div></div><button class="link-button" data-go="report-month">Открыть отчёт →</button></div><div class="bubble user">Предложи задачи, чтобы поднять результат.</div><div class="bubble ai"><strong>Подготовил черновик из 3 задач.</strong><div class="stack compact-stack"><div class="card-flat card-pad"><div class="small semibold">1. Повторный обзвон 8 дилеров</div><div class="tiny muted">Алексей Крылов · до 31 июля</div></div><div class="card-flat card-pad"><div class="small semibold">2. Провести 3 аудита</div><div class="tiny muted">Мария Иванова · до 2 августа</div></div></div><div class="draft-actions"><button class="secondary" data-action="draft-cancel">Изменить</button><button class="primary" data-action="draft-confirm">Создать задачи</button></div><div class="tiny muted confirmation-note">Данные не изменятся без подтверждения.</div></div></div>
      <div class="chat-composer"><input class="chat-input" placeholder="Введите вопрос"><button class="mic-button">${icon('mic',20)}</button></div>
    `,'assistant');
  }

  function productAI() {
    return shell(`
      ${pageHead('AI-помощник','Продукция ALTDEKOR','Характеристики, коллекции, упаковка и наличие — только по внутренним данным.')}
      <div class="filter-row"><button class="chip">Сравнить коллекции</button><button class="chip">Размеры и упаковка</button><button class="chip">Наличие</button></div>
      <div class="chat"><div class="bubble user">Чем коллекция Loft отличается от Provence?</div><div class="bubble ai"><strong>Ключевые различия:</strong><div class="stack compact-stack"><div class="card-flat card-pad"><div class="row between"><strong class="small">Loft</strong><span class="status-pill info">Современный</span></div><p class="tiny muted product-copy">Выраженная фактура, холодная палитра, коммерческие интерьеры.</p></div><div class="card-flat card-pad"><div class="row between"><strong class="small">Provence</strong><span class="status-pill violet">Классический</span></div><p class="tiny muted product-copy">Мягкие оттенки, спокойная фактура, жилые интерьеры.</p></div></div></div></div>
      <div class="chat-composer"><input class="chat-input" placeholder="Вопрос по товару"><button class="mic-button">${icon('mic',20)}</button></div>
    `,'assistant',{back:'more'});
  }

  function notifications() {
    const filters = [['all','Все'],['unread','Непрочитанные'],['important','Важные']];
    const items = [
      {kind:'danger',title:'Просрочена задача',text:'Связаться с дилером «Дом фактур»',time:'8 минут назад', unread:true, important:true},
      {kind:'info',title:'Новый комментарий',text:'Обновлена карточка River House',time:'34 минуты назад', unread:true, important:false},
      {kind:'success',title:'Аудит синхронизирован',text:'6 фотографий и оценки сохранены',time:'Сегодня, 13:40', unread:false, important:true},
      {kind:'violet',title:'Цикличная задача создана',text:'Проверка статусов клиентов',time:'Сегодня, 09:00', unread:false, important:false},
    ];
    const visible = items.filter(item => state.notificationFilter === 'all' ? true : state.notificationFilter === 'unread' ? item.unread : item.important);
    return shell(`
      ${pageHead('Центр уведомлений','Уведомления','Задачи, комментарии, аудиты и синхронизация данных.')}
      <div class="filter-row filter-animate-row">${filters.map(([key,label])=>`<button class="chip ${state.notificationFilter===key?'active':''}" data-notification-filter="${key}">${label}</button>`).join('')}</div>
      <div class="card card-pad notifications-card switch-panel" data-switch-surface="notifications-${state.notificationFilter}">${visible.map(item=>notification(item.kind,item.title,item.text,item.time)).join('')}</div>
    `,'more',{back:'home'});
  }

  function notification(kind,title,text,time){return `<div class="list-item"><span class="list-icon ${kind}">${icon(kind==='danger'?'clock':kind==='success'?'check':kind==='violet'?'repeat':'bell',17)}</span><span class="list-copy"><strong>${title}</strong><span>${text}</span><span class="notification-time">${time}</span></span></div>`;}

  function more() {
    if (isLogistics()) return logisticsMore();
    const leader=isLeader();
    return shell(`
      ${pageHead('Рабочее пространство','Все модули','Функции показаны в соответствии с вашей ролью и компанией.')}
      <div class="menu-grid">
        ${menuCard('chart','Отчёты',leader?'Компания, регионы и магазины':'Мои показатели и магазины','reports')}
        ${menuCard('users','Клиенты',leader?'Все лиды и дилеры':'Только мои клиенты','leads')}
        ${menuCard('phone','Телефония',leader?'Звонки команды':'Мои звонки','calls')}
        ${leader?menuCard('camera','Аудиты','Просмотр и аналитика','audit-dashboard'):menuCard('camera','Мои аудиты','Создание и история','audits')}
        ${menuCard('calendar','Календарь','Задачи по датам','calendar')}
        ${menuCard('user','Профиль и доступ','Личные данные и роль','profile')}
      </div>
    `,'more');
  }
  function menuCard(ic,title,sub,route){return `<button class="menu-card" data-go="${route}"><span class="menu-icon">${icon(ic,20)}</span><strong>${title}</strong><span>${sub}</span></button>`;}

  function profile() {
    const p=profileData();
    return shell(`
      ${pageHead('Профиль',p.name,p.label+' · '+p.subtitle)}
      <button class="profile-hero card profile-open" data-go="profile-edit"><div class="profile-avatar">${p.initials}</div><div class="profile-copy"><strong>${p.name}</strong><span>${p.label}</span><small>${p.subtitle}</small></div>${icon('edit',18)}</button>
      <div class="section-title"><h2>Рабочий профиль</h2></div>
      <div class="role-choice-grid role-choice-grid-3">
        ${roleChoice('leader','Руководитель','Вся CRM, команда и контроль. Аудиты только просмотр.')}
        ${roleChoice('manager','Менеджер','Только собственные магазины, задачи, звонки и аудиты.')}
        ${roleChoice('logistics','Логист','Торговый контур: заказы, склады, товары и рейтинг точек.')}
      </div>
      <div class="section-title"><h2>Доступ</h2></div>
      <div class="card card-pad stack">
        ${detailLine('Компания','ALTDEKOR')}${detailLine('Роль',p.label)}${detailLine('Регион',isLeader()?'Все регионы':isManager()?'Южный регион':'Все склады')}${detailLine('Контур',isLogistics()?'Торговля и логистика':isLeader()?'CRM / аналитика / торговля':'Личные CRM-данные')}
      </div>
      ${isLeader()?`<div class="section-title"><h2>Сотрудники и роли</h2><button class="link-button" data-go="team">Все сотрудники</button></div><button class="card team-summary" data-go="team"><span class="team-avatars"><i>АС</i><i>ДК</i><i>СЛ</i></span><span><strong>12 сотрудников</strong><small>3 роли · 2 региона · управление доступом</small></span>${icon('chevron',18)}</button>`:''}
      <div class="section-title"><h2>Настройки</h2></div>
      <div class="card card-pad">${listItem('user','Личные данные','Имя, фамилия, телефон и email','profile-edit')}${listItem('bell','Уведомления','Push, сроки и изменения','profile')}${listItem('logout','Выйти','Завершить текущую сессию','profile','danger')}</div>
    `,'more',{back:'more'});
  }
  function roleChoice(role,title,sub){const roleIcon=role==='leader'?'users':role==='manager'?'user':'truck';return `<button class="role-choice ${state.role===role?'active':''}" data-role="${role}"><span class="role-icon">${icon(roleIcon,20)}</span><strong>${title}</strong><small>${sub}</small>${state.role===role?`<i>${icon('check',14)}</i>`:''}</button>`;}
  function shopShell(content,active='orders',title='Торговый контур') {
    const routes={orders:'shop-orders',analytics:'shop-analytics',catalog:'shop-catalog',warehouses:'shop-warehouses',collections:'shop-collections',products:'shop-products',stock:'shop-stock',contractors:'shop-contractors'};
    return shell(`<div class="workspace-head"><span class="workspace-eyebrow">ALTDEKOR</span><h1>${title}</h1><p>Заказы, товарный каталог, склады и операционная аналитика</p></div>${shopTabs(active)}${content}`,routes[active]||'shop-orders',{title:'ALTDEKOR',subtitle:'Торговый контур'});
  }
  function shopTabs(active) {
    const tabs=[['catalog','box','Каталог'],['orders','grid','Заказы'],['analytics','chart','Аналитика'],['warehouses','warehouse','Склады'],['collections','collection','Коллекции'],['products','box','Товары'],['stock','balance','Остатки'],['contractors','users','Контрагенты']];
    return `<div class="workspace-tabs">${tabs.map(([r,i,l])=>`<button class="${active===r?'active':''}" data-go="shop-${r}">${icon(i,16)}${l}</button>`).join('')}</div>`;
  }

  function shopOrders(){
    const sets={new:[['00421','River House','Москва','184 000 ₽','Новый'],['00425','Дом декора','Тверь','126 400 ₽','Новый'],['00427','Интерьер PRO','Краснодар','208 000 ₽','Новый']],paid:[['00418','ООО «АртСтена»','Тула','92 400 ₽','Оплачен'],['00416','Стильный дом','Псков','148 900 ₽','Оплачен']],ship:[['00412','River House','Москва','274 000 ₽','К отгрузке']],done:[['00398','Дом фактур','Москва','88 200 ₽','Завершён']]};
    const labels=[['new','Новые',3],['paid','Оплачены',2],['ship','К отгрузке',4],['done','Завершены',18]];
    return shopShell(`<div class="workspace-toolbar"><div><h2>Заказы</h2><span class="tiny muted">Раскройте карточку для состава и логистики</span></div><button class="primary dark compact-button" data-sheet="order">${icon('plus',15)} Создать</button></div><div class="order-status-tabs">${labels.map(([k,l,n])=>`<button class="order-status ${state.orderStatus===k?'active':''}" data-order-status="${k}">${l} · ${n}</button>`).join('')}</div><div class="stack shop-stack">${sets[state.orderStatus].map(row=>orderCard(...row)).join('')}</div>`,'orders');
  }
  function orderCard(number,name,city,total,status){
    const open=state.expandedOrder===number;
    const kind=status==='Новый'?'info':status==='Оплачен'?'warning':status==='К отгрузке'?'violet':'success';
    return `<article class="card order-card ${open?'expanded':''}"><button class="order-card-main" data-order-toggle="${number}"><div class="top"><div><h3>№ ${number}</h3><div class="small muted">${name} · ${city}</div></div><span class="status-pill ${kind}">${status}</span></div><div class="order-lines"><div><span>Сумма</span><strong>${total}</strong></div><div><span>Отгрузка</span><strong>${status==='Новый'?'31.07':status==='Оплачен'?'30.07':'29.07'}</strong></div></div><div class="order-expand-label"><span>${open?'Скрыть детали':'Состав, оплата и доставка'}</span>${icon('chevron',16,open?'class="rotated"':'')}</div></button>${open?`<div class="order-detail-inline"><div class="order-product"><span class="product-thumb">${icon('box',19)}</span><div><strong>Панель Loft White</strong><small>12 пачек · 34,56 м²</small></div><b>44 200 ₽</b></div><div class="order-product"><span class="product-thumb">${icon('collection',19)}</span><div><strong>Стенд 4 панели</strong><small>2 комплекта</small></div><b>139 800 ₽</b></div><div class="order-meta-grid"><div><span>Склад</span><strong>Склад образцов</strong></div><div><span>Оплата</span><strong>${status==='Новый'?'Ожидается':'Получена'}</strong></div><div><span>Контакт</span><strong>+7 999 213-44-10</strong></div><div><span>Менеджер</span><strong>Анна Соколова</strong></div></div><button class="secondary full" data-go="shop-order-detail">Открыть заказ полностью</button></div>`:''}</article>`;
  }
  function shopAnalytics(){
    const metricsByPeriod={
      month:[['revenue','Выручка','24,8 млн ₽','Июль','chart'],['shipments','Отгружено','18 420 м²','72% плана','box'],['orders','Заказы','27','7 активных','grid'],['contractors','Контрагенты','38','5 новых','users']],
      quarter:[['revenue','Выручка','72,4 млн ₽','III квартал','chart'],['shipments','Отгружено','52 610 м²','76% квартала','box'],['orders','Заказы','84','16 активных','grid'],['contractors','Контрагенты','42','8 новых','users']],
      year:[['revenue','Выручка','149,2 млн ₽','2026','chart'],['shipments','Отгружено','149 200 м²','68% года','box'],['orders','Заказы','318','29 активных','grid'],['contractors','Контрагенты','64','12 новых','users']],
    };
    const periodButtons=[['month','Месяц'],['quarter','Квартал'],['year','Год']];
    const metrics=metricsByPeriod[state.shopPeriod] || metricsByPeriod.month;
    return shopShell(`<div class="workspace-toolbar"><div><h2>Аналитика</h2><span class="tiny muted">Нажмите на показатель для детализации</span></div><button class="secondary compact-button">${icon('download',15)} XLSX</button></div><div class="segmented segmented-3 shop-period">${periodButtons.map(([key,label])=>`<button class="${state.shopPeriod===key?'active':''}" data-shop-period="${key}">${label}</button>`).join('')}</div><div class="switch-panel" data-switch-surface="shop-${state.shopPeriod}"><div class="analytics-grid shop-analytics-grid">${metrics.map(([k,l,v,sub,ic])=>`<button class="card analytics-card analytics-button ${state.analyticsMetric===k?'selected':''}" data-analytics-metric="${k}"><span>${icon(ic,18)}</span><strong>${v}</strong><small>${l} · ${sub}</small></button>`).join('')}</div>${shopAnalyticsInline(state.analyticsMetric)}<div class="section-title"><h2>Статусы заказов</h2></div><div class="card card-pad bar-list">${state.shopPeriod==='month' ? `${barRow('Новые','3',28)}${barRow('Оплачены','2',18)}${barRow('К отгрузке','4',36)}${barRow('Завершены','18',92)}` : state.shopPeriod==='quarter' ? `${barRow('Новые','9',34)}${barRow('Оплачены','14',58)}${barRow('К отгрузке','16',64)}${barRow('Завершены','45',89)}` : `${barRow('Новые','18',22)}${barRow('Оплачены','54',48)}${barRow('К отгрузке','29',41)}${barRow('Завершены','217',94)}`}</div></div>`,'analytics');
  }
  function resourceList(active,title,ic,addLabel,rows) {return shopShell(`<div class="workspace-toolbar"><div><h2>${title}</h2><span class="tiny muted">Поиск, просмотр и изменение</span></div><button class="primary dark compact-button" data-go="form-${active==='warehouses'?'warehouse':active==='collections'?'collection':active==='products'?'product':active==='stock'?'stock':'contractor'}">${icon('plus',15)} ${addLabel}</button></div><div class="search shop-search">${icon('search',18)}<input placeholder="Поиск..."></div><div class="table-card shop-table">${rows.join('')}</div>`,active);}
  function rowResource(title,sub,status='Активен',sheetType=''){
    const kind=status.includes('налич')||status.includes('Актив')?'success':status.includes('Низк')?'warning':'info';
    return `<article class="table-row resource-row"><div class="resource-copy"><strong class="resource-title">${title}</strong><span class="resource-subtitle">${sub}</span></div><div class="resource-actions"><span class="status-pill ${kind}">${status}</span>${sheetType?`<button class="resource-edit" data-sheet="${sheetType}" aria-label="Изменить ${title}">${icon('edit',15)}<span>Изменить</span></button>`:''}</div></article>`;
  }
  function shopCatalog(){
    return shopShell(`
      <div class="workspace-toolbar catalog-toolbar"><div><h2>Каталог</h2><span class="tiny muted">Товары, коллекции и доступные остатки</span></div><button class="primary dark compact-button" data-go="form-product">${icon('plus',15)} Товар</button></div>
      <div class="catalog-hero card">
        <span class="catalog-hero-icon">${icon('box',24)}</span>
        <div><small>Активный ассортимент</small><strong>124 товара</strong><span>8 позиций требуют пополнения</span></div>
        <button data-go="shop-products">Открыть${icon('chevron',16)}</button>
      </div>
      <div class="catalog-grid">
        <button class="card catalog-card" data-go="shop-products"><span>${icon('box',21)}</span><strong>Товары</strong><small>Цена, упаковка, изображения</small><b>124</b></button>
        <button class="card catalog-card" data-go="shop-collections"><span>${icon('collection',21)}</span><strong>Коллекции</strong><small>Структура ассортимента</small><b>12</b></button>
        <button class="card catalog-card" data-go="shop-stock"><span>${icon('balance',21)}</span><strong>Остатки</strong><small>Наличие и резерв по складам</small><b>20</b></button>
        <button class="card catalog-card" data-go="shop-warehouses"><span>${icon('warehouse',21)}</span><strong>Склады</strong><small>Точки хранения и выдачи</small><b>2</b></button>
      </div>
      <div class="section-title"><h2>Требует внимания</h2><button class="link-button" data-go="shop-stock">Все остатки</button></div>
      <div class="card card-pad stack catalog-alerts">
        ${listItem('box','Панель Loft White','Осталось 8 пачек · Южный склад','shop-stock','warning')}
        ${listItem('box','Панель Provence Sand','Нет свободного остатка','shop-stock','danger')}
      </div>
    `,'catalog');
  }

  function shopWarehouses(){return resourceList('warehouses','Склады','warehouse','Добавить',[rowResource('Склад образцов','Москва · доставка и самовывоз','Активен','warehouse-edit'),rowResource('Южный склад','Краснодар · доставка','Активен','warehouse-edit')]);}
  function shopCollections(){return resourceList('collections','Коллекции','collection','Добавить',[rowResource('Loft','12 товаров · порядок 1','Активна','collection-edit'),rowResource('Provence','9 товаров · порядок 2','Активна','collection-edit')]);}
  function shopProducts(){return resourceList('products','Товары','box','Добавить',[rowResource('Стенд 4 панели','00-00000302 · 1 000 ₽/м²','Активен','product-edit'),rowResource('Панель Loft White','00-00000312 · 1 280 ₽/м²','Активен','product-edit')]);}
  function shopStock(){return resourceList('stock','Остатки','balance','Добавить',[rowResource('Стенд 4 панели','Склад образцов · доступно 12 пачек','В наличии','stock-edit'),rowResource('Панель Loft White','Южный склад · доступно 8 пачек','В наличии','stock-edit')]);}
  function contractorRow(id) {
    const contractor=CONTRACTORS[id];
    const status=state.contractorStatuses[id];
    const kind=status==='Подтверждён'||status==='Активен'?'success':'warning';
    return `<article class="table-row resource-row contractor-row">
      <div class="resource-copy">
        <strong class="resource-title">${contractor.name}</strong>
        <span class="resource-subtitle">ИНН ${contractor.inn} · ${contractor.city}</span>
        <span class="contractor-contact">${contractor.contact} · ${contractor.phone}</span>
      </div>
      <span class="status-pill ${kind} contractor-status">${status}</span>
      <div class="contractor-actions">
        <button data-contractor-action="call" data-contractor-id="${id}">${icon('phone',16)}<span>Позвонить</span></button>
        <button data-contractor-action="edit" data-contractor-id="${id}">${icon('edit',16)}<span>Изменить</span></button>
        <button data-contractor-action="confirm" data-contractor-id="${id}">${icon('shield',16)}<span>Подтвердить</span></button>
      </div>
    </article>`;
  }
  function shopContractors(){return resourceList('contractors','Контрагенты','users','Добавить',[contractorRow('artstena'),contractorRow('river')]);}

  function formScreen(kind) {
    const configs={
      warehouse:{title:'Добавить склад',subtitle:'Контактные данные и способы получения',fields:`${field('Название *','Склад образцов')}${field('Город *','Москва')}${field('Адрес','ул. Примерная, д. 1')}${field('Телефон','+7 (999) 123-45-67','tel')}${field('Email','warehouse@example.com','email')}<label class="check-row"><input type="checkbox"> Доступна доставка</label><label class="check-row"><input type="checkbox"> Доступен самовывоз</label><label class="check-row"><input type="checkbox" checked> Активен</label>`},
      collection:{title:'Добавить коллекцию',subtitle:'Группировка товаров в каталоге',fields:`${field('Название *','Loft')}${field('Slug','loft, provence …')}${field('Описание','','textarea')}${field('Порядок','0','number')}<label class="check-row"><input type="checkbox" checked> Активна</label><div class="field"><label>Изображение</label><label class="upload">${icon('upload',20)}<span>Загрузить изображение</span><input type="file" hidden></label></div>`},
      product:{title:'Добавить товар',subtitle:'Карточка товара и параметры упаковки',fields:`${field('Артикул *','00-00000302')}${field('Наименование *','Стенд 4 панели')}${selectField('Коллекция','Выберите коллекцию')}${field('Описание','','textarea')}${field('Цена за м² *','0,00','number')}${field('м² в пачке *','0,0000','number')}<div class="field"><label>Изображение</label><label class="upload">${icon('upload',20)}<span>Загрузить изображение</span><input type="file" hidden></label></div>${field('Вес пачки, кг','0,00','number')}<label class="check-row"><input type="checkbox" checked> Активен</label>`},
      stock:{title:'Остаток на складе',subtitle:'Количество и резерв по товару',fields:`${selectField('Товар','Выберите товар')}${selectField('Склад *','Сначала выберите товар')}${field('Количество, пачек *','','number')}${field('Зарезервировано, пачек','','number')}`},
      contractor:{title:'Контрагент',subtitle:'Юридические данные, магазины и доступ',fields:`${field('Юридическое имя *','')}<div class="grid-2">${field('ИНН *','')}${field('ОГРН *','')}</div>${field('Юридический адрес *','')}${field('Фактический адрес *','')}${field('ФИО контакта','')}${field('Город','Город 1')}${selectField('Видимые коллекции','Все коллекции')}<button class="secondary full">${icon('plus',16)} Добавить магазин</button><button class="secondary full">${icon('plus',16)} Добавить реквизит</button>${selectField('Склад','Выберите склад')}<button class="secondary full">${icon('plus',16)} Создать пользователя</button>${field('Доп. информация *','','textarea')}<label class="check-row"><input type="checkbox"> Верифицирован</label>`},
    };
    const c=configs[kind];
    const back=`shop-${kind==='warehouse'?'warehouses':kind==='collection'?'collections':kind==='product'?'products':kind==='stock'?'stock':'contractors'}`;
    return shell(`${pageHead('Магазин',c.title,c.subtitle)}<div class="card card-pad form-section">${c.fields}<div class="form-actions"><button class="secondary" data-go="${back}">Отмена</button><button class="primary dark" data-action="form-save">Сохранить</button></div></div>`,'more',{title:'ALTDEKOR',subtitle:'Магазин',back});
  }

  function planVisual(pct){
    if(pct>=80) return {tone:'plan-good',pill:'success',label:`${pct}% плана`,summary:'План выполняется стабильно'};
    if(pct>=60) return {tone:'plan-watch',pill:'warning',label:`${pct}% плана`,summary:'Нужно ускорить отгрузки'};
    return {tone:'plan-bad',pill:'danger',label:`${pct}% плана`,summary:'Критическое отставание'};
  }

  function logisticsHome() {
    const pct=72;
    const visual=planVisual(pct);
    return shell(`
      ${pageHead('Торговый контур','Операционная сводка','Заказы, отгрузки, склады и рейтинг торговых точек.')}
      <article class="metric-hero logistics-hero ${visual.tone} clickable" data-go="shop-analytics">
        <div class="metric-head"><div><div class="metric-label">Отгружено за июль</div><div class="metric-value">18 420 м²</div><div class="metric-summary">${visual.summary}</div></div><span class="status-pill ${visual.pill}">${visual.label}</span></div>
        <div class="progress-track"><div class="progress-bar" style="width:${pct}%"></div></div>
        <div class="metric-foot"><span>27 заказов</span><span>4 к отгрузке</span></div>
      </article>
      <div class="grid-2" style="margin-top:10px">
        ${kpi('grid','Активные заказы','7','3 новых','shop-orders')}
        ${kpi('warehouse','Склады','2','20 позиций ниже нормы','shop-warehouses')}
        ${kpi('box','Товары','124','8 без остатка','shop-products')}
        ${kpi('users','Контрагенты','38','5 новых','shop-contractors')}
      </div>
      <div class="section-title"><h2>Торговые точки</h2><button class="link-button" data-go="logistics-stores">Весь рейтинг</button></div>
      <div class="best-worst-grid">
        <button class="card performance-card best" data-go="logistics-stores"><span class="performance-icon">${icon('trophy',20)}</span><small>Лучшая точка</small><strong>River House</strong><b>91% плана</b><span>2,8 млн ₽</span></button>
        <button class="card performance-card worst" data-go="logistics-stores"><span class="performance-icon">${icon('trend',20)}</span><small>Требует внимания</small><strong>Дом декора</strong><b>43% плана</b><span>−18% к июню</span></button>
      </div>
      <div class="section-title"><h2>Ближайшие отгрузки</h2><button class="link-button" data-go="shop-orders">Все заказы</button></div>
      <div class="card card-pad logistics-shipments">
        ${listItem('truck','№ 00418 · АртСтена','Сегодня, 16:00 · Склад образцов','shop-order-detail','success')}
        ${listItem('truck','№ 00421 · River House','Завтра, 10:30 · 34,56 м²','shop-order-detail','info')}
      </div>
    `,'home');
  }

  function logisticsStores() {
    const rows=[
      ['River House','Москва','91%',91,'2,8 млн ₽','+14%','success'],
      ['АртСтена','Санкт-Петербург','86%',86,'2,4 млн ₽','+11%','success'],
      ['Интерьер PRO','Краснодар','66%',66,'2,0 млн ₽','+7%','warning'],
      ['Стильный дом','Псков','58%',58,'1,7 млн ₽','+3%','danger'],
      ['Дом декора','Тверь','43%',43,'1,6 млн ₽','−4%','danger'],
    ];
    return shell(`
      ${pageHead('Аналитика точек','Рейтинг магазинов','Сравнение по выполнению плана, выручке и динамике заказов.')}
      <div class="segmented"><button class="active">План</button><button>Выручка</button><button>Динамика</button></div>
      <div class="network-summary-strip"><div><span>Лидер</span><strong>River House</strong></div><div><span>Среднее</span><strong>72%</strong></div><div><span>Ниже 60%</span><strong class="danger">2</strong></div></div>
      <div class="stack" style="margin-top:12px">${rows.map((r,i)=>logisticsPointCard(i+1,...r)).join('')}</div>
    `,'logistics-stores');
  }

  function logisticsPointCard(rank,name,city,plan,width,revenue,growth,kind) {
    return `<button class="card logistics-point ${width<60?'underperforming':''}" data-go="shop-analytics"><span class="rank">${rank}</span><div class="flex-1"><div class="row between"><div><strong>${name}</strong><small>${city}</small></div><span class="status-pill ${kind}">${plan}</span></div><div class="bar"><i style="width:${width}%"></i></div><div class="point-metrics"><span>${revenue}</span><span class="${growth.startsWith('−')?'danger':'success'}">${growth}</span><span>${width>=80?'Стабильно':width>=60?'В зоне риска':'Критично'}</span></div></div></button>`;
  }

  function logisticsMore() {
    return shell(`
      ${pageHead('Торговый контур','Все разделы','Логист видит только операционные данные модуля торговли.')}
      <div class="menu-grid">
        ${menuCard('grid','Заказы','Канбан и состав заказов','shop-orders')}
        ${menuCard('chart','Аналитика','Выручка, м² и статусы','shop-analytics')}
        ${menuCard('store','Рейтинг точек','Лучшие и отстающие магазины','logistics-stores')}
        ${menuCard('warehouse','Склады','Адреса и способы доставки','shop-warehouses')}
        ${menuCard('collection','Коллекции','Структура каталога','shop-collections')}
        ${menuCard('box','Товары','Параметры и упаковка','shop-products')}
        ${menuCard('balance','Остатки','Доступно и в резерве','shop-stock')}
        ${menuCard('users','Контрагенты','Покупатели и реквизиты','shop-contractors')}
        ${menuCard('user','Профиль','Личные данные и доступ','profile')}
      </div>
    `,'more');
  }

  function callDialer() {
    const back=callBackRoute();
    const contact=callContactForNumber(state.dialNumber);
    const knownContact=contact.name!=='Новый клиент';
    return shell(`
      ${pageHead('Телефония','Новый звонок','Введите номер или выберите клиента из последних контактов.')}
      ${knownContact?`<article class="call-context-card card card-pad"><div class="row between"><div><span class="tiny muted">Постоянный клиент</span><h3>${contact.name}</h3></div><span class="status-pill info">Контекст</span></div><div class="call-context-grid"><div><span>Последний контакт</span><strong>25 июля</strong></div><div><span>Менеджер</span><strong>Алексей</strong></div><div><span>Последняя цель</span><strong>Уточнение заказа</strong></div></div></article>`:`<article class="call-prep-card card card-pad"><div class="row between"><div><span class="tiny muted">Новый клиент</span><h3>Подготовка звонка</h3></div><span class="status-pill warning">Чек-лист</span></div><div class="call-checklist"><span>${icon('check',14)} Представиться</span><span>${icon('check',14)} Назвать компанию</span><span>${icon('check',14)} Обозначить цель звонка</span><span>${icon('check',14)} Зафиксировать результат</span></div></article>`}
      <div class="section-title"><h2>Цель звонка</h2></div>
      <div class="filter-row call-goals">${['Узнать ситуацию','Новый заказ','Оплата','Встреча','Другое'].map(goal=>`<button class="chip ${state.callGoal===goal?'active':''}" data-call-goal="${goal}">${goal}</button>`).join('')}</div>
      <div class="dialer-number-card card"><span class="tiny muted">Номер телефона</span><strong>${state.dialNumber || 'Введите номер'}</strong><button data-dial-delete aria-label="Удалить цифру">${icon('close',17)}</button></div>
      <div class="dial-pad">${['1','2','3','4','5','6','7','8','9','+','0','#'].map(d=>`<button data-dial-digit="${d}"><strong>${d}</strong>${d==='2'?'<small>АБВ</small>':d==='3'?'<small>ГДЕ</small>':d==='4'?'<small>ЖЗИ</small>':d==='5'?'<small>КЛМ</small>':d==='6'?'<small>НОП</small>':d==='7'?'<small>РСТ</small>':d==='8'?'<small>УФХ</small>':d==='9'?'<small>ЦЧШ</small>':''}</button>`).join('')}</div>
      <button class="call-start-button" data-action="call-start">${icon('phone',25)}<span>Позвонить</span></button>
      <div class="section-title"><h2>Последние контакты</h2></div>
      <div class="card card-pad contacts-quick">
        <button data-number="+7 999 213-44-10"><span class="profile-avatar contact-avatar">RH</span><span><strong>River House</strong><small>+7 999 213-44-10</small></span>${icon('phone',17)}</button>
        <button data-number="+7 910 442-18-09"><span class="profile-avatar contact-avatar">АД</span><span><strong>Дом декора</strong><small>+7 910 442-18-09</small></span>${icon('phone',17)}</button>
      </div>
    `,'more',{back});
  }

  function callContactForNumber(number) {
    const known={
      '+7 999 213-44-10':{name:'River House',phone:'+7 999 213-44-10',initials:'RH'},
      '+7 910 442-18-09':{name:'Дом декора',phone:'+7 910 442-18-09',initials:'ДД'},
    };
    return known[number]||{name:'Новый клиент',phone:number||'Введите номер',initials:'НК'};
  }

  function callActive() {
    const contact=state.callContact;
    const back=callBackRoute();
    return shell(`
      <div class="active-call-screen">
        <div class="call-state">Исходящий звонок</div>
        <div class="call-contact-avatar">${contact.initials}</div>
        <h1>${contact.name}</h1><p>${contact.phone}</p><div class="call-timer">00:38</div>
        <div class="call-control-grid">
          <button class="call-control ${state.callMuted?'active':''}" data-call-toggle="mute">${icon(state.callMuted?'mute':'mic',23)}<span>Микрофон</span></button>
          <button class="call-control ${state.callSpeaker?'active':''}" data-call-toggle="speaker">${icon('volume',23)}<span>Динамик</span></button>
          <button class="call-control" data-call-toggle="keypad">${icon('keypad',23)}<span>Клавиши</span></button>
          <button class="call-control">${icon('user',23)}<span>Контакт</span></button>
        </div>
        <button class="hangup-button" data-action="call-end">${icon('phoneOff',27)}<span>Завершить</span></button>
        <div class="recording-note">${icon('shield',16)} Запись и привязка к карточке клиента включены</div>
      </div>
    `,'more',{nav:false,title:'Звонок',subtitle:'ALTDEKOR',back,noBottom:true});
  }

  function callEnded() {
    const contact=state.callContact;
    const back=callBackRoute();
    return shell(`
      ${pageHead('Телефония','Звонок завершён',`${contact.name} · 1 мин 42 сек`)}
      <article class="card call-result-card"><span class="call-result-icon">${icon('check',26)}</span><h2>Разговор сохранён</h2><p>Запись отправлена на расшифровку. AI-анализ появится в карточке через несколько минут.</p></article>
      <div class="section-title"><h2>Зафиксировать результат</h2></div>
      <div class="form-section card card-pad">
        ${selectField('Результат звонка','Договорились о следующем шаге')}${field('Следующий контакт','2026-07-31','date')}${field('Комментарий','Краткий итог разговора','textarea')}
        <label class="check-row"><input type="checkbox" checked> Создать задачу на следующий контакт</label>
        <button class="primary full" data-action="call-save">Сохранить результат</button>
        <button class="secondary full" data-go="${back}">Вернуться назад</button>
      </div>
    `,'more',{back});
  }

  function profileEdit() {
    const p=profileData();
    const parts=p.name.split(' ');
    return shell(`
      ${pageHead('Профиль','Личные данные','Изменения применяются только к вашей учётной записи.')}
      <div class="profile-photo-edit"><div class="profile-avatar">${p.initials}</div><button class="secondary compact-button">Изменить фото</button></div>
      <div class="form-section card card-pad">
        ${valueField('Имя *',parts[0]||'','text')}${valueField('Фамилия *',parts[1]||'','text')}${valueField('Телефон','+7 999 123-45-67','tel')}${valueField('Email',state.role+'@altdekor.ru','email')}
        <div class="field"><label>Должность</label><input class="control" value="${p.label}" disabled></div>
        <button class="primary full" data-action="profile-save">${icon('save',17)} Сохранить изменения</button>
      </div>
      <div class="section-title"><h2>Безопасность</h2></div>
      <div class="card card-pad">${listItem('shield','Пароль и вход','Последнее изменение 18 июня','profile-edit')}${listItem('phone','Активные устройства','iPhone и Chrome macOS','profile-edit')}</div>
    `,'more',{back:'profile'});
  }

  function team() {
    const employees=[['anna','АС','Анна Соколова','Менеджер','Южный регион','manager'],['dmitry','ДК','Дмитрий Козлов','Менеджер','Центральный регион','manager'],['sergey','СЛ','Сергей Логинов','Логист','Все склады','logistics'],['maria','МИ','Мария Иванова','Менеджер','Северо-Запад','manager']];
    return shell(`
      ${pageHead('Управление доступом','Сотрудники','Руководитель может изменить роль, регион и статус сотрудника.')}
      <div class="search">${icon('search',18)}<input placeholder="Имя, роль или регион"></div>
      <div class="filter-row" style="margin-top:10px"><button class="chip active">Все · 12</button><button class="chip">Менеджеры · 8</button><button class="chip">Логисты · 2</button></div>
      <div class="stack" style="margin-top:12px">${employees.map(e=>employeeCard(...e)).join('')}</div>
    `,'more',{back:'profile'});
  }

  function employeeCard(id,initials,name,role,region,roleKey) {
    return `<button class="card employee-card" data-employee="${id}" data-go="team-member"><span class="profile-avatar employee-avatar">${initials}</span><span class="flex-1"><strong>${name}</strong><small>${role} · ${region}</small><i class="employee-status">Активен</i></span><span class="status-pill ${roleKey==='logistics'?'violet':'info'}">${role}</span>${icon('chevron',17)}</button>`;
  }

  function teamMember() {
    const data={anna:['Анна','Соколова','Менеджер','Южный регион','anna@altdekor.ru'],dmitry:['Дмитрий','Козлов','Менеджер','Центральный регион','d.kozlov@altdekor.ru'],sergey:['Сергей','Логинов','Логист','Все склады','logistics@altdekor.ru'],maria:['Мария','Иванова','Менеджер','Северо-Запад','m.ivanova@altdekor.ru']}[state.selectedEmployee]||['Анна','Соколова','Менеджер','Южный регион','anna@altdekor.ru'];
    return shell(`
      ${pageHead('Сотрудник',data[0]+' '+data[1],'Настройка роли и границ доступа.')}
      <div class="form-section card card-pad">
        ${valueField('Имя',data[0])}${valueField('Фамилия',data[1])}${valueField('Email',data[4],'email')}
        <div class="field"><label>Роль *</label><select class="control"><option ${data[2]==='Менеджер'?'selected':''}>Менеджер</option><option ${data[2]==='Логист'?'selected':''}>Логист</option><option>Руководитель направления</option></select></div>
        <div class="field"><label>Регион / контур *</label><select class="control"><option>${data[3]}</option><option>Все регионы</option><option>Все склады</option></select></div>
        <label class="check-row"><input type="checkbox" checked> Активный пользователь</label>
      </div>
      <div class="section-title"><h2>Доступ по роли</h2></div>
      <div class="card card-pad permission-list">${data[2]==='Логист'?`${permission('Заказы, товары и склады',true)}${permission('Рейтинг торговых точек',true)}${permission('CRM, задачи и звонки',false)}${permission('Создание аудитов',false)}`:`${permission('Свои магазины и клиенты',true)}${permission('Свои звонки и задачи',true)}${permission('Свои аудиты',true)}${permission('Данные команды',false)}`}</div>
      <button class="primary full" style="margin-top:12px" data-action="employee-save">Сохранить роль и доступ</button>
    `,'more',{back:'team'});
  }

  function permission(label,ok){return `<div class="permission-row"><span class="permission-check ${ok?'ok':'no'}">${icon(ok?'check':'close',14)}</span><span>${label}</span></div>`;}

  function shopOrderDetail() {
    return shopShell(`
      <div class="order-detail-head"><button class="link-button" data-go="shop-orders">← Заказы</button><span class="status-pill info">Новый</span></div>
      <h2 class="shop-detail-title">Заказ № 00421</h2><p class="small muted">River House · Москва · создан 29 июля, 11:24</p>
      <div class="card card-pad stack order-full-card">${detailLine('Сумма','184 000 ₽')}${detailLine('Желаемая дата','31.07.2026')}${detailLine('Склад','Склад образцов')}${detailLine('Доставка','Курьером')}${detailLine('Оплата','Ожидается','warning')}</div>
      <div class="section-title"><h2>Состав заказа</h2><span class="tiny muted">2 позиции</span></div>
      <div class="card card-pad">${orderProductLine('Панель Loft White','12 пачек · 34,56 м²','44 200 ₽')}${orderProductLine('Стенд 4 панели','2 комплекта','139 800 ₽')}</div>
      <div class="section-title"><h2>Контрагент</h2></div>
      <div class="card card-pad contact-order"><strong>River House</strong><span>Алексей Малев · +7 999 213-44-10</span><button class="secondary full" data-go="call-dialer">${icon('phone',17)} Позвонить</button></div>
      <div class="grid-2" style="margin-top:12px"><button class="secondary full" data-sheet="contractor-edit" data-contractor-id="artstena">Изменить</button><button class="primary dark full" data-sheet="contractor-confirm" data-contractor-id="artstena">Подтвердить</button></div>
    `,'orders');
  }

  function orderProductLine(name,meta,total){return `<div class="order-product full-line"><span class="product-thumb">${icon('box',19)}</span><div><strong>${name}</strong><small>${meta}</small></div><b>${total}</b></div>`;}

  function shopAnalyticsInline(metric) {
    const content={
      revenue:`<div class="shop-insight card"><div class="row between"><div><span class="tiny muted">Выручка по неделям</span><strong>+6,2% к июню</strong></div><span class="status-pill success">Рост</span></div>${lineChart(['1','7','14','21','29'],[28,36,42,58,72],'Динамика, %').replace('card chart-card','chart-card inline-chart')}<button class="link-button" data-go="shop-analytics-detail">Полная детализация →</button></div>`,
      shipments:`<div class="shop-insight card"><div class="row between"><div><span class="tiny muted">Отгрузка к плану</span><strong>18 420 из 25 600 м²</strong></div><span class="status-pill warning">72%</span></div><div class="progress-track light"><div class="progress-bar" style="width:72%"></div></div><div class="order-meta-grid"><div><span>Эта неделя</span><strong>4 280 м²</strong></div><div><span>В пути</span><strong>1 120 м²</strong></div></div></div>`,
      orders:`<div class="shop-insight card"><div class="row between"><div><span class="tiny muted">Активные заказы</span><strong>7 заказов · 914 000 ₽</strong></div><span class="status-pill info">27 всего</span></div><div class="order-meta-grid"><div><span>Новые</span><strong>3</strong></div><div><span>Оплачены</span><strong>2</strong></div><div><span>К отгрузке</span><strong>4</strong></div><div><span>Средний чек</span><strong>132 000 ₽</strong></div></div></div>`,
      contractors:`<div class="shop-insight card"><div class="row between"><div><span class="tiny muted">Контрагенты</span><strong>38 активных</strong></div><span class="status-pill violet">+5 новых</span></div><div class="top-contractors"><div><span>1</span><strong>River House</strong><b>2,8 млн ₽</b></div><div><span>2</span><strong>АртСтена</strong><b>2,4 млн ₽</b></div><div><span>3</span><strong>Интерьер PRO</strong><b>2,0 млн ₽</b></div></div></div>`,
    };
    return content[metric]||content.revenue;
  }

  function shopAnalyticsDetail() {
    return shopShell(`
      <div class="order-detail-head"><button class="link-button" data-go="shop-analytics">← Аналитика</button><span class="status-pill success">Июль 2026</span></div>
      <h2 class="shop-detail-title">Выручка и отгрузки</h2><p class="small muted">Детализация по неделям, торговым точкам и контрагентам.</p>
      ${detailedLineChart(['1 июл','7','14','21','29'],[26,34,43,59,72],'Выполнение плана, %')}
      <div class="analytics-grid">${analyticsCard('Средний чек','132 000 ₽','+8%','chart')}${analyticsCard('м² / заказ','68,2','+4,1','box')}${analyticsCard('Заказов','27','7 активных','grid')}${analyticsCard('Возвраты','1,2%','−0,3 п.п.','repeat')}</div>
      <div class="section-title"><h2>Лучшие точки</h2></div><div class="card card-pad top-contractors"><div><span>1</span><strong>River House</strong><b>2,8 млн ₽</b></div><div><span>2</span><strong>АртСтена</strong><b>2,4 млн ₽</b></div><div><span>3</span><strong>Интерьер PRO</strong><b>2,0 млн ₽</b></div></div>
      <div class="section-title"><h2>По неделям</h2></div><div class="card card-pad stack">${detailLine('1–7 июля','4,2 млн ₽')}${detailLine('8–14 июля','5,1 млн ₽')}${detailLine('15–21 июля','6,8 млн ₽')}${detailLine('22–29 июля','8,7 млн ₽')}</div>
    `,'analytics');
  }

  function valueField(label,value,type='text'){return `<div class="field"><label>${label}</label><input class="control" type="${type}" value="${value}"></div>`;}
  function lineChart(labels,values,title){
    const safeValues=values.map(Number).filter(Number.isFinite);
    const min=Math.min(...safeValues);
    const max=Math.max(...safeValues);
    const range=Math.max(1,max-min);
    const left=6,right=94,top=8,bottom=44;
    const coords=values.map((raw,i)=>{
      const value=Number(raw);
      const x=values.length===1?50:left+i*((right-left)/(values.length-1));
      const y=bottom-((value-min)/range)*(bottom-top);
      return {x:Number(x.toFixed(2)),y:Number(y.toFixed(2)),value};
    });
    const pts=coords.map(p=>`${p.x},${p.y}`).join(' ');
    const area=`${left},${bottom} ${pts} ${right},${bottom}`;
    const gradientId=`lineFill-${Math.abs(title.split('').reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0),0))}`;
    return `<div class="card chart-card chart-card-fixed"><div class="chart-title"><span>${title}</span><strong>${values[values.length-1]}${title.includes('%')?'%':''}</strong></div><div class="chart-plot"><svg viewBox="0 0 100 52" preserveAspectRatio="none" aria-label="${title}"><defs><linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0f62df" stop-opacity=".28"/><stop offset="1" stop-color="#0f62df" stop-opacity=".02"/></linearGradient></defs><g class="chart-grid-lines"><line x1="${left}" y1="${top}" x2="${right}" y2="${top}"/><line x1="${left}" y1="26" x2="${right}" y2="26"/><line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}"/></g><polygon points="${area}" fill="url(#${gradientId})"/><polyline points="${pts}" fill="none" stroke="#0f62df" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${coords.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="1.7" fill="#fff" stroke="#0f62df" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`).join('')}</svg></div><div class="chart-labels" style="grid-template-columns:repeat(${labels.length},minmax(0,1fr))">${labels.map(l=>`<span>${l}</span>`).join('')}</div></div>`;
  }
  function detailedLineChart(labels,values,title){
    const width=320,height=176;
    const left=32,right=304,top=18,bottom=142;
    const safeValues=values.map(Number);
    const maxValue=Math.max(100,...safeValues);
    const coords=safeValues.map((value,index)=>{
      const x=left+index*((right-left)/(safeValues.length-1));
      const y=bottom-(value/maxValue)*(bottom-top);
      return {x:Number(x.toFixed(2)),y:Number(y.toFixed(2))};
    });
    const points=coords.map(point=>`${point.x},${point.y}`).join(' ');
    const area=`${left},${bottom} ${points} ${right},${bottom}`;
    const gradientId='logistics-detail-fill';
    return `<div class="card chart-card chart-card-detailed">
      <div class="chart-title"><span>${title}</span><strong>${safeValues[safeValues.length-1]}%</strong></div>
      <div class="chart-plot">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" aria-label="${title}">
          <defs><linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0f62df" stop-opacity=".28"/><stop offset="1" stop-color="#0f62df" stop-opacity=".02"/></linearGradient></defs>
          <g class="chart-grid-lines">
            ${[100,75,50,25,0].map(value=>{const y=bottom-(value/maxValue)*(bottom-top);return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}"/><text x="4" y="${y+3}" class="chart-axis-label">${value}%</text>`;}).join('')}
          </g>
          <polygon points="${area}" fill="url(#${gradientId})"/>
          <polyline points="${points}" fill="none" stroke="#0f62df" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          ${coords.map(point=>`<circle cx="${point.x}" cy="${point.y}" r="4" fill="#fff" stroke="#0f62df" stroke-width="2.5"/>`).join('')}
        </svg>
      </div>
      <div class="chart-labels" style="grid-template-columns:repeat(${labels.length},minmax(0,1fr))">${labels.map(label=>`<span>${label}</span>`).join('')}</div>
    </div>`;
  }
  function areaChart(){return `<div class="card chart-card"><div class="chart-title"><span>План / факт, м²</span><strong>18 420</strong></div><svg viewBox="0 0 100 54" preserveAspectRatio="none"><polyline points="4,45 18,38 32,33 46,28 60,22 74,15 96,8" fill="none" stroke="#b6c0d2" stroke-width="1.8" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/><polyline points="4,47 18,41 32,35 46,32 60,27 74,22 96,18" fill="none" stroke="#0f62df" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg><div class="chart-legend"><span><i class="plan"></i>План</span><span><i class="fact"></i>Факт</span></div></div>`;}
  function multiLineChart(){return `<svg class="multi-chart" viewBox="0 0 100 42" preserveAspectRatio="none"><polyline points="2,32 20,28 38,25 56,19 74,22 98,17" fill="none" stroke="#0f62df" stroke-width="2" vector-effect="non-scaling-stroke"/><polyline points="2,27 20,25 38,29 56,23 74,26 98,25" fill="none" stroke="#1da76d" stroke-width="2" vector-effect="non-scaling-stroke"/><polyline points="2,34 20,31 38,28 56,26 74,30 98,28" fill="none" stroke="#e49b20" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;}

  function field(label,placeholder,type='text'){return `<div class="field"><label>${label}</label>${type==='textarea'?`<textarea class="control" placeholder="${placeholder}"></textarea>`:`<input class="control" type="${type}" placeholder="${placeholder}">`}</div>`;}
  function selectField(label,placeholder){return `<div class="field"><label>${label}</label><select class="control"><option>${placeholder}</option></select></div>`;}

  function sheet(type) {
    const p=profileData();
    const contractor=selectedContractor();
    const contractorStatus=state.contractorStatuses[state.selectedContractor];
    const content={
      'plan-summary':`<div class="sheet-head"><div><h2>Выполнение плана</h2><p>Сводка показателей по периодам.</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="sheet-kpi-grid"><div class="sheet-stat-card"><span>Сегодня</span><strong>4 280 м²</strong><small class="success">82% выполнения</small></div><div class="sheet-stat-card"><span>Месяц</span><strong>18 420 м²</strong><small>25 600 м² · 72%</small></div><div class="sheet-stat-card"><span>Квартал</span><strong>52 610 м²</strong><small>68 000 м² · 77%</small></div><div class="sheet-stat-card"><span>Год</span><strong>149 200 м²</strong><small>220 000 м² · 68%</small></div></div><div class="sheet-progress-block"><div class="row between"><strong>Текущий статус</strong><span class="status-pill warning">Есть отклонение</span></div><div class="progress-track light"><div class="progress-bar" style="width:72%"></div></div></div>${lineChart(['1','7','14','21','29'],[48,55,61,68,72],'Динамика выполнения, %')}<button class="primary full" data-go="report-month">Открыть подробнее</button>`,
      'operations-summary':`<div class="sheet-head"><div><h2>Операционная сводка</h2><p>Ключевые показатели рабочего контура.</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="sheet-kpi-grid"><div class="sheet-stat-card"><span>Магазины</span><strong>24</strong><small>активные точки</small></div><div class="sheet-stat-card"><span>Звонки</span><strong>214</strong><small>за июль</small></div><div class="sheet-stat-card"><span>Задачи</span><strong>31</strong><small>открытые</small></div><div class="sheet-stat-card"><span>Аудиты</span><strong>74%</strong><small>покрытие сети</small></div></div>`,
      role:`<div class="sheet-head"><div><h2>Рабочий профиль</h2><p>Интерфейс и данные меняются по роли.</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="role-sheet-profile"><span class="profile-avatar small-avatar">${p.initials}</span><div><strong>${p.name}</strong><span>${p.label}</span></div></div><div class="role-choice-grid role-choice-grid-3 sheet-roles">${roleChoice('leader','Руководитель','Вся CRM и контроль. Аудиты — просмотр.')}${roleChoice('manager','Менеджер','Только собственная работа и магазины.')}${roleChoice('logistics','Логист','Заказы, склады, товары и точки.')}</div><button class="secondary full" data-go="profile">Открыть профиль</button>`,
      'store-ai':`<div class="sheet-head"><div><h2>AI · Дом декора</h2><p>Контекст магазина уже выбран.</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="context-pill">${icon('store',16)} Дом декора · Тверь</div><div class="chat sheet-chat"><div class="bubble ai"><strong>Что хотите узнать?</strong><span>Могу объяснить отклонение от плана, показать динамику аудитов, звонков и задач.</span></div></div><div class="filter-row"><button class="chip">Почему отстаёт?</button><button class="chip">Что по аудитам?</button><button class="chip">Следующие действия</button></div><div class="chat-composer sheet-composer"><input class="chat-input" placeholder="Вопрос по этому магазину"><button class="mic-button">${icon('mic',20)}</button></div>`,
      task:`<div class="sheet-head"><h2>Новая задача</h2><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${field('Название *','Например: проверить магазин')}${isLeader()?selectField('Ответственный','Выберите сотрудника'):''}${field('Срок *','2026-07-30','date')}${selectField('Приоритет','Средний')}${field('Описание','Что нужно сделать','textarea')}<label class="check-row"><input type="checkbox"> Повторять ежемесячно</label><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary" data-action="sheet-save">Создать</button></div></div>`,
      lead:`<div class="sheet-head"><h2>Новый клиент</h2><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${field('Компания *','')}${field('Город','')}${field('Контактное лицо','')}${field('Телефон','+7','tel')}${selectField('Этап','Новый')}${field('Комментарий','','textarea')}<div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary" data-action="sheet-save">Сохранить</button></div></div>`,
      order:`<div class="sheet-head"><h2>Новый заказ</h2><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${selectField('Контрагент *','Выберите контрагента')}${selectField('Склад *','Выберите склад')}${field('Город','')}${field('Желаемая дата','2026-07-30','date')}${field('Комментарий','','textarea')}<div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="sheet-save">Создать</button></div></div>`,
      'warehouse-edit':`<div class="sheet-head"><div><h2>Изменить склад</h2><p>Склад образцов</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${valueField('Название *','Склад образцов')}${valueField('Город *','Москва')}${valueField('Адрес','ул. Примерная, д. 1')}${valueField('Телефон','+7 (999) 123-45-67','tel')}${valueField('Email','warehouse@altdekor.ru','email')}<label class="check-row"><input type="checkbox" checked> Доступна доставка</label><label class="check-row"><input type="checkbox" checked> Доступен самовывоз</label><label class="check-row"><input type="checkbox" checked> Активен</label><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="sheet-save">Сохранить</button></div></div>`,
      'collection-edit':`<div class="sheet-head"><div><h2>Изменить коллекцию</h2><p>Loft</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${valueField('Название *','Loft')}${valueField('Slug','loft')}${field('Описание','Современная коллекция с выраженной фактурой','textarea')}${valueField('Порядок','1','number')}<label class="check-row"><input type="checkbox" checked> Активна</label><div class="field"><label>Изображение</label><label class="upload">${icon('upload',20)}<span>Заменить изображение</span><input type="file" hidden></label></div><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="sheet-save">Сохранить</button></div></div>`,
      'product-edit':`<div class="sheet-head"><div><h2>Изменить товар</h2><p>Стенд 4 панели</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${valueField('Артикул *','00-00000302')}${valueField('Наименование *','Стенд 4 панели')}${selectField('Коллекция','Loft')}${field('Описание','Демонстрационный стенд для 4 панелей','textarea')}${valueField('Цена за м² *','1000','number')}${valueField('м² в пачке *','3.0000','number')}<div class="field"><label>Изображение</label><label class="upload">${icon('upload',20)}<span>Заменить изображение</span><input type="file" hidden></label></div>${valueField('Вес пачки, кг','12.40','number')}<label class="check-row"><input type="checkbox" checked> Активен</label><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="sheet-save">Сохранить</button></div></div>`,
      'stock-edit':`<div class="sheet-head"><div><h2>Изменить остаток</h2><p>Стенд 4 панели · Склад образцов</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${selectField('Товар','Стенд 4 панели')}${selectField('Склад *','Склад образцов')}${valueField('Количество, пачек *','12','number')}${valueField('Зарезервировано, пачек','3','number')}<div class="stock-preview"><span>Доступно после резерва</span><strong>9 пачек</strong></div><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="sheet-save">Сохранить</button></div></div>`,
      'contractor-edit':`<div class="sheet-head"><div><h2>Изменить контрагента</h2><p>${contractor.name}</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${valueField('Юридическое имя *',contractor.name)}${valueField('ИНН *',contractor.inn)}${valueField('ОГРН *',contractor.ogrn)}${valueField('Контактное лицо',contractor.contact)}${valueField('Телефон',contractor.phone,'tel')}${valueField('Город',contractor.city)}${valueField('Email',contractor.email,'email')}${selectField('Видимые коллекции',contractor.collections)}<label class="check-row"><input type="checkbox" checked> Активен</label><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="sheet-save">Сохранить</button></div></div>`,
      'contractor-confirm':`<div class="sheet-head"><div><h2>Подтвердить контрагента</h2><p>Проверьте данные перед изменением статуса.</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="contractor-summary"><span class="contractor-summary-icon">${icon('shield',22)}</span><div><strong>${contractor.name}</strong><span>${contractor.contact} · ${contractor.phone}</span></div></div><div class="card card-pad stack contractor-summary-list">${detailLine('ИНН',contractor.inn)}${detailLine('ОГРН',contractor.ogrn)}${detailLine('Город',contractor.city)}${detailLine('Текущий статус',contractorStatus,contractorStatus==='Требует проверки'?'warning':'success')}</div><p class="contractor-confirm-note">После подтверждения контрагент получит статус «Подтверждён» и останется доступен для заказов.</p><div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary dark" data-action="contractor-confirm">${icon('check',16)} Подтвердить</button></div>`,
      'call-summary':`<div class="sheet-head"><div><h2>Итоги звонка</h2><p>${state.callContact.name} · ${state.callGoal}</p></div><button class="sheet-close" data-close>${icon('close',18)}</button></div><div class="form-section">${selectField('Цель звонка',state.callGoal)}${selectField('Результат','Договорились о следующем шаге')}${field('Комментарий','Краткий итог разговора','textarea')}${selectField('Следующая задача','Создать задачу на следующий контакт')}<div class="form-actions"><button class="secondary" data-close>Отмена</button><button class="primary" data-action="call-summary-save">Сохранить итог</button></div></div>`,
    }[type]||'';
    return `<div class="sheet-backdrop" data-backdrop><div class="sheet"><div class="sheet-handle"></div>${content}</div></div>`;
  }
  function routeContent(route) {
    const map={
      home,reports,'revenue-detail':revenueDetail,'report-month':reportMonth,'report-stores':reportStores,
      stores,'store-detail':storeDetail,'store-plan':storePlan,'store-history':storeHistory,'logistics-stores':logisticsStores,
      'audit-dashboard':auditDashboard,audits,audit,'audit-detail':auditDetail,
      tasks,'task-detail':taskDetail,calendar,leads,'lead-detail':leadDetail,calls,'call-dialer':callDialer,'call-active':callActive,'call-ended':callEnded,'call-detail':callDetail,
      assistant,'product-ai':productAI,notifications,more,profile,'profile-edit':profileEdit,team,'team-member':teamMember,
      'shop-orders':shopOrders,'shop-order-detail':shopOrderDetail,'shop-analytics':shopAnalytics,'shop-analytics-detail':shopAnalyticsDetail,'shop-catalog':shopCatalog,'shop-warehouses':shopWarehouses,
      'shop-collections':shopCollections,'shop-products':shopProducts,'shop-stock':shopStock,
      'shop-contractors':shopContractors,'form-warehouse':()=>formScreen('warehouse'),
      'form-collection':()=>formScreen('collection'),'form-product':()=>formScreen('product'),
      'form-stock':()=>formScreen('stock'),'form-contractor':()=>formScreen('contractor'),
    };
    return (map[roleGuard(route)]||home)();
  }
  function renderFigmaRole(role) {
    const before=state.role;
    state.role=role;
    const titles={leader:'Профиль руководителя',manager:'Профиль менеджера',logistics:'Профиль логиста'};
    const out=`<section class="figma-role-group"><h2>${titles[role]}</h2><div class="figma-grid">${screens[role].map(([route,label])=>`<section class="artboard-wrap"><div class="artboard-label">${label}</div><div class="artboard">${routeContent(route)}</div></section>`).join('')}</div></section>`;
    state.role=before;
    return out;
  }
  function renderFigmaModal(type,route,label){
    const beforeRole=state.role, beforeSheet=state.sheet, beforeForce=state.forceFigmaSheet;
    state.role='logistics';
    state.sheet=type;
    state.forceFigmaSheet=true;
    const html=`<section class="artboard-wrap"><div class="artboard-label">${label}</div><div class="artboard auto-height">${routeContent(route)}</div></section>`;
    state.role=beforeRole;
    state.sheet=beforeSheet;
    state.forceFigmaSheet=beforeForce;
    return html;
  }

  function renderFigma() {
    const before=state.role;
    state.sheet=null;
    app.innerHTML=`<main class="figma-mode"><h1 class="figma-title">TMS × ALTDEKOR — мобильная CRM / АСУБ</h1><p class="figma-subtitle">Три ролевых профиля, mobile-first 390 px: руководитель, менеджер и логист. Экраны телефонии, профиля, управления ролями и торгового контура включены.</p>${renderFigmaRole('leader')}${renderFigmaRole('manager')}${renderFigmaRole('logistics')}<section class="figma-role-group"><h2>Компоненты торгового контура</h2><div class="figma-grid">${shopScreens.map(([route,label])=>`<section class="artboard-wrap"><div class="artboard-label">${label}</div><div class="artboard ${route.startsWith('form-')?'auto-height':''}">${routeContent(route)}</div></section>`).join('')}</div></section><section class="figma-role-group"><h2>Модальные окна редактирования</h2><div class="figma-grid">${renderFigmaModal('warehouse-edit','shop-warehouses','Изменить склад')}${renderFigmaModal('collection-edit','shop-collections','Изменить коллекцию')}${renderFigmaModal('product-edit','shop-products','Изменить товар')}${renderFigmaModal('stock-edit','shop-stock','Изменить остаток')}${renderFigmaModal('contractor-edit','shop-contractors','Изменить контрагента')}</div></section></main>`;
    state.role=before;
  }
  function render() {
    if (isFigma) return renderFigma();
    app.innerHTML=`<div class="app-stage">${routeContent(state.route)}</div>`;
    bind();
  }

  function bind() {
    document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.employee) state.selectedEmployee=el.dataset.employee;go(el.dataset.go);}));
    document.querySelectorAll('[data-sheet]').forEach(el=>el.addEventListener('click',()=>{if(el.dataset.contractorId) state.selectedContractor=el.dataset.contractorId;showSheet(el.dataset.sheet);}));
    document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeSheet));
    const backdrop=document.querySelector('[data-backdrop]');
    if(backdrop) backdrop.addEventListener('click',e=>{if(e.target===backdrop) closeSheet();});
    document.querySelectorAll('[data-role]').forEach(el=>el.addEventListener('click',()=>switchRole(el.dataset.role)));
    document.querySelectorAll('[data-report-sort]').forEach(el=>el.addEventListener('click',()=>{state.reportSort=el.dataset.reportSort;render();}));
    document.querySelectorAll('[data-report-period]').forEach(el=>el.addEventListener('click',()=>{state.reportPeriod=el.dataset.reportPeriod;render();}));
    document.querySelectorAll('[data-client-plan-period]').forEach(el=>el.addEventListener('click',()=>{state.clientPlanPeriod=el.dataset.clientPlanPeriod;render();}));
    document.querySelectorAll('[data-client-sort]').forEach(el=>el.addEventListener('click',()=>{state.clientSort=el.dataset.clientSort;render();}));
    document.querySelectorAll('[data-notification-filter]').forEach(el=>el.addEventListener('click',()=>{state.notificationFilter=el.dataset.notificationFilter;render();}));
    document.querySelectorAll('[data-task-filter]').forEach(el=>el.addEventListener('click',()=>{state.taskFilter=el.dataset.taskFilter;render();}));
    document.querySelectorAll('[data-calendar-date]').forEach(el=>el.addEventListener('click',()=>{const n=Number(el.dataset.calendarDate);if(n>0&&n<=31){state.calendarDate=n;render();}}));
    document.querySelectorAll('[data-rate]').forEach(el=>el.addEventListener('click',()=>{const key=el.closest('[data-rating]').dataset.rating;state.ratings[key]=Number(el.dataset.rate);render();}));
    document.querySelectorAll('[data-order-status]').forEach(el=>el.addEventListener('click',()=>{state.orderStatus=el.dataset.orderStatus;state.expandedOrder='';render();}));
    document.querySelectorAll('[data-order-toggle]').forEach(el=>el.addEventListener('click',()=>{state.expandedOrder=state.expandedOrder===el.dataset.orderToggle?'':el.dataset.orderToggle;render();}));
    document.querySelectorAll('[data-analytics-metric]').forEach(el=>el.addEventListener('click',()=>{state.analyticsMetric=el.dataset.analyticsMetric;render();}));
    document.querySelectorAll('[data-shop-period]').forEach(el=>el.addEventListener('click',()=>{state.shopPeriod=el.dataset.shopPeriod;render();}));
    document.querySelectorAll('[data-dial-digit]').forEach(el=>el.addEventListener('click',()=>{state.dialNumber=(state.dialNumber==='Введите номер'?'':state.dialNumber)+el.dataset.dialDigit;render();}));
    document.querySelectorAll('[data-dial-delete]').forEach(el=>el.addEventListener('click',()=>{state.dialNumber=state.dialNumber.slice(0,-1);render();}));
    document.querySelectorAll('[data-number]').forEach(el=>el.addEventListener('click',()=>{state.dialNumber=el.dataset.number;state.callContact=callContactForNumber(state.dialNumber);render();}));
    document.querySelectorAll('[data-call-goal]').forEach(el=>el.addEventListener('click',()=>{state.callGoal=el.dataset.callGoal;render();}));
    document.querySelectorAll('[data-contractor-action]').forEach(el=>el.addEventListener('click',()=>{
      const contractor=CONTRACTORS[el.dataset.contractorId];
      if(!contractor) return;
      state.selectedContractor=el.dataset.contractorId;
      if(el.dataset.contractorAction==='call'){
        state.dialNumber=contractor.phone;
        state.callContact={name:contractor.shortName,phone:contractor.phone,initials:contractor.initials};
        state.callSource='shop-contractors';
        go('call-dialer');
      } else if(el.dataset.contractorAction==='edit') {
        showSheet('contractor-edit');
      } else if(el.dataset.contractorAction==='confirm') {
        showSheet('contractor-confirm');
      }
    }));
    document.querySelectorAll('[data-call-toggle]').forEach(el=>el.addEventListener('click',()=>{const k=el.dataset.callToggle;if(k==='mute') state.callMuted=!state.callMuted;if(k==='speaker') state.callSpeaker=!state.callSpeaker;render();}));
    requestAnimationFrame(()=>{const activeTab=document.querySelector('.workspace-tabs button.active');if(activeTab) activeTab.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});});
    document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{
      const a=el.dataset.action;
      if(a==='audit-save') toast('Черновик сохранён на устройстве');
      else if(a==='audit-finish') toast('Добавьте все 6 фотографий и оценки');
      else if(a==='draft-confirm') toast('Задачи созданы после подтверждения');
      else if(a==='draft-cancel') toast('Черновик открыт для редактирования');
      else if(a==='sheet-save'){closeSheet();setTimeout(()=>toast('Данные сохранены'),20);}
      else if(a==='contractor-confirm'){
        state.contractorStatuses[state.selectedContractor]='Подтверждён';
        closeSheet();
        setTimeout(()=>toast('Контрагент подтверждён'),20);
      }
      else if(a==='form-save') toast('Форма готова к подключению к API');
      else if(a==='task-done') toast('Задача завершена');
      else if(a==='task-control') toast('Задача отмечена проверенной');
      else if(a==='task-reschedule') toast('Открыта смена срока');
      else if(a==='call-start'){state.callContact=callContactForNumber(state.dialNumber);go('call-active');}
      else if(a==='call-end') go('call-ended',{sheet:'call-summary'});
      else if(a==='call-save'){toast('Результат звонка сохранён');setTimeout(()=>go(callBackRoute()),700);}
      else if(a==='call-summary-save'){closeSheet();toast('Итоги звонка сохранены');}
      else if(a==='profile-save') toast('Личные данные обновлены');
      else if(a==='employee-save') toast('Роль и доступ сотрудника обновлены');
    }));
  }
  window.addEventListener('hashchange',()=>{state.route=roleGuard(location.hash.replace('#','')||'home');render();});
  render();
})();
