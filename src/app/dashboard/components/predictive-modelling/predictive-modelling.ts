import {Component } from '@angular/core';
import { PredictionResult } from '../../interfaces/models.interface';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import {FormsModule} from "@angular/forms";
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-predictive-modelling',
  imports: [CommonModule, FormsModule,NgChartsModule],
  templateUrl: './predictive-modelling.html',
})
export default class PredictiveModelling {
  Math = Math;

  formData = {
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'apartment',
    city: 'bogota',
    neighborhood: 'chapinero'
  };

  prediction: PredictionResult | null = null;

  featureImportanceData: any;
  horizontalBarOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
    }
  };

  shapValues = [
    { feature: 'Área', impact: 167.4, direction: 'positive' },
    { feature: 'Ubicación', impact: 89.2, direction: 'positive' },
    { feature: 'Tipo', impact: 45.8, direction: 'positive' },
    { feature: 'Habitaciones', impact: 28.3, direction: 'positive' },
    { feature: 'Baños', impact: 12.1, direction: 'positive' },
    { feature: 'Antigüedad', impact: -15.4, direction: 'negative' }
  ];

  ngOnInit() {
    this.updateFeatureImportance();
  }

  updateFeatureImportance() {
    this.featureImportanceData = {
      labels: ['Área (m²)', 'Ubicación', 'Tipo de Propiedad', 'Habitaciones', 'Baños'],
      datasets: [{
        data: [0.42, 0.28, 0.15, 0.09, 0.06],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        borderRadius: 8
      }]
    };
  }

  handlePredict() {
    const basePrice = 280;
    const areaFactor = this.formData.area * 4.2;
    const bedroomFactor = this.formData.bedrooms * 35;
    const bathroomFactor = this.formData.bathrooms * 28;
    const cityMultiplier = this.formData.city === 'bogota' ? 1.15 : this.formData.city === 'medellin' ? 1.08 : 1.0;
    const typeMultiplier =
      this.formData.propertyType === 'penthouse' ? 1.35 : this.formData.propertyType === 'house' ? 1.12 : 1.0;

    const predictedPrice = (basePrice + areaFactor + bedroomFactor + bathroomFactor) * cityMultiplier * typeMultiplier;
    const lowerBound = predictedPrice * 0.92;
    const upperBound = predictedPrice * 1.08;

    this.prediction = {
      price: predictedPrice.toFixed(2),
      lowerBound: lowerBound.toFixed(2),
      upperBound: upperBound.toFixed(2),
      confidence: 94.7
    };
  }
}
