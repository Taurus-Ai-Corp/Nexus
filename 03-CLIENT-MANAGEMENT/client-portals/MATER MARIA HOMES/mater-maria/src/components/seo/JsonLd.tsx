import { SITE, FAQ_ITEMS } from "@/lib/constants";

function buildSchemas() {
  const siteUrl = `https://${SITE.domain}`;

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: SITE.name,
    url: siteUrl,
    logo: `${siteUrl}/assets-2025/images/logo.png`,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Elangulam, Kanjirappally",
      addressLocality: "Kanjirappally",
      addressRegion: "Kerala",
      postalCode: "686507",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.5685,
      longitude: 76.7896,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      email: SITE.email,
      contactType: "customer service",
      availableLanguage: ["English", "Malayalam", "Hindi"],
    },
    sameAs: [SITE.whatsapp],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description:
      "Kerala's first AI-powered net-zero wellness estate — 90 premium residences with 24/7 medical care, organic orchards, and smart home technology in Kanjirappally, Kottayam.",
    url: siteUrl,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Elangulam, Kanjirappally",
      addressLocality: "Kottayam",
      addressRegion: "Kerala",
      postalCode: "686507",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.5685,
      longitude: 76.7896,
    },
    priceRange: "₹₹₹",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteUrl,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return [organization, localBusiness, webSite, faqPage];
}

export function JsonLd() {
  const schemas = buildSchemas();

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Safe: all values are hardcoded constants, not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
