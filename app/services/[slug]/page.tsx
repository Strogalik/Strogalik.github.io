import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { content } from "@/content/local";
import { Header } from "@/components/sections/Header";
import { LeadButton } from "@/components/ui/Experience";
export const dynamicParams = false;
export function generateStaticParams() {
  return content.services().map((s) => ({ slug: s.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = content.services().find((s) => s.id === slug);
  return {
    title: service?.title,
    description: service?.summary,
    alternates: { canonical: `/services/${slug}/` },
    openGraph: { title: service?.title, description: service?.summary },
  };
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = content.services().find((s) => s.id === slug);
  if (!s) notFound();
  return (
    <>
      <Header />
      <main id="main" className="container service-page">
        <Link href="/#services" className="text-link">
          <ArrowLeft size={18} />К услугам
        </Link>
        <span className="eyebrow">
          РУСГАЗ /{" "}
          {s.category === "gas" ? "ГАЗОСНАБЖЕНИЕ" : "ИНЖЕНЕРНЫЕ СИСТЕМЫ"}
        </span>
        <h1>{s.title}</h1>
        <p className="lead">{s.summary}</p>
        <div className="service-page-grid">
          <div>
            <h2>Обсудим состав работ.</h2>
            <ul className="scope-list">
              {s.scope.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="muted">
              Решение, сроки и стоимость определяются после знакомства с
              объектом. Итоговый состав работ согласуется индивидуально.
            </p>
            <LeadButton serviceId={s.id}>Обсудить задачу</LeadButton>
          </div>
          <aside>
            <h3>Начнём с разговора.</h3>
            <p>Расскажите об объекте и о том, что хотите сделать.</p>
            <a className="text-link" href="tel:+79100697000">
              +7 (910) 069-70-00 <ArrowUpRight size={18} />
            </a>
            <p className="small muted">{content.settings().contacts.address}</p>
          </aside>
        </div>
        <div className="service-other">
          <span className="eyebrow">ДРУГИЕ НАПРАВЛЕНИЯ</span>
          {content
            .services()
            .filter((v) => v.id !== s.id)
            .map((v) => (
              <Link key={v.id} href={`/services/${v.id}/`}>
                {v.title}
                <ArrowUpRight size={16} />
              </Link>
            ))}
        </div>
      </main>
    </>
  );
}
