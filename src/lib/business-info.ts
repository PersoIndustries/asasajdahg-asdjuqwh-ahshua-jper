// Datos de negocio centralizados para uso en JSON-LD (LocalBusiness / GardenStore)
// y otros datos estructurados. Actualizar aquí para propagar a todas las páginas.

export const businessInfo = {
  name: "Jardiper",
  legalName: "Horticultura Peralta S.L.",
  url: "/",
  telephone: "+34974472158",
  telephoneSecondary: "+34611321620",
  email: "correo@jardiper.es",
  foundingDate: "1974",
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card",
  address: {
    streetAddress: "Carretera A-131 km 1,800",
    addressLocality: "Fraga",
    addressRegion: "Huesca",
    postalCode: "22520",
    addressCountry: "ES",
  },
  geo: { latitude: 41.5322, longitude: 0.3416 },
  areaServed: ["Fraga", "Bajo Cinca", "Lleida", "Huesca"],
  sameAs: ["https://instagram.com/jardiper"],
} as const;

// Horario actual (verano): L–V 8-13 / 16-19, sábados 9-13, domingos y festivos cerrado.
export const openingHoursSpecification = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "13:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "16:00",
    closes: "19:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Saturday"],
    opens: "09:00",
    closes: "13:00",
  },
] as const;

export const postalAddressLd = {
  "@type": "PostalAddress",
  ...businessInfo.address,
};

export const geoCoordinatesLd = {
  "@type": "GeoCoordinates",
  ...businessInfo.geo,
};

// Nodo LocalBusiness/GardenStore reutilizable. Incluye tipos múltiples para
// maximizar cobertura de rich results de Google.
export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GardenStore"],
  "@id": "https://jardiper.es/#business",
  name: businessInfo.name,
  legalName: businessInfo.legalName,
  description:
    "Vivero y garden center familiar en Fraga (Huesca) desde 1974. Plantas, sustratos, compost y consejo experto para el Bajo Cinca.",
  telephone: businessInfo.telephone,
  email: businessInfo.email,
  url: "/",
  address: postalAddressLd,
  geo: geoCoordinatesLd,
  areaServed: businessInfo.areaServed as unknown as string[],
  openingHoursSpecification,
  priceRange: businessInfo.priceRange,
  currenciesAccepted: businessInfo.currenciesAccepted,
  paymentAccepted: businessInfo.paymentAccepted,
  foundingDate: businessInfo.foundingDate,
  sameAs: businessInfo.sameAs as unknown as string[],
};