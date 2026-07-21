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

export type FurnitureCategory = "living" | "dormitorio" | "cocina" | "otros";
export type BrandId = "mendoza" | "miranda" | "empresas";
export type MoveSize = "chico" | "mediano" | "grande";
export type LeadStatus = "new" | "contacted" | "completed" | "cancelled";

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  volumePoints: number; // For volume calculation
}

export interface QuoteLead {
  id: string;
  createdAt: string;
  brand: BrandId;
  customerName: string;
  email: string;
  phone: string;
  originDept: string;
  destDept: string;
  originAddress?: string;
  destinationAddress?: string;
  moveSize: MoveSize;
  furnitureList: { itemId: string; count: number }[];
  servicesSelected: string[];
  distanceKm: number;
  hasElevatorOrigin: boolean;
  hasElevatorDest: boolean;
  floorOrigin: number;
  floorDest: number;
  scheduledDate: string;
  estimatedCost: number;
  status: LeadStatus;
  notes?: string;
}

export interface BrandConfig {
  id: BrandId;
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
