import './styles.css'

const deckMarkup = String.raw`<section class="frame hero" data-screen="01">
  <div class="hero-copy">
    <div class="eyebrow">АГЕНТСКАЯ ПРОГРАММА TMS</div>
    <h1>Знаете бизнес, который уже не помещается в голове владельца?</h1>
    <p class="hero-support">Помогите предпринимателю перейти от ручного управления к системе — и получайте долю платежей клиента 3 года.</p>
    <div class="hero-finance">3 года · 20% → 15% → 10%</div>
  </div>
  <div class="hero-field" aria-hidden="true">
    <svg class="hero-lines" viewBox="0 0 730 1080" preserveAspectRatio="none">
      <path d="M110 205 H255 V270"/><path class="accent" d="M420 305 H555 V370"/>
      <path d="M150 505 H290"/><path d="M430 575 H590"/>
      <path d="M100 785 H255 V745"/><path class="accent" d="M445 855 H600"/>
    </svg>
    <div class="entity e-client"><i></i>Клиент</div>
    <div class="entity e-comms accent"><i></i>Коммуникация</div>
    <div class="entity e-task"><i></i>Задача</div>
    <div class="entity e-owner"><i></i>Ответственный</div>
    <div class="entity e-doc"><i></i>Документ</div>
    <div class="entity e-pay accent"><i></i>Оплата</div>
  </div>
</section>
<section class="frame growth" data-screen="02">
  <div class="growth-head">
    <div><div class="eyebrow">РОСТ БИЗНЕСА</div><h2>Бизнес вырос. Способ управления остался прежним.</h2></div>
    <p>Клиентов, людей и процессов становится больше. А компания всё ещё держится на памяти владельца, таблицах, чатах и ручных договорённостях.</p>
  </div>
  <div class="growth-visual">
    <div class="growth-axis"></div>
    <div class="growth-stage gs1"><strong>5</strong><span>человек</span><div class="stack s1"></div></div>
    <div class="growth-stage gs2"><strong>15</strong><span>человек</span><div class="stack s2"></div></div>
    <div class="growth-stage gs3"><strong>40</strong><span>человек</span><div class="stack s3"></div></div>
    <div class="growth-stage gs4"><strong>80</strong><span>человек</span><div class="stack s4"></div></div>
    <div class="growth-label gl1">Клиенты</div><div class="growth-label gl2">Люди</div><div class="growth-label gl3">Процессы</div>
    <div class="manual-strip"><span>голова владельца</span><span>чаты</span><span>Excel</span><span>1С</span><b>тот же способ управления</b></div>
  </div>
</section>
<section class="frame chaos" data-screen="03">
  <div class="chaos-head">
    <div class="eyebrow eyebrow-light">РУЧНОЕ УПРАВЛЕНИЕ ПЕРЕСТАЁТ СПРАВЛЯТЬСЯ</div>
    <h2>Если это звучит знакомо — бизнес начинает перерастать ручное управление.</h2>
    <p>Не диагноз. Сигналы того, что привычный способ управления перестаёт выдерживать сложность компании.</p>
  </div>
  <div class="chaos-field">
    <svg class="chaos-lines" viewBox="0 0 1640 620" preserveAspectRatio="none">
      <path d="M98 132 H255 V188"/><path class="accent" d="M1225 110 H1375 V175"/>
      <path d="M590 300 H790 V250"/><path class="accent" d="M235 490 H390"/>
      <path d="M1240 472 H1395 V420"/><path d="M910 535 H1045"/>
    </svg>
    <div class="cq large cq1">«Что там с клиентом?»</div>
    <div class="cq medium cq2">«Спроси у Олега»</div>
    <div class="cq large cq3">«Я думал, он уже сделал»</div>
    <div class="cq medium cq4">«Где последняя версия?»</div>
    <div class="cq medium cq5">«Я забыл перезвонить»</div>
    <div class="cf cf1"><i></i>Клиент</div><div class="cf cf2 accent"><i></i>Коммуникация</div>
    <div class="cf cf3"><i></i>Задача</div><div class="cf cf4"><i></i>Ответственный</div>
    <div class="cf cf5"><i></i>Документ</div><div class="cf cf6"><i></i>Оплата</div>
    <div class="cf op op1">15 чатов</div><div class="cf op op2">Excel + 1С</div>
    <div class="cf op op3">задачи на словах</div><div class="cf op op4">договорённости в личке</div>
  </div>
</section>
<section class="frame fragmented" data-screen="04">
  <div class="fragmented-copy">
    <div class="eyebrow">РАЗРОЗНЕННЫЙ БИЗНЕС</div>
    <h2>Проблема не в том, что сервисов мало. Они не работают как одна система.</h2>
    <p>CRM знает одно. 1С — другое. Чаты хранят договорённости. А общую картину по-прежнему собирает человек.</p>
  </div>
  <div class="islands">
    <svg viewBox="0 0 980 700" preserveAspectRatio="none"><path d="M455 330 L220 175"/><path d="M470 345 L730 160"/><path d="M460 370 L250 525"/><path d="M490 375 L760 535"/></svg>
    <div class="island ia"><span>Клиент</span><span>Коммуникация</span></div>
    <div class="island ib"><span>Задача</span><span>Ответственный</span></div>
    <div class="island ic"><span>Документ</span></div>
    <div class="island id"><span>Оплата</span></div>
    <div class="manual-owner"><b>Владелец</b><small>собирает контекст вручную</small></div>
  </div>
</section>
<section class="frame reveal" data-screen="05">
  <div class="reveal-head">
    <div><div class="eyebrow">TMS</div><h2>Один бизнес. Одна система.</h2></div>
    <div class="reveal-copy"><p>TMS связывает весь рабочий контур бизнеса. Все части работают в общем контексте.</p><strong>TMS — операционная система для малого бизнеса.</strong></div>
  </div>
  <div class="system-field">
    <div class="zone-label zl1">CLIENT CONTEXT</div><div class="zone-label zl2">EXECUTION CONTEXT</div><div class="zone-label zl3">BUSINESS CONTEXT</div>
    <div class="zone-divider zd1"></div><div class="zone-divider zd2"></div>
    <div class="ai-context"><i></i>AI понимает общий контекст</div>
    <svg class="system-links" viewBox="0 0 1600 600" preserveAspectRatio="none">
      <path d="M240 230 L430 175"/><path class="accent" d="M240 230 L455 390"/>
      <path class="cross" d="M455 390 L690 205"/><path d="M690 205 L760 390"/>
      <path d="M760 390 L1000 390"/><path class="cross" d="M1000 390 L1190 330"/>
      <path d="M1190 330 L1390 315"/><path class="cross" d="M1390 315 L1270 455"/>
      <path class="aihint" d="M760 62 v38"/><path class="aihint" d="M820 62 v38"/><path class="aihint" d="M880 62 v38"/>
    </svg>
    <div class="sn n-client"><i></i>Клиент</div><div class="sn n-comms"><i></i>Коммуникация</div><div class="sn n-deal accent"><i></i>Сделка</div>
    <div class="sn n-meeting"><i></i>Встреча</div><div class="sn n-task"><i></i>Задача</div><div class="sn n-resp"><i></i>Ответственный</div>
    <div class="sn n-doc accent"><i></i>Документ</div><div class="sn n-payment"><i></i>Оплата</div><div class="sn n-analytics accent"><i></i>Аналитика / результат</div>
  </div>
</section>
<section class="frame calm" data-screen="06">
  <div class="calm-center">
    <div class="eyebrow">РЕЗУЛЬТАТ ДЛЯ СОБСТВЕННИКА</div>
    <h2>Бизнес под контролем.<br/>Без постоянного контроля.</h2>
    <p>Компания перестаёт держаться на одном человеке — процессы понятны команде и видимы владельцу.</p>
  </div>
  <div class="calm-journey"><span>«Я всё контролирую сам»</span><b>→</b><span>«Команда работает как система»</span><b>→</b><strong>«Я управляю бизнесом,<br/>а не бизнес управляет мной»</strong></div>
</section>
<section class="frame agent" data-screen="07">
  <div class="agent-head"><div class="eyebrow">РОЛЬ АГЕНТА</div><h2>Вы замечаете момент, когда ручное управление начинает мешать бизнесу расти.</h2><p>Помогаете собственнику увидеть проблему, понять её цену и всерьёз захотеть перейти к системе.</p></div>
  <div class="agent-journey">
    <div class="journey-line"></div>
    <div class="js j1"><i></i><span>увидел проблему</span></div><div class="js j2"><i></i><span>поговорил с собственником</span></div>
    <div class="js j3"><i></i><span>помог увидеть цену</span></div><div class="js j4"><i></i><span>объяснил идею одной системы</span></div>
    <div class="js j5"><i></i><span>сформировал серьёзный интерес</span></div><div class="js j6 accent"><i></i><span>встреча с TMS</span></div>
    <div class="client-state">«Проблема понятна. Она мешает бизнесу. Хочу обсудить решение».</div>
  </div>
  <div class="anti-example">«Вот телефон знакомого» <b>≠</b> качественно приведённый клиент</div>
</section>
<section class="frame handoff" data-screen="08">
  <div class="handoff-head"><div class="eyebrow">ГРАНИЦА ОТВЕТСТВЕННОСТИ</div><h2>Вам не нужно внедрять TMS. Нужно правильно начать разговор.</h2><p>Вы создаёте понимание и интерес. Всё, что требует продуктовой и технической экспертизы, берёт на себя TMS.</p></div>
  <div class="relay">
    <div class="relay-side agent-side"><label>АГЕНТ</label><div class="relay-steps"><span>найти</span><b>→</b><span>поговорить</span><b>→</b><span>заинтересовать</span><b>→</b><span>познакомить</span></div></div>
    <div class="relay-handoff"><i></i><strong>Встреча</strong><small>точка передачи</small></div>
    <div class="relay-side tms-side"><label>TMS</label><div class="relay-steps"><span>диагностика</span><b>→</b><span>решение</span><b>→</b><span>демо</span><b>→</b><span>расчёт</span><b>→</b><span>договор</span><b>→</b><span>внедрение</span><b>→</b><span>сопровождение</span></div></div>
  </div>
</section>
<section class="frame timeline" data-screen="09">
  <div class="timeline-head"><div><div class="eyebrow eyebrow-light">ВОЗНАГРАЖДЕНИЕ</div><h2>Привели сильного клиента — получаете долю его платежей 3 года.</h2></div><p>Отсчёт начинается с первого оплачиваемого периода клиента.</p></div>
  <div class="years">
    <div class="year y1"><small>1-Й ГОД</small><strong>20%</strong><span>месяцы 1–12</span></div>
    <div class="year y2"><small>2-Й ГОД</small><strong>15%</strong><span>месяцы 13–24</span></div>
    <div class="year y3"><small>3-Й ГОД</small><strong>10%</strong><span>месяцы 25–36</span></div>
    <div class="months-line"><i class="m0"></i><i class="m12"></i><i class="m24"></i><i class="m36"></i></div>
  </div>
</section>
<section class="frame finance" data-screen="10">
  <div class="finance-head"><div><div class="eyebrow">ПРИМЕР ЭКОНОМИКИ</div><h2>Один хороший клиент уже даёт ощутимый результат.</h2></div><div class="disclaimer"><strong>Пример расчёта. Не тариф TMS.</strong><span>При сохранении указанного размера платежей клиента.</span></div></div>
  <div class="finance-input"><span>Платёж клиента</span><strong>100 000 ₽ / мес.</strong></div>
  <div class="formula-row"><div class="term"><strong>240 000 ₽</strong><span>1-й год</span></div><div class="operator">+</div><div class="term"><strong>180 000 ₽</strong><span>2-й год</span></div><div class="operator">+</div><div class="term"><strong>120 000 ₽</strong><span>3-й год</span></div></div>
  <div class="formula-result"><span class="equals">=</span><strong>540 000 ₽</strong><span class="result-period">за 3 года</span></div>
  <div class="portfolio-row"><div><span>1 клиент</span><b>→</b><strong>540 000 ₽</strong></div><div><span>3 клиента</span><b>→</b><strong>1 620 000 ₽</strong></div></div>
</section>
<section class="frame moscow" data-screen="11">
  <div class="region-copy"><div class="eyebrow">МОСКВА</div><h2>В Москве важен не список контактов. Важен доступ к подходящим собственникам.</h2><p>Один качественный разговор с владельцем растущей компании ценнее десятков формальных знакомств.</p></div>
  <div class="wide-field">
    <div class="biz bz1">Производство</div><div class="biz bz2">Дистрибуция</div><div class="biz bz3">Сервисный бизнес</div><div class="biz bz4">B2B-услуги</div><div class="biz bz5">Оптовая компания</div><div class="biz bz6">Проектный бизнес</div>
    <div class="owner-target"><span>Подходящий собственник</span><strong>Компания уже выросла<br/>из ручного управления</strong><div class="mini-contour"><i>клиенты</i><i>процессы</i><i>команда</i></div></div>
    <svg viewBox="0 0 880 820" preserveAspectRatio="none"><path d="M135 150 L430 350"/><path d="M195 355 L430 350"/><path d="M215 610 L430 350"/><path class="accent" d="M430 350 L680 480"/></svg>
  </div>
</section>
<section class="frame tver" data-screen="12">
  <div class="local-field">
    <div class="local-title">КОМПАНИИ, КОТОРЫЕ ВЫ ДЕЙСТВИТЕЛЬНО ЗНАЕТЕ</div>
    <div class="local-company lc1">Производство</div><div class="local-company lc2">Оптовая компания</div><div class="local-company lc3 selected">Сервисный бизнес <small>подходящий момент</small></div><div class="local-company lc4">B2B-услуги</div><div class="local-company lc5">Проектная компания</div>
    <div class="local-tms"><i></i><strong>TMS</strong><span>переход к системе</span></div>
    <svg viewBox="0 0 780 760" preserveAspectRatio="none"><path class="accent" d="M410 360 H620"/></svg>
  </div>
  <div class="tver-copy"><div class="eyebrow">ТВЕРЬ</div><h2>Не нужен широкий охват. Нужны несколько компаний, которые вы действительно хорошо знаете.</h2><p>Если вы понимаете, где в их бизнесе ручное управление уже стало ограничением, этого достаточно для правильного первого разговора.</p></div>
</section>
<section class="frame payout" data-screen="13">
  <div class="payout-head"><div class="eyebrow">КЛИЕНТ И ВЫПЛАТЫ</div><h2>Клиент принят TMS — дальше всё прозрачно.</h2><p>Вы подготовили клиента к серьёзному разговору. TMS подтвердил его — клиент закрепляется за вами и начинается работа.</p></div>
  <div class="payout-flow"><div class="p-line"></div>
    <div class="ps p1"><i></i><span>подготовили<br/>клиента</span></div><div class="ps p2"><i></i><span>TMS<br/>подтвердил</span></div><div class="ps p3"><i></i><span>клиент<br/>закреплён</span></div><div class="ps p4"><i></i><span>клиент<br/>платит</span></div><div class="ps p5"><i></i><span>комиссия<br/>начисляется</span></div><div class="ps p6 accent"><i></i><span>выплата<br/><strong>раз в квартал</strong></span></div>
  </div>
  <div class="payout-note">Пока сделка активно ведётся, закрепление сохраняется.</div>
</section>
<section class="frame final" data-screen="14">
  <div class="final-kicker">Помогаете бизнесу перейти от хаоса к системе. Получаете долю результата.</div>
  <div class="win-bridge">
    <div class="win w1"><span>Предприниматель</span><p>Бизнес меньше зависит<br/>от ручного контроля</p></div>
    <div class="win w2"><span>Агент</span><p>Получает долю результата,<br/>который помог создать</p></div>
    <div class="win w3"><span>TMS</span><p>Получает клиента,<br/>которому нужна система</p></div>
    <svg viewBox="0 0 1420 240" preserveAspectRatio="none"><path d="M110 20 C260 120 500 150 710 205"/><path d="M710 20 V205"/><path d="M1310 20 C1160 120 920 150 710 205"/></svg><i class="junction"></i>
  </div>
  <div class="final-brand"><h2>Один бизнес.<br/>Одна система.</h2><p>TMS · операционная система для малого бизнеса</p></div>
  <div class="final-contact"><span>Есть бизнес, который уже вырос из ручного управления?</span><strong>Обсудим его с TMS.</strong></div>
</section>`

export default function App() {
  const screen = new URLSearchParams(window.location.search).get('screen')
  return <main className={`deck ${screen ? 'single-screen' : ''}`} dangerouslySetInnerHTML={{ __html: deckMarkup }} />
}
