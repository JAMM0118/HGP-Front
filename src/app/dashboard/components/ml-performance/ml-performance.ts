import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-ml-performance',
  imports: [CommonModule, NgChartsModule],
  templateUrl: './ml-performance.html',
})
export default class MlPerformance {
  metrics = [
    { name: 'RMSE', value: '23.4M COP', trend: -2.3, status: 'good', icon: 'activity' },
    { name: 'MAE', value: '18.7M COP', trend: -1.8, status: 'good', icon: 'activity' },
    { name: 'R² Score', value: '0.947', trend: +1.2, status: 'excellent', icon: 'check-circle' },
    { name: 'MAPE', value: '4.2%', trend: -0.5, status: 'good', icon: 'activity' }
  ];

  predictedVsActualData: any;
  residualsData: any;
  performanceOverTimeData: any;
  featureImportanceData: any;
  modelDriftData: any;

  scatterChartOptions: ChartConfiguration['options'] = {
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
      x: {
        title: { display: true, color: '#94a3b8' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, color: '#94a3b8' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Época', color: '#94a3b8' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, text: 'Puntuación R²', color: '#94a3b8' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        min: 0.6,
        max: 1.0
      }
    }
  };

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

  driftLineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' }, min: 0, max: 0.06 }
    }
  };

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    // Predicted vs Actual
    const predictedVsActual = [
      { x: 320, y: 315 }, { x: 425, y: 438 }, { x: 512, y: 505 }, { x: 398, y: 402 },
      { x: 645, y: 658 }, { x: 478, y: 472 }, { x: 892, y: 875 }, { x: 567, y: 582 },
      { x: 734, y: 728 }, { x: 456, y: 461 }, { x: 612, y: 598 }, { x: 789, y: 802 },
      { x: 534, y: 541 }, { x: 678, y: 665 }, { x: 823, y: 835 }
    ];

    this.predictedVsActualData = {
      datasets: [{
        data: predictedVsActual,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6'
      }]
    };

    // Residuals
    const residuals = predictedVsActual.map(d => ({
      x: d.y,
      y: d.y - d.x
    }));

    this.residualsData = {
      datasets: [{
        data: residuals,
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6'
      }]
    };

    // Performance Over Time
    this.performanceOverTimeData = {
      labels: [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      datasets: [
        {
          label: 'R² Entrenamiento',
          data: [0.652, 0.781, 0.842, 0.883, 0.911, 0.928, 0.939, 0.946, 0.951, 0.954, 0.957],
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.4
        },
        {
          label: 'R² Validación',
          data: [0.648, 0.775, 0.835, 0.874, 0.899, 0.915, 0.926, 0.934, 0.939, 0.943, 0.947],
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          tension: 0.4
        }
      ]
    };

    // Feature Importance
    this.featureImportanceData = {
      labels: ['Área (m²)', 'Puntuación de Ubicación', 'Tipo de Propiedad', 'Habitaciones', 'Baños'],
      datasets: [{
        data: [0.42, 0.28, 0.15, 0.09, 0.06],
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }]
    };

    // Model Drift
    this.modelDriftData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6', 'Semana 7', 'Semana 8'],
      datasets: [{
        label: 'Puntuación de Deriva',
        data: [0.02, 0.018, 0.025, 0.031, 0.028, 0.022, 0.019, 0.024],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4
      }]
    };
  }
}
