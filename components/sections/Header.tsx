"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Menu, Phone, X, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { LeadButton } from "@/components/ui/Experience";
export const navigation = [
  ["Как мы работаем", "/#process"],
  ["Услуги", "/#services"],
  ["О компании", "/#expertise"],
  ["Контакты", "/#contacts"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map(([t, h]) => (
            <a key={h} href={h}>
              {t}
            </a>
          ))}
        </nav>
        <a className="header-phone" href="tel:+79100697000">
          +7 (910) 069-70-00
        </a>
        <LeadButton className="button button-small header-cta">
          Обсудить проект
        </LeadButton>
        <div className="mobile-actions">
          <a
            href="tel:+79100697000"
            className="icon-button"
            aria-label="Позвонить в РусГаз"
          >
            <Phone size={20} />
          </a>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="icon-button" aria-label="Открыть меню">
              <Menu size={24} />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-menu">
                <Dialog.Title className="sr-only">Навигация</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Разделы сайта РусГаз
                </Dialog.Description>
                <div className="menu-top">
                  <Brand />
                  <Dialog.Close
                    className="icon-button"
                    aria-label="Закрыть меню"
                  >
                    <X />
                  </Dialog.Close>
                </div>
                <nav aria-label="Мобильная навигация">
                  {navigation.map(([t, h], i) => (
                    <a key={h} href={h} onClick={() => setOpen(false)}>
                      <span>0{i + 1}</span>
                      {t}
                      <ArrowUpRight size={22} />
                    </a>
                  ))}
                </nav>
                <a className="menu-phone" href="tel:+79100697000">
                  +7 (910) 069-70-00
                </a>
                <p className="muted">Начнём с вашего дома.</p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
