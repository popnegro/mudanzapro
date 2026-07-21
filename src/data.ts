import {
  Department,
  ServiceItem,
  FurnitureItem,
  BrandConfig,
  QuoteLead,
  RecommendedCompany,
} from "./types";

export const BRANDS: Record<string, BrandConfig> = {
  mendoza: {
    id: "mendoza",
    name: "Mudanzas Mendoza",
    tagline:
      "Expertos en Mudanzas Locales y Relocalizaciones en la Provincia de Mendoza",
    primaryColor: "from-amber-600 to-orange-500",
    secondaryColor: "amber-600",
    accentColor: "orange",
    gradientFrom: "#f59e0b",
    gradientTo: "#f97316",
    domain: "mudanzasmendoza.com.ar",
    phone: "+54 261 455-8899",
    email: "contacto@mudanzasmendoza.com.ar",
    address: "Av. San Martín 1240, Godoy Cruz, Mendoza",
    reviewCount: 342,
    avgRating: 4.9,
  },
  miranda: {
    id: "miranda",
    name: "Mudanzas Miranda",
    tagline:
      "El Servicio de Mudanza Más Confiable y Seguro del Gran Buenos Aires",
    primaryColor: "from-sky-700 to-indigo-600",
    secondaryColor: "sky-700",
    accentColor: "sky",
    gradientFrom: "#0369a1",
    gradientTo: "#4f46e5",
    domain: "mudanzasmiranda.com.ar",
    phone: "+54 11 5233-9800",
    email: "info@mudanzasmiranda.com.ar",
    address: "Av. Cabildo 2200, Belgrano, CABA",
    reviewCount: 489,
    avgRating: 4.8,
  },
  empresas: {
    id: "empresas",
    name: "Empresas de Mudanzas",
    tagline:
      "Directorio Líder de Transportistas y Mudanzas Verificadas en Argentina",
    primaryColor: "from-emerald-700 to-teal-600",
    secondaryColor: "emerald-700",
    accentColor: "emerald",
    gradientFrom: "#047857",
    gradientTo: "#0d9488",
    domain: "empresasdemudanzas.com.ar",
    phone: "+54 800 555-MUDAR",
    email: "soporte@empresasdemudanzas.com.ar",
    address: "Oficinas Centrales - Buenos Aires, Argentina",
    reviewCount: 1250,
    avgRating: 4.7,
  },
};

export const DEPARTMENTS: Department[] = [
  {
    id: "capital",
    name: "Mendoza Capital",
    slug: "mendoza-capital",
    baseRateMultiplier: 1.0,
    featuredNeighborhoods: [
      "Quinta Sección",
      "Bombal",
      "Sexta Sección",
      "Microcentro",
      "Barrio Cívico",
    ],
    description:
      "La zona céntrica de Mendoza. Accesos rápidos pero mayor complejidad de estacionamiento y tránsito. Requiere permisos municipales específicos para mudanzas diurnas.",
    movingStats: {
      monthlyVolume: 124,
      avgCost: 110000,
      popularTime: "Sábados por la mañana",
    },
  },
  {
    id: "godoy_cruz",
    name: "Godoy Cruz",
    slug: "godoy-cruz",
    baseRateMultiplier: 1.05,
    featuredNeighborhoods: [
      "Palmares",
      "Villa Marini",
      "Barrio Solares",
      "Parque General San Martín",
      "Las Tortugas",
    ],
    description:
      "Uno de los departamentos más poblados y de mayor demanda de traslados residenciales. Excelente conectividad por el Corredor del Oeste y Av. San Martín.",
    movingStats: {
      monthlyVolume: 145,
      avgCost: 118000,
      popularTime: "Fin de semana",
    },
  },
  {
    id: "lujan_de_cuyo",
    name: "Luján de Cuyo",
    slug: "lujan-de-cuyo",
    baseRateMultiplier: 1.15,
    featuredNeighborhoods: [
      "Chacras de Coria",
      "Vistalba",
      "La Puntilla",
      "Carrodilla",
      "Mayor Drummond",
    ],
    description:
      "Zona residencial premium de Mendoza. Distancias más largas, calles arboladas angostas y accesos a barrios privados residenciales con rigurosas normas de ingreso de camiones.",
    movingStats: {
      monthlyVolume: 98,
      avgCost: 145000,
      popularTime: "Días de semana por la tarde",
    },
  },
  {
    id: "guaymallen",
    name: "Guaymallén",
    slug: "guaymallen",
    baseRateMultiplier: 0.95,
    featuredNeighborhoods: [
      "Dorrego",
      "Villa Nueva",
      "San José",
      "Las Cañas",
      "Rodeo de la Cruz",
    ],
    description:
      "El departamento más poblado de la provincia. Gran volumen comercial y residencial. Las zonas de Dorrego y Las Cañas registran la mayor densidad de mudanzas de departamentos.",
    movingStats: {
      monthlyVolume: 162,
      avgCost: 95000,
      popularTime: "Sábados enteros",
    },
  },
  {
    id: "maipu",
    name: "Maipú",
    slug: "maipu",
    baseRateMultiplier: 1.1,
    featuredNeighborhoods: [
      "Luzuriaga",
      "Coquimbito",
      "Gutiérrez",
      "Maipú Centro",
      "Russell",
    ],
    description:
      "Mezcla de zonas residenciales en auge y áreas agrícolas. Luzuriaga destaca por la afluencia de jóvenes familias mudándose a nuevos dúplex y complejos habitacionales.",
    movingStats: {
      monthlyVolume: 85,
      avgCost: 130000,
      popularTime: "Viernes por la mañana",
    },
  },
  {
    id: "las_heras",
    name: "Las Heras",
    slug: "las-heras",
    baseRateMultiplier: 1.08,
    featuredNeighborhoods: [
      "El Challao",
      "Panquehua",
      "El Plumerillo",
      "Uspallata",
      "Las Heras Centro",
    ],
    description:
      "Amplia geografía que incluye desde el pedemonte de El Challao hasta zonas urbanas e industriales. El Challao requiere vehículos con potencia adecuada para pendientes.",
    movingStats: {
      monthlyVolume: 74,
      avgCost: 125000,
      popularTime: "Sábados",
    },
  },
  {
    id: "san_rafael",
    name: "San Rafael",
    slug: "san-rafael",
    baseRateMultiplier: 1.4,
    featuredNeighborhoods: [
      "San Rafael Centro",
      "Rama Caída",
      "Las Paredes",
      "Cuadro Nacional",
      "El Cerrito",
    ],
    description:
      "La capital turística y de servicios del Sur mendocino. Gran volumen de mudanzas de larga distancia residencial y traslados comerciales desde o hacia la ciudad de Mendoza.",
    movingStats: {
      monthlyVolume: 34,
      avgCost: 350000,
      popularTime: "Lunes a Viernes (Planificado)",
    },
  },
  {
    id: "general_alvear",
    name: "General Alvear",
    slug: "general-alvear",
    baseRateMultiplier: 1.5,
    featuredNeighborhoods: [
      "Alvear Oeste",
      "Bowen",
      "San Pedro del Atuel",
      "Ciudad Alvear",
    ],
    description:
      "Zona Sur productiva. Alta demanda de traslados agrícolas, traslados interurbanos y mudanzas de larga distancia nacional conectando con La Pampa y San Luis.",
    movingStats: {
      monthlyVolume: 15,
      avgCost: 390000,
      popularTime: "Días de semana por la mañana",
    },
  },
  {
    id: "malargue",
    name: "Malargüe",
    slug: "malargue",
    baseRateMultiplier: 1.6,
    featuredNeighborhoods: [
      "Malargüe Centro",
      "Las Leñas",
      "El Sosneado",
      "Coihueco",
    ],
    description:
      "El departamento más austral y extenso de Mendoza. Rutas cordilleranas y condiciones climáticas extremas en invierno. Servicios especiales para el complejo Las Leñas y yacimientos.",
    movingStats: {
      monthlyVolume: 12,
      avgCost: 450000,
      popularTime: "Días hábiles al mediodía",
    },
  },
  {
    id: "tunuyan",
    name: "Tunuyán (Valle de Uco)",
    slug: "tunuyan",
    baseRateMultiplier: 1.25,
    featuredNeighborhoods: [
      "Tunuyán Centro",
      "Vista Flores",
      "Los Chacayes",
      "Colonia Las Rosas",
    ],
    description:
      "Corazón del Valle de Uco. Gran demanda de traslados especializados para el traslado de insumos de bodegas boutique y mudanzas residenciales de personal enológico de alto nivel.",
    movingStats: {
      monthlyVolume: 28,
      avgCost: 220000,
      popularTime: "Viernes enteros",
    },
  },
  {
    id: "tupungato",
    name: "Tupungato (Valle de Uco)",
    slug: "tupungato",
    baseRateMultiplier: 1.3,
    featuredNeighborhoods: [
      "Tupungato Centro",
      "Gualtallary",
      "San José",
      "El Peral",
    ],
    description:
      "Zona vitivinícola de altísima gama. Mudanzas de precisión para bodegas en el distrito de Gualtallary y mudanzas en áreas de pendientes pronunciadas.",
    movingStats: {
      monthlyVolume: 19,
      avgCost: 240000,
      popularTime: "Jueves por la mañana",
    },
  },
  {
    id: "san_carlos",
    name: "San Carlos (Valle de Uco)",
    slug: "san-carlos",
    baseRateMultiplier: 1.3,
    featuredNeighborhoods: [
      "La Consulta",
      "Eugenio Bustos",
      "Pareditas",
      "San Carlos Centro",
    ],
    description:
      "Departamento histórico del Valle de Uco. Servicios frecuentes de mudanzas agrícolas y residenciales conectando con la Ciudad de Mendoza a través de la mítica Ruta Nacional 40.",
    movingStats: {
      monthlyVolume: 16,
      avgCost: 250000,
      popularTime: "Sábados por la mañana",
    },
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "mudanza_basica",
    name: "Mudanza Básica (Solo Transporte)",
    icon: "Truck",
    description:
      "Transporte de puerta a puerta en camión habilitado. El cliente se encarga de la carga y descarga.",
    basePrice: 45000,
    priceDetail: "Precio base para mudanzas chicas (<10km)",
    features: [
      "Camión furgón cerrado de 5m³ o 10m³",
      "Chofer profesional especializado en rutas locales",
      "Sujeciones de seguridad y mantas protectoras básicas",
      "Monitoreo satelital GPS en tiempo real",
    ],
  },
  {
    id: "mudanza_premium",
    name: "Servicio de Mudanza Completa",
    icon: "Sparkles",
    description:
      "Mudanza llave en mano. Incluye personal de carga/descarga, estiba profesional y cuidado de muebles.",
    basePrice: 95000,
    priceDetail: "Servicio recomendado para familias",
    features: [
      "Chofer y 2 operarios de carga altamente capacitados",
      "Carga, estiba técnica en camión y descarga en destino",
      "Mantas de algodón grueso de alta densidad para evitar rayones",
      "Desarmado y rearmado de camas y mesas principales",
    ],
  },
  {
    id: "embalaje_proteccion",
    name: "Embalaje Profesional",
    icon: "Archive",
    description:
      "Protección extrema de tus bienes con materiales importados de alta resistencia antes del traslado.",
    basePrice: 30000,
    priceDetail: "Insumos y mano de obra incluidos",
    features: [
      "Film stretch de alta densidad, pluriball (burbujas) y cartón corrugado",
      "Rotulado detallado por ambiente y nivel de fragilidad",
      "Cajas de cartón reforzado doble canal provistas por nosotros",
      "Protección especial para vajilla, cristalería y electrodomésticos",
    ],
  },
  {
    id: "operarios_extra",
    name: "Peones de Fuerza",
    icon: "Users",
    description:
      "Operarios adicionales capacitados para traslados complejos o escaleras complicadas.",
    basePrice: 25000,
    priceDetail: "Por operario extra para la jornada",
    features: [
      "Personal propio con seguro de Accidentes Personales (AP) al día",
      "Capacidad para manipulación técnica de bultos pesados",
      "Especialistas en subida por escalera caracol o pasillos angostos",
      "Sincronización milimétrica para cargas rápidas",
    ],
  },
  {
    id: "guardamuebles",
    name: "Guardamuebles / Storage",
    icon: "Warehouse",
    description:
      "Almacenamiento temporal seguro y monitoreado para tus pertenencias en bauleras individuales.",
    basePrice: 40000,
    priceDetail: "Mensualidad de baulera estándar",
    features: [
      "Monitoreo por cámaras de seguridad 24/7 y alarmas vecinales",
      "Control de humedad, plagas y póliza de seguro contra incendios",
      "Bauleras privadas individuales con llave exclusiva",
      "Ingreso flexible coordinado",
    ],
  },
  {
    id: "mudanza_altura",
    name: "Mudanzas en Altura e Izajes",
    icon: "ArrowUpCircle",
    description:
      "Sistemas de sogas, poleas, arneses de escalada e izamiento exterior de muebles de grandes dimensiones para departamentos céntricos.",
    basePrice: 65000,
    priceDetail: "Izaje por mueble en edificios",
    features: [
      "Operarios especializados con certificación de trabajo en altura",
      "Arneses homologados de seguridad y cuerdas de alta resistencia",
      "Permiso municipal de ocupación temporal de vereda coordinado",
      "Cuidado extremo de aberturas de aluminio y balcones de vidrio",
    ],
  },
  {
    id: "traslado_pianos",
    name: "Traslado de Pianos y Objetos Pesados",
    icon: "Award",
    description:
      "Manipulación experta de pianos de cola y verticales, cajas fuertes, motores y maquinaria que requiere trineos y fundas acolchadas especiales.",
    basePrice: 85000,
    priceDetail: "Traslado para bultos pesados de gran porte",
    features: [
      "Uso de carros con ruedas de goma anti-huella y trineos de estiba",
      "Fundas de lona impermeable y acolchados de alta protección",
      "Aseguramiento del mueble por encima del estándar en camión furgón",
      "Sintonizadores de piano locales recomendados tras cada mudanza",
    ],
  },
];

export const FURNITURE_ITEMS: FurnitureItem[] = [
  // Living
  {
    id: "sofa_3c",
    name: "Sofá Grande (3 cuerpos)",
    category: "living",
    volumePoints: 12,
  },
  {
    id: "sofa_2c",
    name: "Sofá Mediano (2 cuerpos)",
    category: "living",
    volumePoints: 8,
  },
  {
    id: "mesa_com",
    name: "Mesa de Comedor Grande",
    category: "living",
    volumePoints: 10,
  },
  {
    id: "sillas",
    name: "Juego de Sillas (x6)",
    category: "living",
    volumePoints: 9,
  },
  {
    id: "tv_rack",
    name: "Mesa / Rack de TV grande",
    category: "living",
    volumePoints: 7,
  },
  {
    id: "televisor",
    name: 'Televisor Smart TV (>55")',
    category: "living",
    volumePoints: 3,
  },

  // Dormitorio
  {
    id: "cama_mat",
    name: "Cama Matrimonial / Queen / King",
    category: "dormitorio",
    volumePoints: 14,
  },
  {
    id: "cama_1p",
    name: "Cama de 1 Plaza (con colchón)",
    category: "dormitorio",
    volumePoints: 7,
  },
  {
    id: "placard",
    name: "Placard / Ropero (Desarmado)",
    category: "dormitorio",
    volumePoints: 15,
  },
  {
    id: "comoda",
    name: "Cómoda / Cajonera de madera",
    category: "dormitorio",
    volumePoints: 8,
  },
  {
    id: "mesa_luz",
    name: "Mesa de Luz (Par)",
    category: "dormitorio",
    volumePoints: 4,
  },

  // Cocina
  {
    id: "heladera",
    name: "Heladera / Freezer Grande",
    category: "cocina",
    volumePoints: 13,
  },
  {
    id: "lavarropas",
    name: "Lavarropas automático",
    category: "cocina",
    volumePoints: 6,
  },
  {
    id: "cocina_gas",
    name: "Cocina / Horno a Gas",
    category: "cocina",
    volumePoints: 5,
  },
  {
    id: "microondas",
    name: "Microondas / Horno Eléctrico",
    category: "cocina",
    volumePoints: 2,
  },

  // Otros
  {
    id: "caja_g",
    name: "Caja de Cartón Grande (Vajilla/Ropa)",
    category: "otros",
    volumePoints: 2,
  },
  {
    id: "caja_m",
    name: "Caja de Cartón Mediana",
    category: "otros",
    volumePoints: 1,
  },
  {
    id: "escritorio",
    name: "Escritorio de Oficina / PC",
    category: "otros",
    volumePoints: 8,
  },
  { id: "bici", name: "Bicicleta", category: "otros", volumePoints: 3 },
  {
    id: "espejo",
    name: "Espejo Grande / Cuadro frágil",
    category: "otros",
    volumePoints: 3,
  },
];

export const INITIAL_LEADS: QuoteLead[] = [
  {
    id: "lead-1",
    createdAt: "2026-07-17T14:32:00-03:00",
    brand: "mendoza",
    customerName: "Agustín Fernández",
    email: "agustin.fdez@gmail.com",
    phone: "+54 261 688 2311",
    originDept: "capital",
    destDept: "lujan_de_cuyo",
    moveSize: "grande",
    furnitureList: [
      { itemId: "sofa_3c", count: 1 },
      { itemId: "mesa_com", count: 1 },
      { itemId: "sillas", count: 1 },
      { itemId: "cama_mat", count: 1 },
      { itemId: "heladera", count: 1 },
      { itemId: "lavarropas", count: 1 },
      { itemId: "caja_g", count: 12 },
    ],
    servicesSelected: ["mudanza_premium", "embalaje_proteccion"],
    distanceKm: 18,
    hasElevatorOrigin: true,
    hasElevatorDest: false,
    floorOrigin: 4,
    floorDest: 1,
    scheduledDate: "2026-07-28",
    estimatedCost: 168000,
    status: "new",
    notes:
      "Cliente solicita sumo cuidado con piano vertical de herencia (no cargado en cotizador, se cobrará un extra en visita técnica).",
  },
  {
    id: "lead-2",
    createdAt: "2026-07-16T10:15:00-03:00",
    brand: "mendoza",
    customerName: "Mariana Sosa",
    email: "marianasosa.mza@yahoo.com",
    phone: "+54 261 311 0056",
    originDept: "godoy_cruz",
    destDept: "guaymallen",
    moveSize: "mediano",
    furnitureList: [
      { itemId: "sofa_2c", count: 1 },
      { itemId: "cama_1p", count: 2 },
      { itemId: "tv_rack", count: 1 },
      { itemId: "lavarropas", count: 1 },
      { itemId: "caja_m", count: 8 },
    ],
    servicesSelected: ["mudanza_basica"],
    distanceKm: 9,
    hasElevatorOrigin: false,
    hasElevatorDest: false,
    floorOrigin: 0,
    floorDest: 0,
    scheduledDate: "2026-07-24",
    estimatedCost: 82000,
    status: "contacted",
    notes:
      "Confirmó que ya tiene todo embalado en cajas. Necesita transporte estándar pero pidió ayuda a los choferes para cargar heladera grande.",
  },
  {
    id: "lead-3",
    createdAt: "2026-07-15T18:40:00-03:00",
    brand: "mendoza",
    customerName: "Roberto Piazza",
    email: "roberto_piazza@piazza-arq.com.ar",
    phone: "+54 261 544 9877",
    originDept: "capital",
    destDept: "maipu",
    moveSize: "grande",
    furnitureList: [
      { itemId: "mesa_com", count: 2 },
      { itemId: "sillas", count: 2 },
      { itemId: "escritorio", count: 4 },
      { itemId: "caja_g", count: 25 },
    ],
    servicesSelected: [
      "mudanza_premium",
      "embalaje_proteccion",
      "operarios_extra",
    ],
    distanceKm: 15,
    hasElevatorOrigin: true,
    hasElevatorDest: true,
    floorOrigin: 8,
    floorDest: 2,
    scheduledDate: "2026-08-03",
    estimatedCost: 245000,
    status: "new",
    notes:
      "Mudanza de estudio de arquitectura completo. Gran cantidad de planos enrollados y computadoras delicadas. Requiere factura A.",
  },
  {
    id: "lead-4",
    createdAt: "2026-07-12T09:00:00-03:00",
    brand: "mendoza",
    customerName: "Florencia Giménez",
    email: "flor_gimenez_92@gmail.com",
    phone: "+54 261 498 7755",
    originDept: "las_heras",
    destDept: "capital",
    moveSize: "chico",
    furnitureList: [
      { itemId: "cama_1p", count: 1 },
      { itemId: "televisor", count: 1 },
      { itemId: "microondas", count: 1 },
      { itemId: "caja_m", count: 5 },
    ],
    servicesSelected: ["mudanza_basica"],
    distanceKm: 6,
    hasElevatorOrigin: false,
    hasElevatorDest: true,
    floorOrigin: 1,
    floorDest: 3,
    scheduledDate: "2026-07-18",
    estimatedCost: 48000,
    status: "completed",
    notes: "Traslado simple y rápido realizado con éxito en el día de hoy.",
  },
];

export const MENDOZA_FAQ = [
  {
    q: "¿Qué incluye la tarifa estimada de mudanza?",
    a: "La tarifa estimada incluye el transporte en camión cerrado habilitado, combustible, peajes correspondientes al tramo, mantas protectoras básicas para los muebles y un chofer profesional. Si seleccionas servicios adicionales como Mudanza Premium o Embalaje, se incluye también el personal de fuerza correspondiente y los insumos como film stretch, cartón corrugado y cajas.",
  },
  {
    q: "¿Tengo que pedir un permiso especial para mudarme en Mendoza Capital?",
    a: "Sí, la Municipalidad de la Ciudad de Mendoza exige un permiso de carga y descarga si se va a interrumpir momentáneamente el tránsito o si el camión excede ciertas dimensiones. Nosotros nos encargamos de asesorarte y gestionar este permiso en caso de contratar la mudanza con nosotros, evitando multas municipales.",
  },
  {
    q: "¿Cómo calculo la distancia entre origen y destino?",
    a: "Nuestro cotizador interactivo calcula automáticamente una distancia promedio por ruta segura entre los departamentos de Mendoza seleccionados. Al formalizar tu mudanza, calcularemos la distancia exacta por GPS para darte el precio definitivo, el cual suele mantenerse muy cercano a nuestra cotización web.",
  },
  {
    q: "¿Tienen cobertura de seguro para mis pertenencias?",
    a: '¡Absolutamente! Todas nuestras mudanzas cuentan con una cobertura de seguro básica contra siniestros de tránsito, colisión o incendios durante el trayecto, provista por aseguradoras líderes de Argentina. Ofrecemos además un seguro premium opcional de "todo riesgo sobre bulto cerrado" para traslados de altísimo valor.',
  },
  {
    q: "¿Qué pasa si hay que subir cosas por escalera?",
    a: "Si en el origen o destino no hay ascensor disponible (o si el mueble no entra debido a sus dimensiones), y se debe trasladar por escalera, se cobra un pequeño adicional por piso. Por favor indícalo detalladamente en el cotizador dinámico para que la estimación sea 100% transparente.",
  },
];

export const CHECKLIST_STEPS = [
  {
    id: "check-1",
    category: "4 Semanas Antes",
    text: "Descartar o donar lo que no uses. Disminuye el volumen de tu traslado y ahorra dinero.",
  },
  {
    id: "check-2",
    category: "4 Semanas Antes",
    text: "Reunir documentos importantes (DNI, contratos, facturas de muebles) en una carpeta segura.",
  },
  {
    id: "check-3",
    category: "2 Semanas Antes",
    text: "Reservar el día de mudanza con nosotros. En Mendoza, los fines de semana de fin de mes son de alta demanda.",
  },
  {
    id: "check-4",
    category: "2 Semanas Antes",
    text: "Conseguir cajas resistentes de cartón, cinta de embalar ancha y pluriball. (O solicita nuestro combo de embalaje).",
  },
  {
    id: "check-5",
    category: "1 Semana Antes",
    text: "Empezar a embalar lo no esencial de las habitaciones secundarias. Rotular cada caja con el cuarto de destino.",
  },
  {
    id: "check-6",
    category: "1 Semana Antes",
    text: "Dar de baja o transferir servicios de internet, luz, gas y agua en el domicilio viejo.",
  },
  {
    id: "check-7",
    category: "3 Días Antes",
    text: "Descongelar y secar la heladera y el freezer para evitar goteos y malos olores en el camión.",
  },
  {
    id: "check-8",
    category: "3 Días Antes",
    text: "Asegurar el estacionamiento para el camión de mudanza frente a ambas viviendas.",
  },
  {
    id: "check-9",
    category: "Día de la Mudanza",
    text: 'Armar una "caja de supervivencia" para el primer día con cargadores, elementos de higiene, toallas y mudas de ropa.',
  },
  {
    id: "check-10",
    category: "Día de la Mudanza",
    text: "Hacer una recorrida final por todos los placares y alacenas de la casa vieja para asegurarte de no olvidar nada.",
  },
];

export const RECOMMENDED_COMPANIES: RecommendedCompany[] = [
  {
    id: "emp-mendoza-mza",
    name: "Mudanzas Mendoza Oficial",
    rating: 4.9,
    reviewsCount: 342,
    phone: "+54 261 455-8899",
    whatsappMessage:
      "Hola Mudanzas Mendoza, vi su recomendación en el portal y quiero cotizar una mudanza residendial local.",
    location: "Av. San Martín 1240, Godoy Cruz, Mendoza",
    specialties: [
      "Mudanza Hogar",
      "Izajes",
      "Mudanza Oficina",
      "Embalaje Vajilla",
    ],
    zones: ["Gran Mendoza", "Valle de Uco"],
    features: [
      "Habilitación Municipal",
      "Personal de Carga Seguro",
      "Sogas y Poleas Pro",
    ],
    isFeatured: true,
    minPrice: 85000,
    badge: "Líder del Gran Mendoza",
  },
  {
    id: "emp-miranda-mza",
    name: "Mudanzas Miranda Sucursal Mendoza",
    rating: 4.8,
    reviewsCount: 189,
    phone: "+54 11 5233-9800",
    whatsappMessage:
      "Hola Mudanzas Miranda Mendoza, vengo desde el portal y deseo un presupuesto para traslado interurbano / piano.",
    location: "Lateral Este Acceso Sur, Luján de Cuyo, Mendoza",
    specialties: [
      "Traslado Pianos",
      "Larga Distancia",
      "Mudanza Premium",
      "Guarda Muebles",
    ],
    zones: ["Gran Mendoza", "Zona Sur", "Valle de Uco"],
    features: [
      "Flota con GPS Satelital",
      "Habilitado CNRT RUTA",
      "Seguro Todo Riesgo",
    ],
    isFeatured: true,
    minPrice: 120000,
    badge: "Especialista en Pianos & Ruta",
  },
];
