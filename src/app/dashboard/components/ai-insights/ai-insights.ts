import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Insight } from '../../interfaces/models.interface';

@Component({
  selector: 'app-ai-insights',
  imports: [CommonModule],
  templateUrl: './ai-insights.html',
})
export default class AiInsights {
  insights: Insight[] = [
    {
      id: 1,
      title: 'Fuerte Crecimiento en la Zona Norte de Bogotá',
      description: 'Los valores de propiedades en los barrios del norte de Bogotá han aumentado un 24.3% en los últimos 6 meses, superando significativamente el promedio de la ciudad de 15.2%. Chapinero y Usaquén lideran esta tendencia.',
      type: 'trend',
      impact: 'alto',
      confidence: 96,
      icon: 'trending-up',
      color: 'green'
    },
    {
      id: 2,
      title: 'Propiedades Subvaloradas en Medellín',
      description: 'El análisis de aprendizaje automático identifica 234 propiedades en el barrio Laureles actualmente con precios 12-18% por debajo del valor de mercado predicho. Estas representan oportunidades potenciales de inversión.',
      type: 'opportunity',
      impact: 'alto',
      confidence: 89,
      icon: 'dollar-sign',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Alerta de Volatilidad de Precios: Cartagena',
      description: 'Las áreas turísticas en Cartagena muestran una mayor volatilidad de precios (±8.4% de varianza). Esto es 3 veces más alto que el promedio nacional. Considere los patrones estacionales antes de invertir.',
      type: 'risk',
      impact: 'medio',
      confidence: 92,
      icon: 'alert-triangle',
      color: 'amber'
    },
    {
      id: 4,
      title: 'Mercado Emergente: Bucaramanga',
      description: 'Bucaramanga muestra indicadores tempranos de aceleración del mercado. Volumen de transacciones aumentó un 28% con crecimiento de precios del 8.9%. Patrón similar a la fase de crecimiento de Medellín (2018-2020).',
      type: 'opportunity',
      impact: 'medio',
      confidence: 84,
      icon: 'target',
      color: 'purple'
    }
  ];

  recommendations = [
    {
      title: 'Enfoque de Inversión: Apartamentos Premium',
      description: 'Los apartamentos de 3 habitaciones en Chapinero y El Poblado muestran el mayor potencial de ROI (18-22% anual).',
      priority: 'high',
      action: 'Revisar 47 propiedades coincidentes'
    },
    {
      title: 'Diversificación de Portafolio',
      description: 'Considere expandirse a Cali para reducir el riesgo de concentración geográfica.',
      priority: 'medium',
      action: 'Explorar mercado de Cali'
    },
    {
      title: 'Reentrenamiento del Modelo Recomendado',
      description: 'Se detectaron nuevos patrones de datos en ciudades costeras. Reentrenar modelo para mejorar precisión.',
      priority: 'low',
      action: 'Programar reentrenamiento'
    }
  ];

  opportunityAlerts = [
    { property: 'Penthouse, Chapinero', currentPrice: 892, predictedPrice: 1045, upside: 17.2, confidence: 94 },
    { property: 'Apartamento, El Poblado', currentPrice: 567, predictedPrice: 648, upside: 14.3, confidence: 91 },
    { property: 'Casa, Usaquén', currentPrice: 734, predictedPrice: 825, upside: 12.4, confidence: 88 }
  ];

  riskIndicators = [
    { factor: 'Liquidez del Mercado', level: 'Riesgo Bajo', score: 85, color: 'green' },
    { factor: 'Volatilidad de Precios', level: 'Riesgo Medio', score: 62, color: 'amber' },
    { factor: 'Indicadores Económicos', level: 'Riesgo Bajo', score: 78, color: 'green' },
    { factor: 'Balance Oferta-Demanda', level: 'Riesgo Bajo', score: 81, color: 'green' }
  ];

  marketTrends = [
    { trend: 'Crecimiento Segmento Lujo', change: '+19.4%', description: 'Propiedades >$800M mostrando fuerte impulso', icon: 'trending-up' },
    { trend: 'Aumento Demanda de Estudios', change: '+32.1%', description: 'Profesionales jóvenes impulsan mercado de estudios', icon: 'target' },
    { trend: 'Prima Costera', change: '+15.8%', description: 'Propiedades de playa con mayores primas', icon: 'map-pin' }
  ];

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
