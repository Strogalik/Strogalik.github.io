import { useEffect, useRef, useState } from 'react';
import type { TouchEvent } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ActionList, ActionListButton, ChoiceList, ChoiceRow, Overlay } from '../components/Overlay';
import logo from '../assets/tms-logo.svg';
import { productConfig } from '../app/config';

const nav = [
  { to:'/dashboard', label:'Обзор', icon:'dashboard' as const },
  { to:'/trips', label:'Рейсы', icon:'truck' as const },
  { to:'/fuel', label:'ГСМ', icon:'fuel' as const },
  { to:'/epd', label:'ЭПД', icon:'file' as const },
  { to:'/edo', label:'ЭДО', icon:'folder' as const },
  { to:'/reports', label:'Отчёты', icon:'chart' as const },
  { to:'/directories', label:'Справочники', icon:'book' as const },
];

const mobileNav = nav.filter(item => ['/dashboard','/trips','/epd','/edo','/reports'].includes(item.to));
const driverMobileNav = [
  { to:'/driver', label:'Сегодня', icon:'dashboard' as const },
  { to:'/driver/trips', label:'Рейсы', icon:'truck' as const },
  { to:'/driver/documents', label:'Документы', icon:'file' as const },
  { to:'/driver/fuel/new', label:'Заправка', icon:'fuel' as const },
];
const mechanicMobileNav = [
  { to:'/mechanic', label:'Контроль', icon:'wrench' as const },
  { to:'/mechanic/vehicles', label:'ТС', icon:'truck' as const },
  { to:'/mechanic/fuel', label:'ГСМ', icon:'fuel' as const },
  { to:'/workspace', label:'Режимы', icon:'users' as const },
];
const medicalMobileNav = [
  { to:'/medical', label:'Осмотры', icon:'pulse' as const },
  { to:'/medical/documents', label:'ЭПЛ', icon:'file' as const },
  { to:'/workspace', label:'Режимы', icon:'users' as const },
];
const adminMobileNav = [
  { to:'/admin', label:'Главная', icon:'settings' as const },
  { to:'/admin/users', label:'Люди', icon:'users' as const },
  { to:'/admin/roles', label:'Роли', icon:'shield' as const },
  { to:'/admin/audit', label:'Аудит', icon:'book' as const },
];

const historyMaxKey = 'tms-history-max-index';
type EdgeSwipe = { edge: 'left'|'right'; x: number; y: number; startedAt: number } | null;

function browserHasNativeIosHistorySwipe() {
  const ua = window.navigator.userAgent;
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const safari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches;
  return ios && safari && !standalone;
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const swipeRef = useRef<EdgeSwipe>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.localStorage.getItem('tms-sidebar-collapsed') === '1');
  const [historyIndex, setHistoryIndex] = useState(() => Number(window.history.state?.idx ?? 0));
  const [maxHistoryIndex, setMaxHistoryIndex] = useState(() => Math.max(Number(window.sessionStorage.getItem(historyMaxKey) ?? 0), Number(window.history.state?.idx ?? 0)));
  const [searchOpen, setSearchOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [organization, setOrganization] = useState<string>(productConfig.organizationLabel);

  useEffect(() => {
    window.localStorage.setItem('tms-sidebar-collapsed', sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  useEffect(() => {
    const idx = Number(window.history.state?.idx ?? 0);
    setHistoryIndex(idx);
    setMaxHistoryIndex(currentMax => {
      const nextMax = navigationType === 'PUSH' ? idx : Math.max(currentMax, idx);
      window.sessionStorage.setItem(historyMaxKey, String(nextMax));
      return nextMax;
    });
  }, [location.key, location.pathname, navigationType]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < maxHistoryIndex;
  const goBack = () => { if (canGoBack) navigate(-1); };
  const goForward = () => { if (canGoForward) navigate(1); };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1 || browserHasNativeIosHistorySwipe()) return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"], [data-no-history-swipe]')) return;
    const touch = event.touches[0];
    const edgeSize = 28;
    const edge = touch.clientX <= edgeSize ? 'left' : touch.clientX >= window.innerWidth - edgeSize ? 'right' : null;
    swipeRef.current = edge ? { edge, x: touch.clientX, y: touch.clientY, startedAt: performance.now() } : null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const elapsed = performance.now() - start.startedAt;
    const horizontalEnough = Math.abs(dx) >= 74 && Math.abs(dx) > Math.abs(dy) * 1.35;
    if (!horizontalEnough || elapsed > 750) return;
    if (start.edge === 'left' && dx > 0) goBack();
    if (start.edge === 'right' && dx < 0) goForward();
  };

  const isDriverMode = location.pathname.startsWith('/driver');
  const isMechanicMode = location.pathname.startsWith('/mechanic');
  const isMedicalMode = location.pathname.startsWith('/medical');
  const isAdminMode = location.pathname.startsWith('/admin');
  const roleMode = isDriverMode ? 'driver' : isMechanicMode ? 'mechanic' : isMedicalMode ? 'medical' : isAdminMode ? 'admin' : 'main';
  const roleMobileNav = roleMode === 'driver' ? driverMobileNav : roleMode === 'mechanic' ? mechanicMobileNav : roleMode === 'medical' ? medicalMobileNav : roleMode === 'admin' ? adminMobileNav : mobileNav;
  const current = [...nav, { to:'/driver', label:'Водителю', icon:'user' as const }, { to:'/notifications', label:'Уведомления', icon:'bell' as const }, { to:'/integrations', label:'Интеграции', icon:'link' as const }, { to:'/admin', label:'Администрирование', icon:'settings' as const }, { to:'/mechanic', label:'Механик', icon:'wrench' as const }, { to:'/medical', label:'Медосмотр', icon:'pulse' as const }, { to:'/workspace', label:'Режимы', icon:'users' as const }].find(item => location.pathname.startsWith(item.to.split('/').slice(0,2).join('/'))) ?? nav[0];

  const closeProfileAndGo = (path:string) => { setProfileOpen(false); navigate(path); };
  const searchItems = [
    { to:'/trips/trip-248', icon:'truck' as const, title:'Рейс TR-0248', meta:'Москва → Казань · в пути' },
    { to:'/epd/epl-2341', icon:'file' as const, title:'ЭПЛ №2341', meta:'TR-0248 · ожидает подписи' },
    { to:'/edo/edo-251', icon:'folder' as const, title:'УПД №251', meta:'ООО «ТрансЛогистика»' },
    { to:'/fuel/fuel-8841', icon:'fuel' as const, title:'Заправка ГСМ-8841', meta:'КАМАЗ · TR-0248' },
  ].filter(item => !searchQuery.trim() || `${item.title} ${item.meta}`.toLocaleLowerCase('ru').includes(searchQuery.trim().toLocaleLowerCase('ru')));

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''} is-role-${roleMode}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <aside className="sidebar">
        <button className="sidebar-collapse" type="button" aria-label={sidebarCollapsed ? 'Развернуть боковое меню' : 'Свернуть боковое меню'} aria-pressed={sidebarCollapsed} title={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'} onClick={() => setSidebarCollapsed(value => !value)}><Icon name="chevron"/></button>
        <div className="brand-block"><div className="brand-mark"><img src={logo} alt="TMS" /></div><div className="brand-copy"><strong>{productConfig.brand}</strong><span>{productConfig.productLabel}</span></div></div>
        <nav className="side-nav" aria-label="Основная навигация">{nav.map(item => <NavLink key={item.to} to={item.to} className={({isActive}) => `side-nav__item ${isActive ? 'is-active' : ''}`}><Icon name={item.icon} /><span>{item.label}</span></NavLink>)}</nav>
        <div className="sidebar__bottom"><NavLink to="/notifications" className="side-nav__item"><Icon name="bell"/><span>Уведомления</span><i className="nav-dot">3</i></NavLink><NavLink to="/integrations" className="side-nav__item"><Icon name="link"/><span>Интеграции</span></NavLink><NavLink to="/admin" className="side-nav__item"><Icon name="settings"/><span>Администрирование</span></NavLink><button type="button" className="profile-card profile-card--button" title="Профиль и рабочие режимы" onClick={()=>setProfileOpen(true)}><div className="profile-avatar">АК</div><div><strong>Александр Крылов</strong><span>Роли и система</span></div><Icon name="chevron"/></button></div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><img src={logo} alt="TMS"/><div><strong>{productConfig.brand}</strong><span>{productConfig.productLabel}</span></div></div>
          <div className="history-controls" aria-label="История навигации"><button className="history-control" type="button" onClick={goBack} disabled={!canGoBack} aria-label="Назад" title="Назад"><Icon name="back"/></button><button className="history-control" type="button" onClick={goForward} disabled={!canGoForward} aria-label="Вперёд" title="Вперёд"><Icon name="forward"/></button></div>
          <div className="topbar__title">{current.label}</div>
          <div className="topbar__actions"><button className="global-search" type="button" onClick={()=>setSearchOpen(true)}><Icon name="search"/><span>Поиск по рейсам и документам</span><kbd>⌘ K</kbd></button><button className="org-switch" type="button" onClick={()=>setOrgOpen(true)}><Icon name="building"/><span>{organization}</span><Icon name="chevron"/></button><NavLink to="/fuel" className={({isActive}) => `icon-btn mobile-quick-link ${isActive ? 'is-active' : ''}`} aria-label="ГСМ" title="ГСМ"><Icon name="fuel"/></NavLink><NavLink to="/directories" className={({isActive}) => `icon-btn mobile-quick-link ${isActive ? 'is-active' : ''}`} aria-label="Справочники" title="Справочники"><Icon name="book"/></NavLink><NavLink to="/notifications" className={({isActive}) => `icon-btn has-badge ${isActive ? 'is-active' : ''}`} aria-label="Уведомления" title="Уведомления"><Icon name="bell"/></NavLink><button type="button" className="top-avatar" aria-label="Профиль, рабочие режимы и администрирование" title="Профиль" onClick={()=>setProfileOpen(true)}>АК</button></div>
        </header>
        <main className="workspace"><Outlet /></main>
      </div>
      <nav className={`mobile-nav mobile-nav--${roleMode}`} aria-label={roleMode === 'main' ? 'Мобильная навигация' : `Навигация режима ${roleMode}`}>{roleMobileNav.map(item => <NavLink key={item.to} to={item.to} end={['/driver','/mechanic','/medical','/admin'].includes(item.to)} className={({isActive}) => `mobile-nav__item ${isActive ? 'is-active' : ''}`}><Icon name={item.icon}/><span>{item.label}</span></NavLink>)}</nav>

      <Overlay open={searchOpen} onClose={()=>setSearchOpen(false)} title="Поиск TMS" description="Рейсы, ЭПД, ЭДО и заправки в одном поиске." kicker="Быстрый переход" presentation="sheet">
        <label className="search-field search-field--overlay"><Icon name="search"/><input autoFocus value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Номер, контрагент, ТС…"/></label>
        <div className="quick-search-results">{searchItems.map(item=><button type="button" className="quick-search-result" key={item.to} onClick={()=>{setSearchOpen(false);navigate(item.to)}}><span><Icon name={item.icon}/></span><span><strong>{item.title}</strong><small>{item.meta}</small></span><Icon name="chevron"/></button>)}</div>
      </Overlay>

      <Overlay open={orgOpen} onClose={()=>setOrgOpen(false)} title="Организация и филиал" description="Переключение меняет рабочий контекст, но не ваши права." kicker="Контекст" size="sm">
        <ChoiceList>{['TMS ASUB · Основная организация','Филиал · Москва','Филиал · Казань'].map(item=><ChoiceRow key={item} label={item} description={item===organization?'Текущий контекст':'Доступно по вашей роли'} selected={item===organization} onClick={()=>{setOrganization(item);setOrgOpen(false)}}/>)}</ChoiceList>
      </Overlay>

      <Overlay open={profileOpen} onClose={()=>setProfileOpen(false)} title="Профиль и доступ" kicker="Александр Крылов" presentation="sheet">
        <div className="profile-sheet-head"><div className="profile-sheet-avatar">АК</div><div><strong>Александр Крылов</strong><span>Руководитель · Администратор · Основная организация</span></div></div>
        <ActionList>
          <ActionListButton icon="users" title="Рабочие режимы" description="Водитель, механик, медработник и системные роли" onClick={()=>closeProfileAndGo('/workspace')}/>
          <ActionListButton icon="settings" title="Администрирование" description="Пользователи, роли, аудит, сертификаты и правила" onClick={()=>closeProfileAndGo('/admin')}/>
          <ActionListButton icon="bell" title="Уведомления" description="Критические события и задачи, требующие внимания" onClick={()=>closeProfileAndGo('/notifications')}/>
          <ActionListButton icon="link" title="Интеграции" description="Saby, 1С/ERP и очередь обмена" onClick={()=>closeProfileAndGo('/integrations')}/>
        </ActionList>
      </Overlay>
    </div>
  );
}
