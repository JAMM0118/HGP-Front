import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  BarChart3,
  Map,
  Brain,
  Activity,
  Lightbulb,
  Table,
  LogOut,
  CircleAlert
} from 'lucide-angular';
import DataTable from '../../components/data-table/data-table';
import AiInsights from '../../components/ai-insights/ai-insights';
import MlPerformance from '../../components/ml-performance/ml-performance';
import GeospatialIntelligence from '../../components/geospatial-intelligence/geospatial-intelligence';
import ExploratoryAnalytics from '../../components/exploratory-analytics/exploratory-analytics';
import ExecutiveSummary from '../../components/executive-summary/executive-summary';
import PredictiveModelling from '../../components/predictive-modelling/predictive-modelling';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  requiredRoles?: string[];
}

@Component({
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.html',
  styles: []
})
export default class DashboardComponent {
  activeModule = 'executive';
  currentUser: User | null = null;
  readonly logoutIcon = LogOut;
  readonly alertIcon = CircleAlert;

  navigationItems: NavigationItem[] = [
    { id: 'executive', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
    { id: 'analytics', label: 'Análisis de Datos', icon: BarChart3 },
    { id: 'geospatial', label: 'Inteligencia Geoespacial', icon: Map },
    { id: 'prediction', label: 'Modelado Predictivo', icon: Brain, requiredRoles: ['administrador', 'analista_datos'] },
    { id: 'ml-performance', label: 'Rendimiento ML', icon: Activity, requiredRoles: ['administrador', 'analista_datos'] },
    { id: 'insights', label: 'Insights del Dataset', icon: Lightbulb },
    { id: 'data-table', label: 'Registros de Datos', icon: Table }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  getAvailableNavItems(): NavigationItem[] {
    return this.navigationItems.filter(item => {
      if (!item.requiredRoles) return true;
      return this.authService.hasRole(item.requiredRoles);
    });
  }

  getCurrentModuleLabel(): string {
    const current = this.navigationItems.find(item => item.id === this.activeModule);
    return current ? current.label : '';
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    return this.currentUser.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getUserTypeLabel(): string {
    if (!this.currentUser) return '';

    const labels: Record<string, string> = {
      administrador: 'Administrador',
      analista_datos: 'Analista de Datos',
      invitado: 'Invitado'
    };
    console.log('User type:', this.currentUser.role);
    return labels[this.currentUser.role] || '';
  }

  getUserBadgeClass(): string {
    if (!this.currentUser) return '';
    const classes: Record<string, string> = {
      administrador: 'bg-blue-500/20 text-blue-400',
      analista_datos: 'bg-purple-500/20 text-purple-400',
      invitado: 'bg-green-500/20 text-green-400'
    };
    return classes[this.currentUser.role] || '';
  }

  isRestrictedModule(): boolean {
    const restrictedModules = ['prediction', 'ml-performance'];
    return restrictedModules.includes(this.activeModule);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
