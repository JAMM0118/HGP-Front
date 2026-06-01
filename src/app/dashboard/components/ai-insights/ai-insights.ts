import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PropertyService } from '../../../services/property.service'
import { Insight } from '../../interfaces/models.interface';

import { LucideAngularModule, TrendingUp, DollarSign, AlertTriangle, Target, MapPin, ChevronRight, Lightbulb } from 'lucide-angular';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ai-insights.html',
})
export default class AiInsights implements OnInit {
   readonly chevronRightIcon = ChevronRight;
  readonly lightbulbIcon = Lightbulb;
  readonly targetIcon = Target;
  readonly alertIcon = AlertTriangle;
  readonly mapPinIcon = MapPin;
  readonly trendingUpIcon = TrendingUp;
  readonly dollarSignIcon = DollarSign;
  loading = false;
  errorMessage = '';
  totalCiudades = 0;

  insights: Insight[] = [];
  recommendations: Array<{ title: string; description: string; priority: string; action: string }> = [];
  opportunityAlerts: Array<{ property: string; currentPrice: number; predictedPrice: number; upside: number; confidence: number }> = [];
  riskIndicators: Array<{ factor: string; level: string; score: number; color: string }> = [];
  marketTrends: Array<{ trend: string; change: string; description: string; icon: any }> = [];

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadInsights();
  }

  loadInsights(): void {
    this.loading = true;
    this.errorMessage = '';

    this.propertyService.getDatasetInsights().subscribe({
      next: (response) => {
        this.loading = false;
        this.totalCiudades = response.total_ciudades_analizadas;

        // Transform insights data to display cards
        this.insights = [];
        let insightId = 1;

        // Zona de crecimiento fuerte
        if (response.insights.zona_crecimiento_fuerte) {
          const z = response.insights.zona_crecimiento_fuerte;
          this.insights.push({
            id: insightId++,
            title: `Fuerte Crecimiento: ${z.ciudad}`,
            description: `${z.cantidad_propiedades} propiedades con precio promedio de $${(z.precio_promedio / 1000000).toFixed(1)}M y crecimiento de ${z.crecimiento_porcentual.toFixed(1)}% (${z.primer_anio}-${z.ultimo_anio}). Precio por m²: $${z.precio_promedio_por_m2.toFixed(0)}.`,
            type: 'trend',
            impact: 'alto',
            confidence: 96,
            icon: 'trending-up',
            color: 'green'
          });
        }

        // Propiedades subvaloradas (tomar las primeras 3)
        if (response.insights.propiedades_subvaloradas && response.insights.propiedades_subvaloradas.length > 0) {
          const sub = response.insights.propiedades_subvaloradas[0];
          this.insights.push({
            id: insightId++,
            title: `Oportunidades en ${sub.ciudad}`,
            description: `${sub.cantidad_propiedades} propiedades identificadas con precio promedio de $${(sub.precio_promedio / 1000000).toFixed(1)}M y precio por m² de $${sub.precio_promedio_por_m2.toFixed(0)}. Volatilidad: ${sub.volatilidad.toFixed(2)}.`,
            type: 'opportunity',
            impact: 'alto',
            confidence: 89,
            icon: 'dollar-sign',
            color: 'blue'
          });
        }

        // Volatilidad de precios
        if (response.insights.volatilidad_precios) {
          const v = response.insights.volatilidad_precios;
          this.insights.push({
            id: insightId++,
            title: `Alerta de Volatilidad: ${v.ciudad}`,
            description: `${v.cantidad_propiedades} propiedades con volatilidad de ${v.volatilidad.toFixed(2)}. Precio promedio: $${(v.precio_promedio / 1000000).toFixed(1)}M. Crecimiento: ${v.crecimiento_porcentual.toFixed(1)}% (${v.primer_anio}-${v.ultimo_anio}).`,
            type: 'risk',
            impact: 'medio',
            confidence: 92,
            icon: 'alert-triangle',
            color: 'amber'
          });
        }

        // Mercado emergente
        if (response.insights.mercado_emergente) {
          const m = response.insights.mercado_emergente;
          this.insights.push({
            id: insightId++,
            title: `Mercado Emergente: ${m.ciudad}`,
            description: `${m.cantidad_propiedades} propiedades con crecimiento de ${m.crecimiento_porcentual.toFixed(1)}% (${m.primer_anio}-${m.ultimo_anio}). Precio promedio: $${(m.precio_promedio / 1000000).toFixed(1)}M. Volatilidad: ${m.volatilidad.toFixed(2)}.`,
            type: 'opportunity',
            impact: 'medio',
            confidence: 84,
            icon: 'target',
            color: 'purple'
          });
        }

        // Recomendaciones de inversión
        this.recommendations = response.insights.recomendaciones_inversion.slice(0, 3).map((rec, index) => ({
          title: `Recomendación ${index + 1}`,
          description: rec,
          priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
          action: 'Ver detalles'
        }));

        // Opportunity alerts (usar propiedades subvaloradas)
        this.opportunityAlerts = response.insights.propiedades_subvaloradas.slice(0, 3).map(sub => ({
          property: sub.ciudad,
          currentPrice: parseFloat((sub.precio_promedio / 1000000).toFixed(0)),
          predictedPrice: parseFloat(((sub.precio_promedio * 1.15) / 1000000).toFixed(0)),
          upside: 15,
          confidence: 85
        }));

        // Risk indicators (estáticos por ahora)
        this.riskIndicators = [
          { factor: 'Liquidez del Mercado', level: 'Riesgo Bajo', score: 85, color: 'green' },
          { factor: 'Volatilidad de Precios', level: 'Riesgo Medio', score: 62, color: 'amber' },
          { factor: 'Indicadores Económicos', level: 'Riesgo Bajo', score: 78, color: 'green' },
          { factor: 'Balance Oferta-Demanda', level: 'Riesgo Bajo', score: 81, color: 'green' }
        ];

        // Market trends (usar tendencias generales)
        this.marketTrends = response.insights.tendencias_generales.slice(0, 3).map((trend, index) => ({
          trend: `Tendencia ${index + 1}`,
          change: trend.includes('crecimiento') ? '+12.5%' : trend.includes('caída') ? '-8.3%' : 'Estable',
          description: trend,
          icon: index === 0 ? this.trendingUpIcon : index === 1 ? this.targetIcon : this.mapPinIcon
        }));
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || error.message || 'Error al cargar insights del dataset';
        console.error('Error loading insights:', error);
      }
    });
  }

  getInsightClasses(color: string): string {
    const baseClasses = ' border rounded-xl p-6 ';
    const colorMap: Record<string, string> = {
      green: 'bg-green-900/20 border-green-700/50',
      blue: 'bg-blue-900/20 border-blue-700/50',
      amber: 'bg-amber-900/20 border-amber-700/50',
      purple: 'bg-purple-900/20 border-purple-700/50'
    };
    return baseClasses + colorMap[color];
  }

  getIconClass(color: string): string {
    const colorMap: Record<string, string> = {
      green: 'text-green-400',
      blue: 'text-blue-400',
      amber: 'text-amber-400',
      purple: 'text-purple-400'
    };
    return colorMap[color];
  }

  getBadgeClass(color: string): string {
    const colorMap: Record<string, string> = {
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      amber: 'bg-amber-500/20 text-amber-400',
      purple: 'bg-purple-500/20 text-purple-400'
    };
    return colorMap[color];
  }

  getPriorityClass(priority: string): string {
    const priorityMap: Record<string, string> = {
      high: 'bg-red-500/20 text-red-400 border-red-500/50',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    };
    return priorityMap[priority];
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      high: 'ALTA',
      medium: 'MEDIA',
      low: 'BAJA'
    };
    return labels[priority];
  }

  getGradientClass(color: string): string {
    const gradientMap: Record<string, string> = {
      green: 'from-green-600 to-green-400',
      amber: 'from-amber-600 to-amber-400',
      red: 'from-red-600 to-red-400'
    };
    return gradientMap[color];
  }
 }
