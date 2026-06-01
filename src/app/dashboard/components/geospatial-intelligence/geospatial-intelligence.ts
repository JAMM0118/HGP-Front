import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegionalData } from '../../interfaces/models.interface';
import { LucideAngularModule, Filter, MapPin } from 'lucide-angular';
import { PropertyService } from '../../../services/property.service';


interface Neighborhood {
  name: string;
  city: string;
  avgPrice: number;
  growth: number;
  density: string;
}

interface HeatmapZone {
  zone: string;
  intensity: number;
  avgPrice: number;
  properties: number;
}

@Component({
  selector: 'app-geospatial-intelligence',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './geospatial-intelligence.html',
})
export default class GeospatialIntelligence implements OnInit {
  readonly filterIcon = Filter;
  readonly mapPinIcon = MapPin;
 loading = false;
  errorMessage = '';
  selectedCity = 'all';
  selectedNeighborhood = 'all';
  totalPropiedades = 0;

  regionalData: RegionalData[] = [];
  neighborhoods: Neighborhood[] = [];
  heatmapData: HeatmapZone[] = [];

  // Coordenadas aproximadas de ciudades colombianas para el mapa
  private cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
    'bogotá': { lat: 4.7, lon: -74.0 },
    'medellín': { lat: 6.2, lon: -75.6 },
    'cali': { lat: 3.4, lon: -76.5 },
    'barranquilla': { lat: 10.9, lon: -74.8 },
    'cartagena': { lat: 10.4, lon: -75.5 },
    'bucaramanga': { lat: 7.1, lon: -73.1 },
    'pereira': { lat: 4.8, lon: -75.7 },
    'manizales': { lat: 5.1, lon: -75.5 },
    'cúcuta': { lat: 7.9, lon: -72.5 },
    'ibagué': { lat: 4.4, lon: -75.2 },
    'santa marta': { lat: 11.2, lon: -74.2 },
    'villavicencio': { lat: 4.1, lon: -73.6 },
    'pasto': { lat: 1.2, lon: -77.3 },
    'montería': { lat: 8.7, lon: -75.9 },
    'valledupar': { lat: 10.5, lon: -73.3 }
  };

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadGeospatialData();
  }

  loadGeospatialData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyService.getGeospatialData().subscribe({
      next: (response) => {
        this.loading = false;
        this.totalPropiedades = response.total_propiedades_analizadas;

        // Transform ciudades_cluster to regionalData
        this.regionalData = response.ciudades_cluster.slice(0, 10).map((ciudad, index) => {
          const cityName = ciudad.ciudad.toLowerCase();
          const coords = this.getCityCoordinates(cityName);
          const color = this.getColorByScore(ciudad.score_cluster);
          const size = this.getSizeByProperties(ciudad.cantidad_propiedades);

          return {
            region: this.capitalizeCity(ciudad.ciudad),
            lat: coords.lat,
            lon: coords.lon,
            avgPrice: parseFloat((ciudad.precio_promedio / 1000000).toFixed(0)),
            properties: ciudad.cantidad_propiedades,
            growth: parseFloat(ciudad.crecimiento_porcentual.toFixed(1)),
            color: color,
            size: size
          };
        });

        // Transform mejores_barrios to neighborhoods
        this.neighborhoods = response.mejores_barrios.slice(0, 8).map(barrio => ({
          name: barrio.barrio,
          city: this.capitalizeCity(barrio.ciudad),
          avgPrice: parseFloat((barrio.precio_promedio / 1000000).toFixed(0)),
          growth: parseFloat(barrio.crecimiento_porcentual.toFixed(1)),
          density: this.getDensityByScore(barrio.score_cluster)
        }));

        // Transform analisis_porcentual_mapa_calor to heatmapData
        const mapa = response.analisis_porcentual_mapa_calor;
        this.heatmapData = [
          {
            zone: `Precio Alto (${mapa.alto.rango})`,
            intensity: mapa.alto.porcentaje / 100,
            avgPrice: 600, // Estimated
            properties: mapa.alto.cantidad
          },
          {
            zone: `Precio Medio (${mapa.medio.rango})`,
            intensity: mapa.medio.porcentaje / 100,
            avgPrice: 450, // Estimated
            properties: mapa.medio.cantidad
          },
          {
            zone: `Precio Bajo (${mapa.bajo.rango})`,
            intensity: mapa.bajo.porcentaje / 100,
            avgPrice: 300, // Estimated
            properties: mapa.bajo.cantidad
          }
        ];
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || error.message || 'Error al cargar datos geoespaciales';
        console.error('Error loading geospatial data:', error);
      }
    });
  }

  private getCityCoordinates(cityName: string): { lat: number; lon: number } {
    // Try exact match
    if (this.cityCoordinates[cityName]) {
      return this.cityCoordinates[cityName];
    }

    // Try partial match (for compound city names like "chía - soacha")
    for (const key in this.cityCoordinates) {
      if (cityName.includes(key)) {
        return this.cityCoordinates[key];
      }
    }

    // Default to center of Colombia
    return { lat: 4.5, lon: -74.0 };
  }

  private capitalizeCity(city: string): string {
    return city.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  private getColorByScore(score: number): string {
    if (score >= 0.35) return '#ef4444'; // Red - highest score
    if (score >= 0.30) return '#f59e0b'; // Orange
    if (score >= 0.25) return '#3b82f6'; // Blue
    if (score >= 0.20) return '#8b5cf6'; // Purple
    if (score >= 0.15) return '#10b981'; // Green
    return '#06b6d4'; // Cyan - lowest score
  }

  private getSizeByProperties(properties: number): string {
    if (properties >= 10000) return 'large';
    if (properties >= 1000) return 'medium';
    return 'small';
  }

  private getDensityByScore(score: number): string {
    if (score >= 0.30) return 'high';
    if (score >= 0.20) return 'medium';
    return 'low';
  }

  getMarkerSize(size: string): number {
    return size === 'large' ? 40 : size === 'medium' ? 30 : 20;
  }

  getOpacity(growth: number): number {
    return 0.3 + (growth / 25) * 0.7;
  } }
