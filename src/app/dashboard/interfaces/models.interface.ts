export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}


export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  neighborhood: string;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  predictedPrice: number;
  yearBuilt: number;
  lastUpdated: string;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  type: string;
  impact: string;
  confidence: number;
  icon: string;
  color: string;
}

export interface PredictionResult {
  price: string;
  lowerBound: string;
  upperBound: string;
  confidence: number;
}

export interface RegionalData {
  region: string;
  lat: number;
  lon: number;
  avgPrice: number;
  properties: number;
  growth: number;
  color: string;
  size: string;
}