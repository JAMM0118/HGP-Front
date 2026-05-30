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
  titulo?: string;
  fechaActualizacion?: string;
  idPropiedad?: string;
  linkPropiedad?: string;
  tipoPropiedad?: string;
  tipoOperacion?: string;
  linkGoogleMaps?: string;
  direccion: string;
  ubicacionPrincipal?: string;
  estado?: string;
  ciudad: string;
  localidad?: string;
  comuna?: string;
  zona?: string;
  region?: string;
  barrios?: string;
  pisoN?: string;
  banos?: number;
  habitaciones?: number;
  garages?: number;
  areaConstruida?: number;
  antiguedad?: string;
  estrato?: number;
  precio?: number;
  estadoConstruccion?: string;
  antiguedadCategoria?: string;
  localidadDefi?: string;
  fechaCaptura?: string;
  predictedPrice?: number; // Para predicciones del modelo ML
  lastUpdated: string;
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
  limit: number;
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
