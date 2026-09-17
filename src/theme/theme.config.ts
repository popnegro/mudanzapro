export interface ThemeConfig {
  brand: { name: string; tagline: string };
  site: { domain: string; baseUrl: string; locale: string; city: string; province: string; country: string };
  contact: { whatsapp: string; whatsappUrl: string; phone?: string; email?: string };
  ecosystem?: { informationalUrl?: string; planningUrl?: string; providerUrl?: string };
}

/**
 * theme-mudanzas adoption contract.
 * MudanzaPro keeps its planning/product identity and data; this contract
 * only centralizes shared ecosystem/site configuration.
 */
export const themeConfig: ThemeConfig = {
  brand: {
    name: 'MudanzaPro',
    tagline: 'Planificá tu mudanza antes de pedir presupuesto',
  },
  site: {
    domain: 'mudanzapro.com.ar',
    baseUrl: 'https://mudanzapro.com.ar',
    locale: 'es-AR',
    city: 'Mendoza',
    province: 'Mendoza',
    country: 'Argentina',
  },
  contact: {
    whatsapp: '5492615130910',
    whatsappUrl: 'https://wa.me/5492615130910',
  },
  ecosystem: {
    informationalUrl: 'https://mudanzasmendoza.com.ar',
    planningUrl: 'https://mudanzapro.com.ar',
    providerUrl: 'https://mudanzasmiranda.com.ar',
  },
};
