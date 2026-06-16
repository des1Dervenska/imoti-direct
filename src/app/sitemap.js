import { getAllProperties } from "@/lib/properties";
import { LOCALES } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.arthouse94.com";

const STATIC_ROUTES = ["", "/sales", "/rent", "/about", "/contact", "/privacy", "/terms"];

function toAbsolute(pathname) {
  return `${SITE_URL}${pathname}`;
}

export default async function sitemap() {
  const now = new Date();
  const staticEntries = LOCALES.flatMap((locale) =>
    STATIC_ROUTES.map((route) => ({
      url: toAbsolute(`/${locale}${route}`),
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.8,
    }))
  );

  const properties = await getAllProperties();
  const propertyEntries = (properties || [])
    .filter((property) => property?.slug)
    .flatMap((property) =>
      LOCALES.map((locale) => ({
        url: toAbsolute(`/${locale}/properties/${property.slug}`),
        lastModified: property.updatedAt || property.createdAt || now,
        changeFrequency: "daily",
        priority: 0.9,
      }))
    );

  return [...staticEntries, ...propertyEntries];
}
