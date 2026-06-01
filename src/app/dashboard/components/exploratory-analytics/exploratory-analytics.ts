import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { PropertyService } from '../../../services/property.service';
import { LucideAngularModule, CircleAlert } from 'lucide-angular';
import { ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-exploratory-analytics',
  standalone: true,
  imports: [CommonModule, NgChartsModule, LucideAngularModule],
  templateUrl: './exploratory-analytics.html',
})
export default class ExploratoryAnalytics implements OnInit {
  readonly alertIcon = CircleAlert;

  Math = Math;

  // Loading states
  isLoadingPriceDistribution = false;
  priceDistributionError = '';
  isLoadingMarketTrends = false;
  marketTrendsError = '';
  isLoadingAreaComparison = false;
  areaComparisonError = '';
  isLoadingPriceByBedrooms = false;
  priceByBedroomsError = '';
  isLoadingPriceByArea = false;
  priceByAreaError = '';
  isLoadingCorrelation = false;
  correlationError = '';

  // Chart data
  priceDistributionData?: ChartData<'bar'>;
  timeSeriesData?: ChartData<'line'>;
  priceVsAreaData?: ChartData<'scatter'>;
  priceVsBedroomsData?: ChartData<'bar'>;
  propertyTypesData?: ChartData<'bar'>;

  @ViewChildren(BaseChartDirective)
  charts!: QueryList<BaseChartDirective>;

  @ViewChild('correlationMatrix')
  correlationMatrix!: ElementRef;

  @ViewChild('dashboardContainer')
  dashboardContainer!: ElementRef;

  constructor(private propertyService: PropertyService) { }

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
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Habitaciones', color: '#94a3b8' }
      },
      y: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Precio (M COP)', color: '#94a3b8' }
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
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      y: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Precio (M COP)', color: '#94a3b8' }
      },
      y1: {
        position: 'right',
        grid: { display: false },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Cantidad (x100)', color: '#94a3b8' }
      }
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

  groupedBarOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#e2e8f0' }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      y: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8' },
        title: { display: true, text: 'Cantidad de Propiedades', color: '#94a3b8' }
      }
    }
  };

  correlationData?: Array<{
    feature: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
  }>;

  ngOnInit() {
    this.loadPriceDistribution();
    this.loadMarketTrends();
    this.loadAreaComparison();
    this.loadPriceByBedrooms();
    this.loadPriceByArea();
    this.loadCorrelation();
  }

  loadPriceDistribution() {
    this.isLoadingPriceDistribution = true;
    this.priceDistributionError = '';

    this.propertyService.getPriceDistribution().subscribe({
      next: (response) => {
        // Transformar datos del backend a formato Chart.js
        this.priceDistributionData = {
          labels: ['0-200M', '200-400M', '400-600M', '600-800M', '800M-1B', '1B+'],
          datasets: [{
            data: [
              response.distribucion_precios['0-200_millones'],
              response.distribucion_precios['200-400_millones'],
              response.distribucion_precios['400-600_millones'],
              response.distribucion_precios['600-800_millones'],
              response.distribucion_precios['800_millones-1_billon'],
              response.distribucion_precios['1_billon_mas']
            ],
            backgroundColor: '#3b82f6',
            borderRadius: 8
          }]
        };

        this.isLoadingPriceDistribution = false;
      },
      error: (error) => {
        this.priceDistributionError = 'Error al cargar distribución de precios';
        this.isLoadingPriceDistribution = false;
        console.error('Error loading price distribution:', error);
      }
    });
  }

  loadMarketTrends() {
    this.isLoadingMarketTrends = true;
    this.marketTrendsError = '';

    this.propertyService.getMarketTrends().subscribe({
      next: (response) => {
        // Transformar datos del backend a formato Chart.js
        const labels: string[] = [];
        const preciosPromedioData: number[] = [];
        const cantidadPropiedadesData: number[] = [];

        response.tendencia_mercado.forEach(year => {
          const anio = year.anio;

          // Agregar punto de enero si existe
          if (year.enero !== null) {
            labels.push(`Ene ${anio.toString().slice(-2)}`);
            preciosPromedioData.push(year.enero / 1000000); // Convertir a millones
            cantidadPropiedadesData.push(year.cantidad_propiedades / 100); // Escalar para visualización
          }

          // Agregar punto de diciembre si existe
          if (year.diciembre !== null) {
            labels.push(`Dic ${anio.toString().slice(-2)}`);
            preciosPromedioData.push(year.diciembre / 1000000);
            cantidadPropiedadesData.push(year.cantidad_propiedades / 100);
          }
        });

        this.timeSeriesData = {
          labels: labels,
          datasets: [
            {
              label: 'Precio Prom. (M COP)',
              data: preciosPromedioData,
              borderColor: '#3b82f6',
              backgroundColor: '#3b82f6',
              tension: 0.4
            },
            {
              label: 'Cantidad de Propiedades (x100)',
              data: cantidadPropiedadesData,
              borderColor: '#8b5cf6',
              backgroundColor: '#8b5cf6',
              tension: 0.4,
              yAxisID: 'y1'
            }
          ]
        };

        this.isLoadingMarketTrends = false;
      },
      error: (error) => {
        this.marketTrendsError = 'Error al cargar tendencias del mercado';
        this.isLoadingMarketTrends = false;
        console.error('Error loading market trends:', error);
      }
    });
  }

  loadAreaComparison() {
    this.isLoadingAreaComparison = true;
    this.areaComparisonError = '';

    this.propertyService.getAreaComparison().subscribe({
      next: (response) => {
        // Extraer datos para casas y apartamentos en ambos rangos
        const menosDe100 = response.comparacion_area.menos_de_100;
        const masDe100 = response.comparacion_area.mas_de_100;

        // Buscar apartamentos en cada rango
        const aptMenos100 = menosDe100.por_tipo_propiedad.find(
          t => t.tipo_propiedad === 'apartamento'
        )?.cantidad || 0;
        const aptMas100 = masDe100.por_tipo_propiedad.find(
          t => t.tipo_propiedad === 'apartamento'
        )?.cantidad || 0;

        // Buscar casas en cada rango
        const casaMenos100 = menosDe100.por_tipo_propiedad.find(
          t => t.tipo_propiedad === 'casa'
        )?.cantidad || 0;
        const casaMas100 = masDe100.por_tipo_propiedad.find(
          t => t.tipo_propiedad === 'casa'
        )?.cantidad || 0;

        // Crear gráfica de barras agrupadas
        this.propertyTypesData = {
          labels: ['< 100 m²', '≥ 100 m²'],
          datasets: [
            {
              label: 'Apartamentos',
              data: [aptMenos100, aptMas100],
              backgroundColor: '#3b82f6',
              borderRadius: 8
            },
            {
              label: 'Casas',
              data: [casaMenos100, casaMas100],
              backgroundColor: '#8b5cf6',
              borderRadius: 8
            }
          ]
        };

        this.isLoadingAreaComparison = false;
      },
      error: (error) => {
        this.areaComparisonError = 'Error al cargar comparación de área';
        this.isLoadingAreaComparison = false;
        console.error('Error loading area comparison:', error);
      }
    });
  }

  loadPriceByBedrooms() {
    this.isLoadingPriceByBedrooms = true;
    this.priceByBedroomsError = '';

    this.propertyService.getPriceByBedrooms().subscribe({
      next: (response) => {
        // Ordenar por número de habitaciones
        const sortedData = response.comparacion_precio_habitaciones.sort(
          (a, b) => a.habitaciones - b.habitaciones
        );

        // Extraer labels (número de habitaciones)
        const labels = sortedData.map(item => item.habitaciones.toString());

        // Extraer precios promedio y convertir a millones
        const preciosPromedio = sortedData.map(item => item.precio_promedio / 1000000);

        this.priceVsBedroomsData = {
          labels: labels,
          datasets: [{
            data: preciosPromedio,
            backgroundColor: '#8b5cf6',
            borderRadius: 8
          }]
        };

        this.isLoadingPriceByBedrooms = false;
      },
      error: (error) => {
        this.priceByBedroomsError = 'Error al cargar precio por habitaciones';
        this.isLoadingPriceByBedrooms = false;
        console.error('Error loading price by bedrooms:', error);
      }
    });
  }

  loadPriceByArea() {
    this.isLoadingPriceByArea = true;
    this.priceByAreaError = '';

    this.propertyService.getPriceByArea().subscribe({
      next: (response) => {
        // Transformar datos a formato scatter plot
        // Usamos area_promedio como X y precio_promedio como Y
        const scatterData = response.comparacion_precio_area.map(item => ({
          x: item.area_promedio,
          y: item.precio_promedio / 1000000  // Convertir a millones
        }));

        this.priceVsAreaData = {
          datasets: [{
            data: scatterData,
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        };

        this.isLoadingPriceByArea = false;
      },
      error: (error) => {
        this.priceByAreaError = 'Error al cargar precio por área';
        this.isLoadingPriceByArea = false;
        console.error('Error loading price by area:', error);
      }
    });
  }

  loadCorrelation() {
    this.isLoadingCorrelation = true;
    this.correlationError = '';

    this.propertyService.getCorrelationData().subscribe({
      next: (response) => {
        // Extraer arrays de cada variable
        const precios = response.datos.map(d => d.precio);
        const habitaciones = response.datos.map(d => d.habitaciones);
        const banos = response.datos.map(d => d.banos);
        const areas = response.datos.map(d => d.area_construida);

        // Calcular matriz de correlación
        this.correlationData = [
          {
            feature: 'Precio',
            price: 1.0,
            bedrooms: this.calculateCorrelation(precios, habitaciones),
            bathrooms: this.calculateCorrelation(precios, banos),
            area: this.calculateCorrelation(precios, areas)
          },
          {
            feature: 'Habitaciones',
            price: this.calculateCorrelation(habitaciones, precios),
            bedrooms: 1.0,
            bathrooms: this.calculateCorrelation(habitaciones, banos),
            area: this.calculateCorrelation(habitaciones, areas)
          },
          {
            feature: 'Baños',
            price: this.calculateCorrelation(banos, precios),
            bedrooms: this.calculateCorrelation(banos, habitaciones),
            bathrooms: 1.0,
            area: this.calculateCorrelation(banos, areas)
          },
          {
            feature: 'Área',
            price: this.calculateCorrelation(areas, precios),
            bedrooms: this.calculateCorrelation(areas, habitaciones),
            bathrooms: this.calculateCorrelation(areas, banos),
            area: 1.0
          }
        ];

        this.isLoadingCorrelation = false;
      },
      error: (error) => {
        this.correlationError = 'Error al cargar matriz de correlación';
        this.isLoadingCorrelation = false;
        console.error('Error loading correlation data:', error);
      }
    });
  }

  /**
   * Calcula la correlación de Pearson entre dos arrays
   */
  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n === 0 || n !== y.length) return 0;

    // Calcular medias
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;

    // Calcular numerador y denominadores
    let numerator = 0;
    let sumSquaredX = 0;
    let sumSquaredY = 0;

    for (let i = 0; i < n; i++) {
      const deltaX = x[i] - meanX;
      const deltaY = y[i] - meanY;
      numerator += deltaX * deltaY;
      sumSquaredX += deltaX * deltaX;
      sumSquaredY += deltaY * deltaY;
    }

    // Calcular correlación
    const denominator = Math.sqrt(sumSquaredX * sumSquaredY);
    if (denominator === 0) return 0;

    return numerator / denominator;
  }

  getCorrelationClass(value: number): string {
    const baseClass = 'rounded h-12 flex items-center justify-center text-xs font-medium text-white ';
    if (value >= 0.8) return baseClass + 'bg-green-500';
    if (value >= 0.6) return baseClass + 'bg-blue-500';
    if (value >= 0.4) return baseClass + 'bg-yellow-500';
    return baseClass + 'bg-slate-700';
  }
  downloadChart(index: number, fileName: string): void {
    const chart = this.charts.toArray()[index];

    if (!chart?.chart?.canvas) {
      console.error('No se encontró la gráfica');
      return;
    }

    const canvas = chart.chart.canvas;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${fileName}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadAllCharts(): void {
    const charts = this.charts.toArray();

    charts.forEach((chart, index) => {
      if (!chart?.chart?.canvas) return;

      const link = document.createElement('a');

      link.href = chart.chart.canvas.toDataURL('image/png');
      link.download = `grafica-${index + 1}.png`;

      setTimeout(() => {
        link.click();
      }, index * 500);
    });
  }
  async downloadCorrelationMatrix() {
    const canvas = await html2canvas(
      this.correlationMatrix.nativeElement,
      {
        backgroundColor: '#0f172a',
        scale: 2
      }
    );

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'matriz-correlacion.png';
    link.click();
  }
  async exportDashboardToPdf(): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    let currentY = 20;

    pdf.setFontSize(18);
    pdf.text('Reporte de Analítica Inmobiliaria', margin, currentY);

    currentY += 15;

    const chartDescriptions = [
      {
        title: 'Distribución de Precios',
        description:
          'Muestra la cantidad de propiedades agrupadas por rangos de precio.'
      },
      {
        title: 'Tendencias del Mercado',
        description:
          'Presenta la evolución del precio promedio y la cantidad de propiedades entre 2022 y 2025.'
      },
      {
        title: 'Precio Promedio por Área Construida',
        description:
          'Permite analizar la relación entre el área construida y el precio promedio.'
      },
      {
        title: 'Precio Promedio por Habitaciones',
        description:
          'Compara el precio promedio según el número de habitaciones.'
      },
      {
        title: 'Comparación por Área Construida',
        description:
          'Compara la distribución de casas y apartamentos según el tamaño de construcción.'
      }
    ];

    const charts = this.charts.toArray();

    for (let i = 0; i < charts.length; i++) {

      const canvas = charts[i]?.chart?.canvas;

      if (!canvas) continue;

      const chartElement =
  canvas.parentElement as HTMLElement;

const chartCanvas = await html2canvas(
  chartElement,
  {
    scale: 4,
    backgroundColor: '#0f172a'
  }
);

      const image = chartCanvas.toDataURL('image/png');

      if (currentY > pageHeight - 120) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(14);
      pdf.text(chartDescriptions[i].title, margin, currentY);

      currentY += 6;

      pdf.setFontSize(10);

      const lines = pdf.splitTextToSize(
        chartDescriptions[i].description,
        pageWidth - 20
      );

      pdf.text(lines, margin, currentY);

      currentY += 10;

      pdf.addImage(
        image,
        'PNG',
        margin,
        currentY,
        180,
        80,
        undefined,
        'SLOW'
      );

      currentY += 90;
    }

    // MATRIZ DE CORRELACIÓN

    if (this.correlationMatrix?.nativeElement) {

      const matrixCanvas = await html2canvas(
        this.correlationMatrix.nativeElement,
        {
          scale: 2,
          backgroundColor: '#0f172a'
        }
      );

      const matrixImage = matrixCanvas.toDataURL('image/png');

      if (currentY > pageHeight - 120) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(14);
      pdf.text('Matriz de Correlación', margin, currentY);

      currentY += 6;

      pdf.setFontSize(10);

      const matrixDescription =
        'Representa el grado de relación entre las variables analizadas. Valores cercanos a 1 indican correlación positiva fuerte y valores cercanos a 0 indican poca relación.';

      const lines = pdf.splitTextToSize(
        matrixDescription,
        pageWidth - 20
      );

      pdf.text(lines, margin, currentY);

      currentY += 10;

      pdf.addImage(
        matrixImage,
        'PNG',
        margin,
        currentY,
        180,
        80,
        undefined,
        'SLOW'
      );
    }

    pdf.save('reporte-analitica-inmobiliaria.pdf');
  }
}
