import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sections/Header";
import { settings } from "@/content/local";
export const metadata: Metadata = {
  title: "Документы и реквизиты",
  alternates: { canonical: "/documents/" },
};
export default function Documents() {
  return (
    <>
      <Header />
      <main id="main" className="container service-page">
        <span className="eyebrow">РУСГАЗ / ИНФОРМАЦИЯ</span>
        <h1>
          Документы
          <br />и реквизиты.
        </h1>
        <div className="service-page-grid">
          <section>
            <h2>Контактные данные</h2>
            <ul className="scope-list">
              <li>{settings.contacts.entity}</li>
              <li>ИНН {settings.contacts.inn}</li>
              <li>{settings.contacts.address}</li>
            </ul>
            <a className="text-link" href="tel:+79100697000">
              +7 (910) 069-70-00
            </a>
          </section>
          <aside>
            <h3>Обработка персональных данных</h3>
            <p>Документ, опубликованный компанией РусГаз.</p>
            <a
              className="text-link"
              href={settings.documents[1].url}
              target="_blank"
              rel="noreferrer"
            >
              Открыть документ ↗
            </a>
          </aside>
        </div>
        <Link className="text-link" href="/">
          ← На главную
        </Link>
      </main>
    </>
  );
}
