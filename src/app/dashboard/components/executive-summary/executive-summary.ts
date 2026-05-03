import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { KPI } from '../../interfaces/models.interface';

@Component({
  selector: 'app-executive-summary',
  imports: [CommonModule],
  templateUrl: './executive-summary.html',

})
export default class ExecutiveSummary {
 kpis: KPI[] = [
    {
      title: 'Total Propiedades Analizadas',
      value: '284,567',
      change: '+12.3%',
      trend: 'up',
      icon: 'home'
    },
    {
      title: 'Valor Promedio de Propiedad',
      value: '$456.2M COP',
      change: '+8.7%',
      trend: 'up',
      icon: 'dollar-sign'
    },
    {
      title: 'Precio Promedio por m²',
      value: '$4.82M COP',
      change: '+5.4%',
      trend: 'up',
      icon: 'activity'
    },
    {
      title: 'Crecimiento del Mercado',
      value: '+14.2%',
      change: '+2.1%',
      trend: 'up',
      icon: 'trending-up'
    },
    {
      title: 'Precisión del Modelo',
      value: '94.7%',
      change: '+1.2%',
      trend: 'up',
      icon: 'target'
    },
    {
      title: 'Pronósticos Activos',
      value: '12,847',
      change: '+18.6%',
      trend: 'up',
      icon: 'activity'
    }
  ];

  regionalData = [
    { city: 'Bogotá', properties: '98,234', avgPrice: '$512M', growth: '+15.2%' },
    { city: 'Medellín', properties: '67,891', avgPrice: '$438M', growth: '+12.8%' },
    { city: 'Cali', properties: '45,623', avgPrice: '$392M', growth: '+9.4%' },
    { city: 'Barranquilla', properties: '32,156', avgPrice: '$365M', growth: '+11.1%' }
  ];

  topNeighborhoods = [
    { name: 'Chapinero, Bogotá', growth: '+24.3%', avgPrice: '$628M' },
    { name: 'El Poblado, Medellín', growth: '+21.7%', avgPrice: '$592M' },
    { name: 'Granada, Cali', growth: '+18.9%', avgPrice: '$478M' },
    { name: 'El Prado, Barranquilla', growth: '+16.5%', avgPrice: '$445M' }
  ];

  propertyTypes = [
    { type: 'Apartamento', count: '156,234', percentage: 54.9 },
    { type: 'Casa', count: '89,456', percentage: 31.4 },
    { type: 'Penthouse', count: '23,678', percentage: 8.3 },
    { type: 'Estudio', count: '15,199', percentage: 5.4 }
  ];


}
