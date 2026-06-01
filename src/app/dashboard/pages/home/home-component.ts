import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationItem } from '../../interfaces/models.interface';
import ExecutiveSummary from "../../components/executive-summary/executive-summary";
import PredictiveModelling from '../../components/predictive-modelling/predictive-modelling';
import ExploratoryAnalytics from "../../components/exploratory-analytics/exploratory-analytics";
import GeospatialIntelligence from "../../components/geospatial-intelligence/geospatial-intelligence";
import MlPerformance from "../../components/ml-performance/ml-performance";
import AiInsights from "../../components/ai-insights/ai-insights";
import DataTable from "../../components/data-table/data-table";
import {
  LucideAngularModule,
  LayoutDashboard,
  BarChart3,
  Map,
  Brain,
  Activity,
  Lightbulb,
  Table
} from 'lucide-angular';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ExecutiveSummary,
    PredictiveModelling,
    ExploratoryAnalytics,
    GeospatialIntelligence,
    MlPerformance,
    AiInsights,
    DataTable,
  ],
  templateUrl: './home-component.html',
})
export default class HomeComponent {
  activeModule = 'executive';

  readonly navigationItems: NavigationItem[] = [
    { id: 'executive', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
    { id: 'analytics', label: 'Análisis de Datos', icon: BarChart3 },
    { id: 'geospatial', label: 'Inteligencia Geoespacial', icon: Map },
    { id: 'prediction', label: 'Modelado Predictivo', icon: Brain },
    { id: 'ml-performance', label: 'Rendimiento ML', icon: Activity },
    { id: 'insights', label: 'Insights de IA', icon: Lightbulb },
    { id: 'data-table', label: 'Registros de Datos', icon: Table }
  ];

  getCurrentModuleLabel(): string {
    const current = this.navigationItems.find(item => item.id === this.activeModule);
    return current ? current.label : '';
  }
}
