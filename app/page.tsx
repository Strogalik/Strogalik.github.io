import { SoundWaveLanding } from "./SoundWaveLanding";
import { SITE_URL, STUDIO, STUDIO_IMAGES, TELEGRAM_URL } from "./site-config";

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL ? `${SITE_URL}/#studio` : undefined,
    name: STUDIO.name,
    legalName: STUDIO.legalName,
    taxID: STUDIO.taxId,
    url: SITE_URL || undefined,
    description:
      "Студия звукозаписи в центре Москвы: запись вокала и треков, аренда студии и помощь звукорежиссёра.",
    image: SITE_URL ? `${SITE_URL}${STUDIO_IMAGES.hero}` : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Красина, 14с2",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    areaServed: "Москва",
    currenciesAccepted: "RUB",
    priceRange: "490–10 000+ ₽",
    sameAs: [TELEGRAM_URL],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <SoundWaveLanding />
    </>
  );
}
