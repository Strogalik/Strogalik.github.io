"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { reachGoal, trackAvito, trackTelegram } from "./analytics";
import {
  ADVANTAGES,
  AVITO_URL,
  EQUIPMENT,
  PRICE_CATEGORIES,
  PRICE_GROUPS,
  PROCESS_STEPS,
  STUDIO,
  STUDIO_IMAGES,
  TELEGRAM_URL,
  type PriceCategory,
} from "./site-config";

const EXTERNAL_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox="0 0 104 48"
      fill="none"
      aria-hidden="true"
    >
      <path className="logo-wave logo-wave-back" d="M2 24h12c6 0 7-17 13-17s7 34 13 34S47 4 54 4s7 40 14 40 7-30 14-30 7 10 13 10h7" />
      <path className="logo-wave" d="M2 24h12c6 0 7-17 13-17s7 34 13 34S47 4 54 4s7 40 14 40 7-30 14-30 7 10 13 10h7" />
    </svg>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({
  index,
  eyebrow,
  title,
  description,
  light = false,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  light?: boolean;
}) {
  return (
    <Reveal className={`section-intro ${light ? "section-intro-light" : ""}`}>
      <div className="section-kicker">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </Reveal>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function SoundWaveLanding() {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<PriceCategory>("intro");
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);

  useEffect(() => {
    const updateHeader = () => setHeaderSolid(window.scrollY > 32);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    let cancelled = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };

      frame = window.requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reducedMotion]);

  const chooseCategory = (category: PriceCategory) => {
    setActiveCategory(category);
    reachGoal("pricing_category_change", { category });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>

      <header className={`site-header ${headerSolid || menuOpen ? "site-header-solid" : ""}`}>
        <div className="header-inner shell">
          <a className="brand" href="#home" aria-label="Sound Wave — на главную" onClick={closeMenu}>
            <LogoMark />
            <span>SOUND WAVE</span>
          </a>

          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#prices">Цены</a>
            <a href="#gallery">Студия</a>
            <a href="#equipment">Оборудование</a>
            <a href="#contacts">Контакты</a>
          </nav>

          <a
            className="header-cta"
            href={TELEGRAM_URL}
            onClick={() => trackTelegram("header")}
            {...EXTERNAL_PROPS}
          >
            Записаться <Arrow />
          </a>

          <button
            className={`menu-button ${menuOpen ? "menu-button-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              id="mobile-menu"
              className="mobile-menu"
              aria-label="Мобильная навигация"
              initial={reducedMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <a href="#prices" onClick={closeMenu}>Цены</a>
              <a href="#gallery" onClick={closeMenu}>Студия</a>
              <a href="#equipment" onClick={closeMenu}>Оборудование</a>
              <a href="#contacts" onClick={closeMenu}>Контакты</a>
              <a
                href={TELEGRAM_URL}
                onClick={() => {
                  trackTelegram("mobile_menu");
                  closeMenu();
                }}
                {...EXTERNAL_PROPS}
              >
                Telegram <Arrow />
              </a>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="main-content">
        <section className="hero screen-section" id="home" aria-labelledby="hero-title">
          <Image
            className="hero-image"
            src={STUDIO_IMAGES.hero}
            alt="Рабочая зона студии Sound Wave со световой стеной"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content shell">
            <motion.div
              className="hero-stack"
              initial={reducedMotion ? false : "hidden"}
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              }}
            >
              <motion.div
                className="hero-brandline"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                }}
              >
                <LogoMark className="hero-logo" />
                <span>Москва · Маяковская</span>
              </motion.div>

              <motion.p
                className="hero-wordmark"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9 } },
                }}
              >
                SOUND WAVE
              </motion.p>

              <motion.h1
                id="hero-title"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.75 } },
                }}
              >
                Студия звукозаписи <span>в центре Москвы</span>
              </motion.h1>

              <motion.p
                className="hero-copy"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                }}
              >
                Записывай вокал, рэп и полноценные треки на ламповый Союз 017 TUBE.
              </motion.p>

              <motion.div
                className="hero-offers"
                variants={{
                  hidden: { opacity: 0, scale: 0.96 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.65 } },
                }}
              >
                <span>Первый час</span>
                <strong>490 ₽</strong>
                <i aria-hidden="true" />
                <span>Первая ночь</span>
                <strong>3 990 ₽</strong>
              </motion.div>

              <motion.div
                className="hero-actions"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
                }}
              >
                <a
                  className="button button-primary"
                  href={TELEGRAM_URL}
                  onClick={() => trackTelegram("hero", "hero_cta_click")}
                  {...EXTERNAL_PROPS}
                >
                  Записаться в Telegram <Arrow />
                </a>
                <a
                  className="button button-outline"
                  href={AVITO_URL}
                  onClick={() => trackAvito("hero")}
                  {...EXTERNAL_PROPS}
                >
                  Посмотреть на Avito <Arrow />
                </a>
              </motion.div>

              <motion.div
                className="hero-meta"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.7 } },
                }}
              >
                <span>{STUDIO.metro}</span>
                <span>{STUDIO.address}</span>
              </motion.div>
            </motion.div>
          </div>
          <a className="scroll-cue" href="#studio" aria-label="Прокрутить к следующей секции">
            <span>Scroll</span>
            <i />
          </a>
        </section>

        <section className="feature-section screen-section light-section" id="studio" aria-labelledby="microphone-title">
          <div className="shell split-layout">
            <Reveal className="feature-photo-wrap">
              <div className="feature-photo">
                <Image
                  src={STUDIO_IMAGES.microphone}
                  alt="Микрофон в акустически подготовленной зоне студии Sound Wave"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
                <div className="photo-index">S017 / TUBE</div>
              </div>
            </Reveal>

            <div className="feature-copy">
              <SectionIntro
                index="01"
                eyebrow="Главный инструмент"
                light
                title={<>Союз 017 <span className="accent-text">TUBE</span></>}
                description="Ламповый микрофон, вокруг которого строится точная и спокойная вокальная сессия."
              />
              <Reveal className="large-statement" delay={0.08}>
                Голос — в центре внимания. Техника работает на подачу, а не отвлекает от неё.
              </Reveal>
              <Reveal className="feature-lines" delay={0.14}>
                <div><span>01</span><p>Настроим микрофон и тракт под голос исполнителя.</p></div>
                <div><span>02</span><p>Поможем с подачей, дублями и бэк-вокалом во время записи.</p></div>
                <div><span>03</span><p>Сделаем базовую обработку и экспортируем записанные дорожки.</p></div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="pricing-section screen-section dark-section" id="prices" aria-labelledby="pricing-title">
          <div className="shell pricing-layout">
            <div className="pricing-main">
              <SectionIntro
                index="02"
                eyebrow="Стоимость"
                title={<>Выберите формат <span className="accent-text">сессии</span></>}
                description="От первого знакомства со студией до трека под ключ."
              />

              <div className="price-tabs" role="tablist" aria-label="Категории цен">
                {PRICE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    id={`tab-${category.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category.id}
                    aria-controls={`panel-${category.id}`}
                    className={activeCategory === category.id ? "active" : ""}
                    onClick={() => chooseCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="price-panel-frame">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    id={`panel-${activeCategory}`}
                    className="price-panel"
                    role="tabpanel"
                    aria-labelledby={`tab-${activeCategory}`}
                    initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {PRICE_GROUPS[activeCategory].map((item, index) => (
                      <div className="price-row" key={item.name}>
                        <span className="price-number">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h3>{item.name}</h3>
                          {item.note ? <p>{item.note}</p> : null}
                        </div>
                        <strong>{item.price}</strong>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <a
                className="text-link"
                href={TELEGRAM_URL}
                onClick={() => trackTelegram("pricing", "pricing_cta_click")}
                {...EXTERNAL_PROPS}
              >
                Подобрать формат <Arrow />
              </a>
            </div>

            <Reveal className="pricing-photo-card" delay={0.12}>
              <Image
                src={STUDIO_IMAGES.controller}
                alt="Музыкальный контроллер и клавиши в студии Sound Wave"
                fill
                sizes="(max-width: 900px) 100vw, 32vw"
              />
              <div className="pricing-photo-shade" />
              <div className="pricing-card-top">
                <span>Первый визит</span>
                <LogoMark />
              </div>
              <div className="pricing-card-bottom">
                <strong>490 ₽</strong>
                <p>Первый час в студии</p>
                <a
                  className="button button-outline"
                  href={TELEGRAM_URL}
                  onClick={() => trackTelegram("pricing_card", "pricing_cta_click")}
                  {...EXTERNAL_PROPS}
                >
                  Забронировать <Arrow />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="gallery-section screen-section light-section" id="gallery" aria-labelledby="gallery-title">
          <div className="shell">
            <SectionIntro
              index="03"
              eyebrow="Пространство"
              light
              title={<>Место, где можно <span className="accent-text">сосредоточиться</span></>}
              description="Фотографии студии Sound Wave на Красина, 14с2."
            />

            <div className="gallery-grid">
              <Reveal className="gallery-item gallery-wide">
                <Image
                  src={STUDIO_IMAGES.workstation}
                  alt="Рабочая зона Sound Wave с ноутбуком и световой стеной"
                  fill
                  sizes="(max-width: 700px) 100vw, 62vw"
                />
                <span>CONTROL ROOM</span>
              </Reveal>
              <Reveal className="gallery-item gallery-tall" delay={0.08}>
                <Image
                  src={STUDIO_IMAGES.controller}
                  alt="Контроллер и клавиши в студии Sound Wave"
                  fill
                  sizes="(max-width: 700px) 100vw, 29vw"
                />
                <span>CREATE</span>
              </Reveal>
              <Reveal className="gallery-item gallery-square" delay={0.1}>
                <Image
                  src={STUDIO_IMAGES.microphone}
                  alt="Зона записи с микрофоном и акустической обработкой"
                  fill
                  sizes="(max-width: 700px) 100vw, 29vw"
                />
                <span>RECORD</span>
              </Reveal>
              <Reveal className="gallery-item gallery-detail" delay={0.16}>
                <Image
                  src={STUDIO_IMAGES.cloudWall}
                  alt="Фирменная световая стена студии Sound Wave"
                  fill
                  sizes="(max-width: 700px) 100vw, 62vw"
                />
                <span>WAVE</span>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="process-section screen-section dark-section" id="process" aria-labelledby="process-title">
          <div className="shell process-shell">
            <SectionIntro
              index="04"
              eyebrow="Как всё проходит"
              title={<>От сообщения до <span className="accent-text">готовых дорожек</span></>}
              description="Понятный процесс без лишней суеты. Финальное сведение при необходимости заказывается отдельно."
            />

            <div className="process-grid">
              {PROCESS_STEPS.map((step, index) => (
                <Reveal className="process-step" delay={index * 0.07} key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="process-note" delay={0.18}>
              <span>В сессию входит</span>
              <p>Подготовка проекта · настройка микрофона · запись вокала и бэк-вокала · базовая обработка · экспорт дорожек</p>
            </Reveal>
          </div>
        </section>

        <section className="equipment-section screen-section light-section" id="equipment" aria-labelledby="equipment-title">
          <div className="shell equipment-layout">
            <div className="equipment-copy">
              <SectionIntro
                index="05"
                eyebrow="Оборудование"
                light
                title={<>Всё для <span className="accent-text">точной записи</span></>}
                description="Собранный тракт и рабочее пространство без лишних звеньев."
              />

              <div className="equipment-list">
                {EQUIPMENT.map(([number, name, type], index) => (
                  <Reveal className="equipment-row" delay={index * 0.04} key={name}>
                    <span>{number}</span>
                    <strong>{name}</strong>
                    <p>{type}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="equipment-photo" delay={0.12}>
              <Image
                src={STUDIO_IMAGES.cloudWall}
                alt="Рабочее место студии Sound Wave"
                fill
                sizes="(max-width: 900px) 100vw, 39vw"
              />
              <div className="equipment-photo-caption">
                <span>SOUND WAVE</span>
                <span>MOSCOW / 2026</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="advantages-section screen-section dark-section" id="advantages" aria-labelledby="advantages-title">
          <div className="shell">
            <SectionIntro
              index="06"
              eyebrow="Почему Sound Wave"
              title={<>Сессия без <span className="accent-text">лишнего шума</span></>}
              description="Техника, помощь и пространство собраны вокруг одной задачи — дать артисту спокойно записать материал."
            />

            <div className="advantages-grid">
              {ADVANTAGES.map((item, index) => (
                <Reveal className="advantage-row" delay={index * 0.04} key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item}</h3>
                  <i aria-hidden="true">↗</i>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="promos-section screen-section light-section" id="promos" aria-labelledby="promos-title">
          <div className="shell promos-layout">
            <div className="promos-hero">
              <SectionIntro
                index="07"
                eyebrow="Специальные условия"
                light
                title={<>Начать проще, <span className="accent-text">чем кажется</span></>}
              />
              <Reveal className="promo-price" delay={0.08}>
                <span>Первый час</span>
                <strong>490</strong>
                <i>₽</i>
              </Reveal>
            </div>

            <div className="promo-list">
              <Reveal className="promo-row"><span>01</span><div><h3>Первая ночь</h3><p>Специальная цена первого визита</p></div><strong>3 990 ₽</strong></Reveal>
              <Reveal className="promo-row" delay={0.05}><span>02</span><div><h3>Счастливые часы</h3><p>Ежедневно с 14:00 до 17:00</p></div><strong>790 ₽/час</strong></Reveal>
              <Reveal className="promo-row" delay={0.1}><span>03</span><div><h3>Больше времени</h3><p>При аренде от 3 часов</p></div><strong>+1 час</strong></Reveal>
              <Reveal className="promo-action" delay={0.16}>
                <p>Условия акций и свободные слоты уточняйте перед бронированием.</p>
                <a
                  className="button button-dark"
                  href={TELEGRAM_URL}
                  onClick={() => trackTelegram("promos")}
                  {...EXTERNAL_PROPS}
                >
                  Уточнить время <Arrow />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="final-cta screen-section" id="contacts" aria-labelledby="final-title">
          <Image
            src={STUDIO_IMAGES.hero}
            alt="Интерьер студии Sound Wave"
            fill
            sizes="100vw"
          />
          <div className="final-shade" />
          <div className="final-content shell">
            <Reveal className="final-stack">
              <LogoMark className="final-logo" />
              <span className="final-kicker">Москва · Маяковская</span>
              <h2 id="final-title">Готовы записать следующий трек?</h2>
              <p>Напишите, что хотите записать и когда вам удобно. Подберём формат и подтвердим свободное время.</p>
              <div className="final-actions">
                <a
                  className="button button-primary"
                  href={TELEGRAM_URL}
                  onClick={() => trackTelegram("final", "final_cta_click")}
                  {...EXTERNAL_PROPS}
                >
                  Написать в Telegram <Arrow />
                </a>
                <a
                  className="button button-outline"
                  href={AVITO_URL}
                  onClick={() => trackAvito("final", "final_cta_click")}
                  {...EXTERNAL_PROPS}
                >
                  Открыть Avito <Arrow />
                </a>
              </div>
              <div className="final-address">
                <span>{STUDIO.address}</span>
                <span>{STUDIO.metro}</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#home" aria-label="Sound Wave — наверх">
              <LogoMark />
              <span>SOUND WAVE</span>
            </a>
            <p>Студия звукозаписи в центре Москвы.</p>
          </div>
          <div className="footer-column">
            <span>Навигация</span>
            <a href="#prices">Цены</a>
            <a href="#gallery">Студия</a>
            <a href="#equipment">Оборудование</a>
          </div>
          <div className="footer-column">
            <span>Контакты</span>
            <a href={TELEGRAM_URL} onClick={() => trackTelegram("footer")} {...EXTERNAL_PROPS}>{STUDIO.telegram}</a>
            <a href={AVITO_URL} onClick={() => trackAvito("footer")} {...EXTERNAL_PROPS}>Avito <Arrow /></a>
            <p>{STUDIO.address}</p>
          </div>
          <div className="footer-column footer-legal">
            <span>Реквизиты</span>
            <p>{STUDIO.legalName}</p>
            <p>ИНН {STUDIO.taxId}</p>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} Sound Wave</span>
          <span>Звук без границ</span>
        </div>
      </footer>

      <a
        className="mobile-fixed-cta"
        href={TELEGRAM_URL}
        onClick={() => trackTelegram("mobile_fixed")}
        {...EXTERNAL_PROPS}
      >
        <span>Записаться</span>
        <strong>Первый час · 490 ₽</strong>
        <Arrow />
      </a>
    </>
  );
}
