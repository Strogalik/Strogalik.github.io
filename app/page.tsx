import { ArrowDown, ArrowUpRight, Check, MoveUpRight } from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Brand } from "@/components/ui/Brand";
import {
  LeadButton,
  ServiceButton,
  ImageButton,
} from "@/components/ui/Experience";
import { SceneLayer } from "@/components/3d/SceneLayer";
import { Stage } from "@/components/3d/Stage";
import {
  AnimationControls,
  ValveControls,
  BoilerStatus,
} from "@/components/3d/Controls";
import { content } from "@/content/local";
export default function Home() {
  const services = content.services(),
    settings = content.settings();
  return (
    <>
      <Header />
      <main id="main">
        <SceneLayer />
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span>
              <i /> ИНЖЕНЕРНЫЕ РЕШЕНИЯ ДЛЯ ЖИЗНИ
            </span>
            <span>РУСГАЗ / ГАЗОСНАБЖЕНИЕ</span>
          </div>
          <div className="narrative-row hero-row">
            <div className="hero-copy protected">
              <h1 id="hero-title">
                Газификация дома.
                <br />
                <span>
                  От проекта
                  <br />
                  до тепла.
                </span>
              </h1>
              <p className="lead">
                Проектируем и строим газовые сети.
                <br className="desktop-only" /> Помогаем пройти весь путь
                подключения
                <br className="desktop-only" /> — спокойно, понятно, с одной
                командой.
              </p>
              <div className="hero-actions">
                <LeadButton />
                <a className="text-link" href="#process">
                  Как проходит подключение <ArrowDown size={17} />
                </a>
              </div>
              <div className="hero-proof">
                <span>
                  <Check size={16} /> Проектирование
                </span>
                <span>
                  <Check size={16} /> Строительство
                </span>
                <span>
                  <Check size={16} /> Сопровождение
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <Stage kind="hero" label="01 — Существующая газовая сеть" />
              <div className="hero-node-label">
                <span className="node-dot" />
                <span>
                  От большой сети
                  <br />
                  <strong>к вашему дому</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#process" className="scroll-prompt">
              <ArrowDown size={18} />
              <span>Следуйте за движением газа</span>
            </a>
            <AnimationControls />
          </div>
        </section>
        <section className="section container" id="process">
          <div className="narrative-row">
            <div className="protected">
              <span className="eyebrow">
                01 / ОТ ПЕРВОГО ВОПРОСА ДО ПОДКЛЮЧЕНИЯ
              </span>
              <h2>
                Сложная система.
                <br />
                <span className="muted-heading">Понятный путь.</span>
              </h2>
              <p className="section-intro">
                Газификация начинается не с трубы.
                <br />
                Она начинается с понимания вашего дома.
              </p>
              <ol className="process-list">
                {[
                  [
                    "Знакомимся с объектом",
                    "Обсуждаем задачу, исходные условия и возможность подключения.",
                  ],
                  [
                    "Готовим проект",
                    "Определяем решения и согласовываем состав работ.",
                  ],
                  [
                    "Строим и сопровождаем",
                    "Выполняем работы и помогаем с оформлением в согласованном объёме.",
                  ],
                ].map(([t, d], i) => (
                  <li key={t}>
                    <span className="step-number">0{i + 1}</span>
                    <div>
                      <h3>{t}</h3>
                      <p>{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <Stage label="02 — Каждое соединение имеет значение" />
          </div>
        </section>
        <section className="section container" id="services">
          <div className="edge-stage" data-route="edge" />
          <div className="section-heading protected">
            <div>
              <span className="eyebrow">02 / ГЛАВНОЕ НАПРАВЛЕНИЕ</span>
              <h2>
                Газ в доме.
                <br />
                <span className="muted-heading">Всё начинается здесь.</span>
              </h2>
            </div>
            <p>
              Комплексная газификация
              <br />
              или отдельный этап работ.
            </p>
          </div>
          <div className="services-layout protected">
            <article className="service-feature">
              <div>
                <span className="small service-index">01 / ГАЗИФИКАЦИЯ</span>
                <h3>
                  Один дом.
                  <br />
                  Одна команда.
                  <br />
                  Полный путь.
                </h3>
                <p>
                  От проектных решений до строительства газовых сетей и
                  сопровождения работ.
                </p>
              </div>
              <ServiceButton id="gazifikaciya" className="button button-light">
                Газификация жилых домов <ArrowUpRight size={19} />
              </ServiceButton>
            </article>
            <div className="service-secondary">
              {services.slice(1, 3).map((s, i) => (
                <article key={s.id}>
                  <span className="small muted">0{i + 2}</span>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                  <ServiceButton id={s.id}>
                    Подробнее <ArrowUpRight size={20} />
                  </ServiceButton>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section container" id="scope">
          <div className="narrative-row">
            <div className="protected">
              <span className="eyebrow">03 / ВНИМАНИЕ К ДЕТАЛЯМ</span>
              <h2>
                За каждым метром —<br />
                <span className="muted-heading">инженерное решение.</span>
              </h2>
              <p className="section-intro">
                Участок, трасса, соединения, оборудование. Рассматриваем систему
                целиком, чтобы отдельные работы складывались в один результат.
              </p>
              <ul className="scope-list">
                {[
                  "Проектирование инженерных сетей",
                  "Строительство и монтаж",
                  "Сопровождение оформления работ",
                ].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="small muted scope-note">
                Состав работ фиксируется для конкретного объекта.
              </p>
            </div>
            <Stage label="03 — Непрерывная трасса" />
          </div>
        </section>
        <section className="valve-section section container" id="valve">
          <div className="narrative-row">
            <div className="protected">
              <span className="eyebrow">04 / ВАШЕ ПРИКОСНОВЕНИЕ</span>
              <h2>
                Одно движение.
                <br />
                <span className="muted-heading">И путь продолжается.</span>
              </h2>
              <p className="section-intro">
                Откройте виртуальный вентиль и проследите, как газ движется
                дальше — к теплу вашего дома.
              </p>
              <ValveControls />
              <p className="engineering-note">
                Визуальная демонстрация. Не инструкция по эксплуатации газового
                оборудования.
              </p>
            </div>
            <Stage kind="valve" label="04 — Точка управления потоком" />
          </div>
        </section>
        <section className="section container" id="cost">
          <div className="edge-stage" data-route="edge" />
          <div className="section-heading protected">
            <div>
              <span className="eyebrow">05 / ПРОЗРАЧНЫЙ РАСЧЁТ</span>
              <h2>
                У каждого дома
                <br />
                свои исходные данные.
              </h2>
            </div>
            <p>
              Поэтому точная стоимость
              <br />
              начинается с разговора.
            </p>
          </div>
          <div className="cost-grid protected">
            {[
              [
                "01",
                "Условия участка",
                "Расположение дома, исходные данные и трасса подключения.",
              ],
              [
                "02",
                "Состав работ",
                "Проектирование, строительство и необходимое сопровождение.",
              ],
              [
                "03",
                "Оборудование",
                "Подобранные для объекта решения и объём монтажных работ.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
          <div className="cost-bottom protected">
            <p>Обсудим ваш объект и определим следующий шаг.</p>
            <LeadButton />
          </div>
        </section>
        <section className="section container" id="expertise">
          <div className="edge-stage" data-route="edge" />
          <div className="section-heading protected">
            <div>
              <span className="eyebrow">06 / РУСГАЗ В ДЕЛЕ</span>
              <h2>
                Работа, которую
                <br />
                <span className="muted-heading">видно в деталях.</span>
              </h2>
            </div>
            <p>
              Проектирование и строительство
              <br />
              инженерных сетей.
            </p>
          </div>
          <div className="expertise-layout protected">
            <div className="expertise-copy">
              <h3>
                Инженеры. Техника.
                <br />
                Практический опыт.
              </h3>
              <p>
                РусГаз занимается газификацией жилых домов и строительством
                инженерных сетей. В работе — инженерно-техническая команда и
                собственная строительная техника, включая установку
                наклонно-направленного бурения.
              </p>
              <a className="text-link" href="#contacts">
                Познакомимся с вашей задачей <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="photo-list">
              {[
                ["/assets/gas.webp", "Газоснабжение дома"],
                ["/assets/excavator.webp", "Земляные работы"],
                ["/assets/water.webp", "Инженерные коммуникации"],
              ].map(([src, t]) => (
                <figure key={src}>
                  <ImageButton src={src} caption={t} />
                  <figcaption>{t}</figcaption>
                </figure>
              ))}
              <p className="small muted photo-source">
                Иллюстрации направлений с действующего сайта РусГаз.
              </p>
            </div>
          </div>
        </section>
        <section className="section container" id="directions">
          <div className="edge-stage" data-route="edge" />
          <div className="section-heading protected">
            <div>
              <span className="eyebrow">07 / ИНЖЕНЕРНЫЕ СИСТЕМЫ</span>
              <h2>Больше, чем газ.</h2>
            </div>
            <p>
              Другие направления
              <br />
              для вашего объекта.
            </p>
          </div>
          <div className="directions-list protected">
            {services
              .filter((s) => s.category === "engineering")
              .map((s, i) => (
                <ServiceButton id={s.id} key={s.id} className="direction-row">
                  <span className="direction-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s.title}</span>
                  <ArrowUpRight size={23} />
                </ServiceButton>
              ))}
          </div>
        </section>
        <section className="section container" id="faq">
          <div className="edge-stage" data-route="edge" />
          <div className="faq-layout protected">
            <div>
              <span className="eyebrow">08 / ВОПРОСЫ И ОТВЕТЫ</span>
              <h2>
                Давайте
                <br />
                разберёмся.
              </h2>
              <p className="muted">
                Не нашли свой ответ?
                <br />
                <a href="tel:+79100697000" className="text-link">
                  Позвоните нам <MoveUpRight size={16} />
                </a>
              </p>
            </div>
            <div className="faq-list">
              {content.faqs().map((f) => (
                <details key={f.question}>
                  <summary>
                    {f.question}
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="section final-section container" id="contacts">
          <div className="narrative-row">
            <div className="protected">
              <span className="eyebrow">09 / ОТ ПРОЕКТА ДО ТЕПЛА</span>
              <h2>
                Всё ведёт
                <br />
                <span className="muted-heading">к вашему дому.</span>
              </h2>
              <p className="section-intro">
                Расскажите, что вы планируете.
                <br />
                Мы поможем понять, с чего начать.
              </p>
              <LeadButton>Обсудить газификацию</LeadButton>
              <div className="contact-details">
                <a className="contact-phone" href="tel:+79100697000">
                  +7 (910) 069-70-00
                </a>
                <p>{settings.contacts.address}</p>
                <details className="other-phones">
                  <summary>Дополнительные телефоны</summary>
                  <a href="tel:+79100101945">+7 (910) 010-19-45</a>
                  <a href="tel:+79157012244">+7 (915) 701-22-44</a>
                </details>
              </div>
            </div>
            <div className="boiler-visual">
              <Stage kind="boiler" label="05 — Тепло вашего дома" />
              <BoilerStatus />
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Brand />
          <div className="footer-legal">
            <p>
              {settings.contacts.entity} · ИНН {settings.contacts.inn}
            </p>
            <div>
              {settings.documents.map((d) => (
                <a key={d.url} href={d.url} target="_blank" rel="noreferrer">
                  {d.title}
                </a>
              ))}
            </div>
          </div>
          <a href="#main" className="back-top">
            Наверх <ArrowUpRight size={18} />
          </a>
        </div>
      </footer>
    </>
  );
}
