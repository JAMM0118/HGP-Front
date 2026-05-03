import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { NavigationItem } from '../../interfaces/models.interface';
import ExecutiveSummary from "../../components/executive-summary/executive-summary";
import PredictiveModelling from '../../components/predictive-modelling/predictive-modelling';
import ExploratoryAnalytics from "../../components/exploratory-analytics/exploratory-analytics";
import GeospatialIntelligence from "../../components/geospatial-intelligence/geospatial-intelligence";
import MlPerformance from "../../components/ml-performance/ml-performance";
import AiInsights from "../../components/ai-insights/ai-insights";
import DataTable from "../../components/data-table/data-table";

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ExecutiveSummary,
    PredictiveModelling,
    ExploratoryAnalytics,
    GeospatialIntelligence,
    MlPerformance,
    AiInsights,
    DataTable
  ],
  templateUrl: './home-component.html',
})
export default class HomeComponent {
    activeModule = 'executive';

  navigationItems: NavigationItem[] = [
    { id: 'executive', label: 'Resumen Ejecutivo', icon: 'layout-dashboard' },
    { id: 'analytics', label: 'Análisis de Datos', icon: 'bar-chart-3' },
    { id: 'geospatial', label: 'Inteligencia Geoespacial', icon: 'map' },
    { id: 'prediction', label: 'Modelado Predictivo', icon: 'brain' },
    { id: 'ml-performance', label: 'Rendimiento ML', icon: 'activity' },
    { id: 'insights', label: 'Insights de IA', icon: 'lightbulb' },
    { id: 'data-table', label: 'Registros de Datos', icon: 'table' }
  ];

  getCurrentModuleLabel(): string {
    const current = this.navigationItems.find(item => item.id === this.activeModule);
    return current ? current.label : '';
  }
}
