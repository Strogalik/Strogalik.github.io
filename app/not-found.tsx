import Link from "next/link";
import { Header } from "@/components/sections/Header";
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container service-page">
        <span className="eyebrow">404 / СТРАНИЦА НЕ НАЙДЕНА</span>
        <h1>
          Вернёмся
          <br />к вашему дому.
        </h1>
        <p className="lead">
          По этому адресу нет страницы. Услуги и контакты доступны на главной.
        </p>
        <Link className="button" href="/">
          На главную
        </Link>
      </main>
    </>
  );
}
