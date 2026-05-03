import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegionalData } from '../../interfaces/models.interface';

@Component({
  selector: 'app-geospatial-intelligence',
  imports: [CommonModule, FormsModule],
  templateUrl: './geospatial-intelligence.html',
})
export default class GeospatialIntelligence {
  selectedCity = 'all';
  selectedNeighborhood = 'all';

  regionalData: RegionalData[] = [
    {
      region: 'Bogotá',
      lat: 4.7,
      lon: -74.0,
      avgPrice: 512,
      properties: 98234,
      growth: 15.2,
      color: '#ef4444',
      size: 'large'
    },
    {
      region: 'Medellín',
      lat: 6.2,
      lon: -75.6,
      avgPrice: 438,
      properties: 67891,
      growth: 12.8,
      color: '#3b82f6',
      size: 'large'
    },
    {
      region: 'Cali',
      lat: 3.4,
      lon: -76.5,
      avgPrice: 392,
      properties: 45623,
      growth: 9.4,
      color: '#8b5cf6',
      size: 'medium'
    },
    {
      region: 'Barranquilla',
      lat: 10.9,
      lon: -74.8,
      avgPrice: 365,
      properties: 32156,
      growth: 11.1,
      color: '#f59e0b',
      size: 'medium'
    },
    {
      region: 'Cartagena',
      lat: 10.4,
      lon: -75.5,
      avgPrice: 425,
      properties: 18934,
      growth: 13.6,
      color: '#10b981',
      size: 'small'
    },
    {
      region: 'Bucaramanga',
      lat: 7.1,
      lon: -73.1,
      avgPrice: 348,
      properties: 14567,
      growth: 8.9,
      color: '#06b6d4',
      size: 'small'
    }
  ];

  neighborhoods = [
    { name: 'Chapinero', city: 'Bogotá', avgPrice: 628, growth: 24.3, density: 'high' },
    { name: 'Usaquén', city: 'Bogotá', avgPrice: 585, growth: 19.7, density: 'high' },
    { name: 'El Poblado', city: 'Medellín', avgPrice: 592, growth: 21.7, density: 'high' },
    { name: 'Laureles', city: 'Medellín', avgPrice: 468, growth: 15.4, density: 'medium' },
    { name: 'Granada', city: 'Cali', avgPrice: 478, growth: 18.9, density: 'medium' },
    { name: 'San Fernando', city: 'Cali', avgPrice: 412, growth: 12.3, density: 'medium' },
    { name: 'El Prado', city: 'Barranquilla', avgPrice: 445, growth: 16.5, density: 'medium' },
    { name: 'Alto Prado', city: 'Barranquilla', avgPrice: 398, growth: 13.8, density: 'low' }
  ];

  heatmapData = [
    { zone: 'North Bogotá', intensity: 0.95, avgPrice: 645, properties: 12456 },
    { zone: 'Central Bogotá', intensity: 0.88, avgPrice: 512, properties: 18934 },
    { zone: 'South Bogotá', intensity: 0.62, avgPrice: 398, properties: 9876 },
    { zone: 'East Medellín', intensity: 0.91, avgPrice: 578, properties: 8734 },
    { zone: 'West Medellín', intensity: 0.74, avgPrice: 445, properties: 11234 },
    { zone: 'North Cali', intensity: 0.79, avgPrice: 492, properties: 6789 },
    { zone: 'South Cali', intensity: 0.68, avgPrice: 368, properties: 5432 }
  ];

  getMarkerSize(size: string): number {
    return size === 'large' ? 40 : size === 'medium' ? 30 : 20;
  }

  getOpacity(growth: number): number {
    return 0.3 + (growth / 25) * 0.7;
  }
 }
