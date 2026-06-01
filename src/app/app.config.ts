import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
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
  CircleAlert,
  House,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  CircleCheck,
  AlertTriangle,
  MapPin,
  ChevronRight,
  Calculator,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Upload,
  Download,
  ChevronLeft,
  X
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        BarChart3,
        Map,
        Brain,
        Activity,
        Lightbulb,
        Table,
        LogOut,
        CircleAlert,
        House,
        DollarSign,
        TrendingUp,
        TrendingDown,
        Target,
        CircleCheck,
        AlertTriangle,
        MapPin,
        ChevronRight,
        Calculator,
        Search,
        Filter,
        ChevronUp,
        ChevronDown,
        Upload,
        Download,
        ChevronLeft,
        X
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ]
};
