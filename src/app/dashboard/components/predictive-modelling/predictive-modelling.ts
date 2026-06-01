import { Component } from '@angular/core';
import { PredictionResult } from '../../interfaces/models.interface';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { PredictionRequest, PredictionService } from '../../../services/prediction.service';
import { LucideAngularModule, Calculator, CircleAlert, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-predictive-modelling',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, LucideAngularModule],
  templateUrl: './predictive-modelling.html',
})
export default class PredictiveModelling {
  readonly calculatorIcon = Calculator;
  readonly alertIcon = CircleAlert;
  readonly trendIcon = TrendingUp;

  Math = Math;

  formData = {
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'apartamento',
    city: 'Bogotá'
  };

  prediction: PredictionResult | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private predictionService: PredictionService) {}

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
    // Validar campos
    if (!this.formData.area || !this.formData.bedrooms || !this.formData.bathrooms || !this.formData.city) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.prediction = null;

    // Preparar request para el backend
    const request: PredictionRequest = {
      area_construida: this.formData.area,
      habitaciones: this.formData.bedrooms,
      banos: this.formData.bathrooms,
      tipo_propiedad: this.formData.propertyType.toLowerCase(),
      ciudad: this.formData.city.toLowerCase()
    };

    // Llamar al servicio de predicción
    this.predictionService.getPrediction(request).subscribe({
      next: (response) => {
        // Convertir precio de COP a millones
        const priceInMillions = response.precio_estimado / 1000000;

        // Calcular intervalo de confianza (±8% del precio estimado)
        const lowerBound = priceInMillions * 0.92;
        const upperBound = priceInMillions * 1.08;

        this.prediction = {
          price: priceInMillions.toFixed(2),
          lowerBound: lowerBound.toFixed(2),
          upperBound: upperBound.toFixed(2),
          confidence: 94.7,
          fecha: response.fecha
        };

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Error al obtener la predicción. Por favor intenta nuevamente.';
        console.error('Error en predicción:', error);
      }
    });
  }
}
