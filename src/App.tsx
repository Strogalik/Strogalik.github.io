import './styles.css'

const logo = '<img class="brand-mark" src="/TMS.svg" alt="" aria-hidden="true">'
const heroLogo = '<img class="brand-mark brand-mark-hero" src="/TMS.svg" alt="" aria-hidden="true">'

const deckMarkup = String.raw`
<section class="frame hero" data-screen="01">
  ${heroLogo}
  <div class="safe hero-grid">
    <div class="hero-copy">
      <div class="eyebrow">АГЕНТСКАЯ ПРОГРАММА TMS</div>
      <h1>Знаете бизнес,<br>который уже не<br>помещается в<br>голове владельца?</h1>
      <p class="support hero-support">Помогите предпринимателю перейти от ручного<br>управления к системе — и получайте долю<br>платежей клиента 3 года.</p>
      <div class="hero-finance">3 года · 20% → 15% → 10%</div>
    </div>
    <div class="hero-system">
      <div class="fragment fragment-a"><strong>Клиент</strong><span>Коммуникация</span></div>
      <div class="fragment fragment-b"><strong>Задача</strong><span>Ответственный</span></div>
      <div class="fragment fragment-c"><strong>Документ</strong></div>
      <div class="fragment fragment-d accent-fragment"><strong>Оплата</strong></div>
    </div>
  </div>
</section>

<section class="frame growth" data-screen="02">
  ${logo}
  <div class="safe">
    <div class="split-head">
      <div>
        <div class="eyebrow">РОСТ БИЗНЕСА</div>
        <h2>Бизнес вырос. Способ<br>управления остался<br>прежним.</h2>
      </div>
      <p class="support">Клиентов, людей и процессов становится<br>больше. А компания всё ещё держится на<br>памяти владельца, таблицах, чатах и<br>ручных договорённостях.</p>
    </div>
    <div class="growth-stages">
      <div class="growth-card g1"><div class="metric">5</div><div class="micro">человек</div><div class="growth-bars"><i></i><i></i></div></div>
      <div class="growth-card g2"><div class="metric">15</div><div class="micro">человек</div><div class="growth-bars"><i></i><i></i><i></i></div></div>
      <div class="growth-card g3"><div class="metric">40</div><div class="micro">человек</div><div class="growth-bars"><i></i><i></i><i></i><i></i></div></div>
      <div class="growth-card g4"><div class="metric">80</div><div class="micro">человек</div><div class="growth-bars"><i></i><i></i><i></i><i></i><i></i></div></div>
    </div>
    <div class="growth-categories"><span>Клиенты</span><span>Люди</span><span>Процессы</span></div>
    <div class="manual-constant"><div class="manual-items"><span>голова владельца</span><span>чаты</span><span>Excel</span><span>1С</span></div><strong>тот же способ управления</strong></div>
  </div>
</section>

<section class="frame chaos" data-screen="03">
  ${logo}
  <div class="safe">
    <div class="chaos-head">
      <div>
        <div class="eyebrow eyebrow-light">РУЧНОЕ УПРАВЛЕНИЕ ПЕРЕСТАЁТ СПРАВЛЯТЬСЯ</div>
        <h2>Если это звучит знакомо —<br>бизнес начинает перерастать<br>ручное управление.</h2>
      </div>
      <p class="support support-light">Не диагноз. Сигналы того, что<br>привычный способ управления<br>перестаёт выдерживать сложность<br>компании.</p>
    </div>
    <div class="chaos-steps">
      <div class="chaos-band cb1"><strong>«Спроси у Олега»</strong><div><span>Excel + 1С</span><span>Коммуникация</span></div></div>
      <div class="chaos-band cb2"><strong>«Что там с клиентом?»</strong><div><span>Клиент</span><span>Задача</span></div></div>
      <div class="chaos-band cb3"><strong>«Я думал, он уже сделал»</strong><div><span>Ответственный</span></div></div>
      <div class="chaos-band cb4"><strong>«Где последняя версия?»</strong><div><span>Оплата</span><span>задачи на словах</span></div></div>
      <div class="chaos-band cb5"><strong>«Я забыл перезвонить»</strong><div><span>Документ</span><span>15 чатов</span><span>договорённости в личке</span></div></div>
    </div>
  </div>
</section>

<section class="frame fragmented" data-screen="04">
  ${logo}
  <div class="safe fragmented-layout">
    <div class="fragmented-copy">
      <div class="eyebrow">РАЗРОЗНЕННЫЙ БИЗНЕС</div>
      <h2>Проблема не в том,<br>что сервисов мало.<br>Они не работают как<br>одна система.</h2>
      <p class="support">CRM знает одно. 1С — другое. Чаты хранят<br>договорённости. А общую картину по-<br>прежнему собирает человек.</p>
    </div>
    <div class="fragmented-workspace">
      <div class="f-window fw1"><strong>Клиент</strong><span>Коммуникация</span></div>
      <div class="f-window fw2"><strong>Задача</strong><span>Ответственный</span></div>
      <div class="f-window fw3"><strong>Документ</strong></div>
      <div class="f-window fw4"><strong>Оплата</strong></div>
      <div class="owner-summary"><strong>Владелец</strong><span>собирает контекст</span><span>вручную</span></div>
    </div>
  </div>
</section>

<section class="frame reveal" data-screen="05">
  ${logo}
  <div class="safe">
    <div class="reveal-head">
      <div><div class="eyebrow">TMS</div><h2>Один бизнес. Одна<br>система.</h2></div>
      <div class="reveal-copy"><p class="support">TMS связывает весь рабочий контур бизнеса.<br>Все части работают в общем контексте.</p><strong>TMS — операционная система для малого бизнеса.</strong></div>
    </div>
    <div class="system-window">
      <div class="system-topbar"><div class="traffic" aria-hidden="true"><i></i><i></i><i></i></div><div class="ai-label">AI понимает общий контекст</div></div>
      <div class="system-body">
        <section class="system-area client-area"><div class="area-label">CLIENT CONTEXT</div><div class="context-list primary-list"><div class="context-row main-row">Клиент</div><div class="context-row">Коммуникация</div><div class="context-row">Сделка</div></div></section>
        <section class="system-area execution-area"><div class="area-label">EXECUTION CONTEXT</div><div class="context-list"><div class="context-row main-row">Встреча</div><div class="context-row">Задача</div><div class="context-row">Ответственный</div></div></section>
        <section class="system-area business-area"><div class="area-label">BUSINESS CONTEXT</div><div class="context-list"><div class="context-row main-row">Документ</div><div class="context-row">Оплата</div><div class="context-row analytics-row"><span>Аналитика / результат</span><div class="spark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div></div></section>
      </div>
    </div>
  </div>
</section>

<section class="frame owner-result" data-screen="06">
  ${logo}
  <div class="safe calm-layout">
    <div class="calm-head">
      <div class="eyebrow">РЕЗУЛЬТАТ ДЛЯ СОБСТВЕННИКА</div>
      <h2>Бизнес под контролем.<br>Без постоянного контроля.</h2>
      <p class="support">Компания перестаёт держаться на одном человеке —<br>процессы понятны команде и видимы владельцу.</p>
    </div>
    <div class="transformation-grid">
      <div class="transformation t1">«Я всё контролирую сам»</div><div class="simple-arrow">→</div>
      <div class="transformation t2">«Команда работает как<br>система»</div><div class="simple-arrow">→</div>
      <div class="transformation t3">«Я управляю<br>бизнесом,<br>а не бизнес управляет<br>мной»</div>
    </div>
  </div>
</section>

<section class="frame agent-role" data-screen="07">
  ${logo}
  <div class="safe">
    <div class="agent-copy"><div class="eyebrow">РОЛЬ АГЕНТА</div><h2>Вы замечаете момент, когда<br>ручное управление начинает<br>мешать бизнесу расти.</h2><p class="support">Помогаете собственнику увидеть проблему, понять<br>её цену и всерьёз захотеть перейти к системе.</p></div>
    <div class="agent-rail">
      <div class="rail-stage" data-step="01"><span>увидел проблему</span></div>
      <div class="rail-stage" data-step="02"><span>поговорил с<br>собственником</span></div>
      <div class="rail-stage" data-step="03"><span>помог увидеть цену</span></div>
      <div class="rail-stage" data-step="04"><span>объяснил идею одной<br>системы</span></div>
      <div class="rail-stage" data-step="05"><span>сформировал<br>серьёзный интерес</span></div>
      <div class="rail-stage rail-final" data-step="06"><span>встреча с TMS</span><blockquote>«Проблема понятна. Она мешает<br>бизнесу. Хочу обсудить<br>решение».</blockquote></div>
    </div>
    <div class="anti-band"><span>«Вот телефон знакомого»</span><b>≠</b><strong>качественно приведённый клиент</strong></div>
  </div>
</section>

<section class="frame responsibility" data-screen="08">
  ${logo}
  <div class="safe">
    <div class="split-head responsibility-head"><div><div class="eyebrow">ГРАНИЦА ОТВЕТСТВЕННОСТИ</div><h2>Вам не нужно внедрять<br>TMS. Нужно правильно<br>начать разговор.</h2></div><p class="support">Вы создаёте понимание и интерес. Всё,<br>что требует продуктовой и технической<br>экспертизы, берёт на себя TMS.</p></div>
    <div class="responsibility-grid">
      <div class="role-surface agent-surface"><div class="role-label">АГЕНТ</div><div class="role-list"><span>найти</span><span>поговорить</span><span>заинтересовать</span><span>познакомить</span></div></div>
      <div class="meeting-surface"><strong>Встреча</strong><span>точка передачи</span></div>
      <div class="role-surface tms-surface"><div class="role-label">TMS</div><div class="tms-role-grid"><span>диагностика</span><span>решение</span><span>демо</span><span>расчёт</span><span>договор</span><span>внедрение</span><span class="tms-last">сопровождение</span></div></div>
    </div>
  </div>
</section>

<section class="frame reward" data-screen="09">
  ${logo}
  <div class="safe">
    <div class="reward-head"><div><div class="eyebrow eyebrow-light">ВОЗНАГРАЖДЕНИЕ</div><h2>Привели сильного клиента —<br>получаете долю его платежей<br>3 года.</h2></div><p class="support support-light">Отсчёт начинается с первого<br>оплачиваемого периода клиента.</p></div>
    <div class="reward-cards">
      <div class="reward-card"><div class="year-label">1-Й ГОД</div><strong>20%</strong><span>месяцы 1–12</span></div>
      <div class="reward-card"><div class="year-label">2-Й ГОД</div><strong>15%</strong><span>месяцы 13–24</span></div>
      <div class="reward-card sapphire-card"><div class="year-label">3-Й ГОД</div><strong>10%</strong><span>месяцы 25–36</span></div>
    </div>
  </div>
</section>

<section class="frame economics" data-screen="10">
  ${logo}
  <div class="safe">
    <div class="economics-head"><div><div class="eyebrow">ПРИМЕР ЭКОНОМИКИ</div><h2>Один хороший клиент<br>уже даёт ощутимый<br>результат.</h2></div><div class="calc-note"><strong>Пример расчёта. Не тариф TMS.</strong><span>При сохранении указанного размера платежей клиента.</span></div></div>
    <div class="economics-main">
      <div class="payment-block"><span>Платёж клиента</span><strong>100 000 ₽ / мес.</strong></div>
      <div class="year-math">
        <div class="money-block"><strong>240 000 ₽</strong><span>1-й год</span></div><div class="math-sign">+</div>
        <div class="money-block"><strong>180 000 ₽</strong><span>2-й год</span></div><div class="math-sign">+</div>
        <div class="money-block"><strong>120 000 ₽</strong><span>3-й год</span></div>
      </div>
      <div class="result-math"><div class="equals">=</div><strong>540 000 ₽</strong><span>за 3 года</span></div>
    </div>
    <div class="economics-summary"><div><span>1 клиент →</span><strong>540 000 ₽</strong></div><div><span>3 клиента →</span><strong>1 620 000 ₽</strong></div></div>
  </div>
</section>

<section class="frame moscow" data-screen="11">
  ${logo}
  <div class="safe region-layout">
    <div class="region-copy"><div class="eyebrow">МОСКВА</div><h2>В Москве важен не<br>список контактов.<br>Важен доступ к<br>подходящим<br>собственникам.</h2><p class="support">Один качественный разговор с владельцем<br>растущей компании ценнее десятков<br>формальных знакомств.</p></div>
    <div class="business-board">
      <div class="business-six">
        <div class="business-window">Производство</div><div class="business-window">B2B-услуги</div>
        <div class="business-window">Дистрибуция</div><div class="business-window">Оптовая компания</div>
        <div class="business-window">Сервисный бизнес</div><div class="business-window">Проектный бизнес</div>
      </div>
      <div class="selected-owner"><span>Подходящий собственник</span><strong>Компания уже<br>выросла<br>из ручного<br>управления</strong><div class="owner-facts"><i>клиенты</i><i>процессы</i><i>команда</i></div></div>
    </div>
  </div>
</section>

<section class="frame tver" data-screen="12">
  ${logo}
  <div class="safe tver-layout">
    <div class="known-companies"><div class="known-title">КОМПАНИИ, КОТОРЫЕ ВЫ ДЕЙСТВИТЕЛЬНО ЗНАЕТЕ</div>
      <div class="known-grid">
        <div class="known-window">Производство</div><div class="known-window">Оптовая компания</div>
        <div class="known-window selected-known"><strong>Сервисный бизнес</strong><span>подходящий момент</span></div><div class="known-window">B2B-услуги</div>
        <div class="known-window">Проектная компания</div><div class="tms-transition"><strong>TMS</strong><span>переход к системе</span></div>
      </div>
    </div>
    <div class="tver-copy"><div class="eyebrow">ТВЕРЬ</div><h2>Не нужен широкий<br>охват. Нужны<br>несколько компаний,<br>которые вы<br>действительно<br>хорошо знаете.</h2><p class="support">Если вы понимаете, где в их бизнесе ручное<br>управление уже стало ограничением, этого<br>достаточно для правильного первого<br>разговора.</p></div>
  </div>
</section>

<section class="frame payout" data-screen="13">
  ${logo}
  <div class="safe">
    <div class="payout-head"><div class="eyebrow">КЛИЕНТ И ВЫПЛАТЫ</div><h2>Клиент принят TMS — дальше<br>всё прозрачно.</h2><p class="support">Вы подготовили клиента к серьёзному разговору. TMS<br>подтвердил его — клиент закрепляется за вами и<br>начинается работа.</p></div>
    <div class="operation-window">
      <div class="operation-stage" data-step="01"><span>подготовили<br>клиента</span></div>
      <div class="operation-stage" data-step="02"><span>TMS<br>подтвердил</span></div>
      <div class="operation-stage" data-step="03"><span>клиент<br>закреплён</span></div>
      <div class="operation-stage" data-step="04"><span>клиент<br>платит</span></div>
      <div class="operation-stage" data-step="05"><span>комиссия<br>начисляется</span></div>
      <div class="operation-stage payout-stage" data-step="06"><span>выплата</span><strong>раз в квартал</strong></div>
    </div>
    <div class="payout-note">Пока сделка активно ведётся, закрепление сохраняется.</div>
  </div>
</section>

<section class="frame finale" data-screen="14">
  <div class="safe finale-layout">
    <div class="final-kicker">Помогаете бизнесу перейти от хаоса к системе. Получаете<br>долю результата.</div>
    <div class="win-grid">
      <div><span>Предприниматель</span><p>Бизнес меньше зависит<br>от ручного контроля</p><i aria-hidden="true">↓</i></div>
      <div><span>Агент</span><p>Получает долю результата,<br>который помог создать</p><i aria-hidden="true">↓</i></div>
      <div><span>TMS</span><p>Получает клиента,<br>которому нужна система</p><i aria-hidden="true">↓</i></div>
    </div>
    <div class="brand-statement"><h2>Один бизнес.<br>Одна система.</h2><img class="final-logo" src="/TMS.svg" alt="" aria-hidden="true"><p>TMS · операционная система для малого бизнеса</p></div>
    <div class="presentation-cta"><span>Есть бизнес, который уже вырос из ручного управления?</span><strong>Обсудим его с TMS.</strong></div>
  </div>
</section>
`

export default function App() {
  return <main className="deck" dangerouslySetInnerHTML={{ __html: deckMarkup }} />
}

export { deckMarkup }
