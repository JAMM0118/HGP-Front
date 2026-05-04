import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-exploratory-analytics',
  imports: [CommonModule, NgChartsModule],
  templateUrl: './exploratory-analytics.html',
})
export default class ExploratoryAnalytics {
  Math = Math;

  // Chart data
  priceDistributionData!: ChartData<'bar'>;
  timeSeriesData!: ChartData<'line'>;
  priceVsAreaData!: ChartData<'scatter'>;
  priceVsBedroomsData!: ChartData<'bar'>;
  propertyTypesData!: ChartData<'bar'>;

  // Chart options
  barChartOptions: ChartConfiguration['options'] = {
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
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
    }
  };

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
        title: { display: true, text: 'Área (m²)', color: '#94a3b8' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        title: { display: true, text: 'Precio (M COP)', color: '#94a3b8' },
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' }
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

  correlationData = [
    { feature: 'Área', price: 0.87, bedrooms: 0.72, bathrooms: 0.68, location: 0.45 },
    { feature: 'Habitaciones', price: 0.72, bedrooms: 1.0, bathrooms: 0.83, location: 0.38 },
    { feature: 'Baños', price: 0.68, bedrooms: 0.83, bathrooms: 1.0, location: 0.35 },
    { feature: 'Ubicación', price: 0.45, bedrooms: 0.38, bathrooms: 0.35, location: 1.0 }
  ];

  ngOnInit() {
    this.initializeCharts();
  }

  initializeCharts() {
    // Price Distribution
    this.priceDistributionData = {
      labels: ['0-200M', '200-400M', '400-600M', '600-800M', '800M-1B', '1B+'],
      datasets: [{
        data: [45234, 89567, 67891, 42356, 23678, 15841],
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }]
    };

    // Time Series
    this.timeSeriesData = {
      labels: ['Ene 22', 'Abr 22', 'Jul 22', 'Oct 22', 'Ene 23', 'Abr 23', 'Jul 23', 'Oct 23', 'Ene 24', 'Abr 24', 'Jul 24', 'Oct 24', 'Ene 25'],
      datasets: [
        {
          label: 'Precio Prom. (M COP)',
          data: [398, 405, 412, 418, 425, 431, 438, 445, 452, 459, 466, 473, 481],
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.4
        },
        {
          label: 'Volumen de Transacciones',
          data: [18456, 19234, 20123, 21456, 22678, 23891, 24567, 25234, 26123, 27456, 28891, 29678, 30567].map(v => v / 100),
          borderColor: '#8b5cf6',
          backgroundColor: '#8b5cf6',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    // Price vs Area
    this.priceVsAreaData = {
      datasets: [{
        data: [
          { x: 45, y: 198 }, { x: 52, y: 225 }, { x: 68, y: 289 },
          { x: 75, y: 312 }, { x: 82, y: 345 }, { x: 95, y: 398 },
          { x: 108, y: 445 }, { x: 120, y: 492 }, { x: 135, y: 548 },
          { x: 150, y: 612 }, { x: 168, y: 678 }, { x: 185, y: 745 },
          { x: 205, y: 825 }, { x: 230, y: 912 }, { x: 255, y: 998 }
        ],
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6'
      }]
    };

    // Price vs Bedrooms
    this.priceVsBedroomsData = {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        data: [245, 378, 512, 678, 845],
        backgroundColor: '#8b5cf6',
        borderRadius: 8
      }]
    };

    // Property Types
    this.propertyTypesData = {
      labels: ['Apartamento', 'Casa', 'Penthouse', 'Estudio'],
      datasets: [{
        data: [156234, 89456, 23678, 15199],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
        borderRadius: 8
      }]
    };
  }

  getCorrelationClass(value: number): string {
    const baseClass = 'rounded h-12 flex items-center justify-center text-xs font-medium text-white ';
    if (value >= 0.8) return baseClass + 'bg-green-500';
    if (value >= 0.6) return baseClass + 'bg-blue-500';
    if (value >= 0.4) return baseClass + 'bg-yellow-500';
    return baseClass + 'bg-slate-700';
  }
 }
