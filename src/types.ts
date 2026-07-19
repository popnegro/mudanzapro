export interface Department {
  id: string;
  name: string;
  slug: string;
  baseRateMultiplier: number;
  featuredNeighborhoods: string[];
  description: string;
  movingStats: {
    monthlyVolume: number;
    avgCost: number;
    popularTime: string;
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number;
  priceDetail: string;
  features: string[];
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: 'living' | 'dormitorio' | 'cocina' | 'otros';
  volumePoints: number; // For volume calculation
}

export interface QuoteLead {
  id: string;
  createdAt: string;
  brand: 'mendoza' | 'miranda' | 'empresas';
  customerName: string;
  email: string;
  phone: string;
  originDept: string;
  destDept: string;
  moveSize: 'chico' | 'mediano' | 'grande';
  furnitureList: { itemId: string; count: number }[];
  servicesSelected: string[];
  distanceKm: number;
  hasElevatorOrigin: boolean;
  hasElevatorDest: boolean;
  floorOrigin: number;
  floorDest: number;
  scheduledDate: string;
  estimatedCost: number;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  notes?: string;
}

export interface BrandConfig {
  id: 'mendoza' | 'miranda' | 'empresas';
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  domain: string;
  phone: string;
  email: string;
  address: string;
  reviewCount: number;
  avgRating: number;
}

export interface RecommendedCompany {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  whatsappMessage: string;
  location: string;
  specialties: string[];
  zones: string[];
  features: string[];
  isFeatured: boolean;
  minPrice: number;
  badge?: string;
}

