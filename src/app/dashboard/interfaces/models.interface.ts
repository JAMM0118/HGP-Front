export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}


export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}

export interface Property {
  id: string;
  area_construida: number;
  banos: number;
  estrato: number;
  garages: number;
  habitaciones: number;
  precio: number;
  propiedad: {
    tipo_propiedad:string,
    titulo: string,
    antiguedad: string;
    tipo_operacion: string,
    estado_construccion:string,
    antiguedad_categoria: string
  };
  tiempo: {
    anio: number;
    fecha: {date: string};
    mes: number;
  };
  ubicacion: {
    direccion: string;
    barrio: string;
    ciudad: string;
    region : string;
    localidad: string;
    zona: string;
  }
  predictedPrice?: number; // Para predicciones del modelo ML
  [key: string]: any; // Para campos dinámicos del backend
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertyResponse {
  items: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
}


export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  type: string;
  impact: string;
  confidence: number;
  icon: any;
  color: string;
}

export interface PredictionResult {
  price: string;
  lowerBound: string;
  upperBound: string;
  confidence: number;
  fecha: string;
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
