import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { KPI } from '../../interfaces/models.interface';
import { PropertyService } from '../../../services/property.service';
import {
  LucideAngularModule,
  House,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  CircleAlert
} from 'lucide-angular';

interface PropertyTypeData {
  type: string;
  count: string;
  percentage: number;
}

@Component({
  selector: 'app-executive-summary',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './executive-summary.html',

})
export default class ExecutiveSummary implements OnInit {
  readonly alertIcon = CircleAlert;
  readonly upTrendIcon = TrendingUp;
  readonly downTrendIcon = TrendingDown;

   isLoadingPropertyTypes = false;
  propertyTypesError = '';
  isLoadingStats = false;
  statsError = '';
  isLoadingRegionalData = false;
  regionalDataError = '';
  isLoadingNeighborhoods = false;
  neighborhoodsError = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadPropertyTypeDistribution();
    this.loadExecutiveSummaryStats();
    this.loadRegionalOverview();
    this.loadTopNeighborhoods();
  }

  kpis: KPI[] = [
    {
      title: 'Total Propiedades Analizadas',
      value: '...',
      change: '+12.3%',
      trend: 'up',
      icon: House
    },
    {
      title: 'Valor Promedio de Propiedad',
      value: '...',
      change: '+8.7%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Precio Promedio por m²',
      value: '...',
      change: '+5.4%',
      trend: 'up',
      icon: Activity
    },
    {
      title: 'Crecimiento del Mercado',
      value: '+14.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Precisión del Modelo',
      value: '94.7%',
      change: '+1.2%',
      trend: 'up',
      icon: Target
    },
    {
      title: 'Pronósticos Activos',
      value: '12,847',
      change: '+18.6%',
      trend: 'up',
      icon: Activity
    }
  ];

  regionalData: Array<{
    city: string;
    properties: string;
    avgPrice: string;
    growth: string;
  }> = [];

  topNeighborhoods: Array<{
    name: string;
    growth: string;
    avgPrice: string;
  }> = [];

  propertyTypes: PropertyTypeData[] = [];

  loadPropertyTypeDistribution() {
    this.isLoadingPropertyTypes = true;
    this.propertyTypesError = '';

    this.propertyService.getPropertyCountByType().subscribe({
      next: (response) => {
        const total = response.total_processed;

        // Convertir los datos del backend a formato para la UI
        this.propertyTypes = [
          {
            type: 'Apartamento',
            count: this.formatNumber(response.counts.apartamento),
            percentage: Math.round((response.counts.apartamento / total) * 100 * 10) / 10
          },
          {
            type: 'Casa',
            count: this.formatNumber(response.counts.casa),
            percentage: Math.round((response.counts.casa / total) * 100 * 10) / 10
          }
        ];

        this.isLoadingPropertyTypes = false;
      },
      error: (error) => {
        this.propertyTypesError = 'Error al cargar la distribución de propiedades';
        this.isLoadingPropertyTypes = false;
        console.error('Error loading property type distribution:', error);
      }
    });
  }

  formatNumber(num: number): string {
    return num.toLocaleString('es-CO');
  }

  loadExecutiveSummaryStats() {
    this.isLoadingStats = true;
    this.statsError = '';

    this.propertyService.getExecutiveSummaryStats().subscribe({
      next: (response) => {
        // Actualizar los primeros 3 KPIs con datos del backend
        // Total propiedades analizadas
        this.kpis[0].value = this.formatNumber(response.total_propiedades_analizadas);

        // Valor promedio de propiedad (convertir de pesos a millones)
        const valorPromedioMillones = response.valor_promedio_de_propiedad / 1000000;
        this.kpis[1].value = `$${valorPromedioMillones.toFixed(1)}M COP`;

        // Precio promedio por m² (convertir de pesos a millones)
        const precioM2Millones = response.precio_promedio_por_m2 / 1000000;
        this.kpis[2].value = `$${precioM2Millones.toFixed(2)}M COP`;

        this.isLoadingStats = false;
      },
      error: (error) => {
        this.statsError = 'Error al cargar estadísticas del resumen ejecutivo';
        this.isLoadingStats = false;
        console.error('Error loading executive summary stats:', error);

        // En caso de error, mantener valores por defecto
        this.kpis[0].value = 'N/A';
        this.kpis[1].value = 'N/A';
        this.kpis[2].value = 'N/A';
      }
    });
  }

  loadRegionalOverview() {
    this.isLoadingRegionalData = true;
    this.regionalDataError = '';

    this.propertyService.getRegionalOverview().subscribe({
      next: (response) => {
        // Convertir los datos del backend a formato para la UI
        this.regionalData = response.top_ciudades.map(ciudad => {
          // Capitalizar primera letra del nombre de la ciudad
          const cityName = ciudad.ciudad.charAt(0).toUpperCase() + ciudad.ciudad.slice(1);

          // Formatear cantidad de propiedades
          const properties = this.formatNumber(ciudad.cantidad_propiedades);

          // Convertir precio promedio de pesos a millones
          const avgPriceMillones = ciudad.precio_promedio_propiedades / 1000000;
          const avgPrice = `$${avgPriceMillones.toFixed(0)}M`;

          // Formatear crecimiento porcentual
          const growth = `+${ciudad.crecimiento_porcentual.toFixed(1)}%`;

          return {
            city: cityName,
            properties,
            avgPrice,
            growth
          };
        });

        this.isLoadingRegionalData = false;
      },
      error: (error) => {
        this.regionalDataError = 'Error al cargar panorama regional';
        this.isLoadingRegionalData = false;
        console.error('Error loading regional overview:', error);
      }
    });
  }

  loadTopNeighborhoods() {
    this.isLoadingNeighborhoods = true;
    this.neighborhoodsError = '';

    this.propertyService.getTopNeighborhoods().subscribe({
      next: (response) => {
        // Convertir los datos del backend a formato para la UI
        this.topNeighborhoods = response.top_barrios.map(barrio => {
          // Capitalizar primera letra del barrio
          const neighborhoodName = barrio.barrio.charAt(0).toUpperCase() + barrio.barrio.slice(1);

          // Capitalizar primera letra de la ciudad
          const cityName = barrio.ciudad.charAt(0).toUpperCase() + barrio.ciudad.slice(1);

          // Nombre completo: "Barrio, Ciudad"
          const name = `${neighborhoodName}, ${cityName}`;

          // Convertir precio promedio de pesos a millones
          const avgPriceMillones = barrio.precio_promedio / 1000000;
          const avgPrice = `$${avgPriceMillones.toFixed(0)}M`;

          // Formatear crecimiento porcentual
          const growth = `+${barrio.crecimiento_porcentual.toFixed(1)}%`;

          return {
            name,
            avgPrice,
            growth
          };
        });

        this.isLoadingNeighborhoods = false;
      },
      error: (error) => {
        this.neighborhoodsError = 'Error al cargar mejores barrios';
        this.isLoadingNeighborhoods = false;
        console.error('Error loading top neighborhoods:', error);
      }
    });
  }
}
