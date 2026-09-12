import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { getRouteById } from "../routes";

interface SeoManagerProps {
  activeBrand?: unknown;
  activePage: string;
}

/**
 * SEO for the neutral MudanzaPro planning layer.
 *
 * MudanzaPro is not a moving company and must not emit LocalBusiness,
 * MovingCompany, AggregateRating or fabricated analytics identifiers.
 */
const SeoManager: React.FC<SeoManagerProps> = ({ activePage }) => {
  const route = getRouteById(activePage) ?? getRouteById("inicio");
  const canonicalPath = activePage === "inicio" ? "/" : `/#${activePage}`;
  const canonicalUrl = `https://mudanzapro.vercel.app${canonicalPath}`;
  const title = route?.seoTitle ?? "MudanzaPro — Planificá tu mudanza";
  const description = route?.seoDescription ?? "Herramientas para planificar, estimar y preparar una mudanza en Mendoza.";
  const robots = useMemo(() => (activePage === "inicio" ? "index,follow" : "noindex,follow"), [activePage]);

  return (
    <Helmet>
      <html lang="es-AR" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="es_AR" />
    </Helmet>
  );
};

export default SeoManager;
