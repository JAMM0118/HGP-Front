import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // Verificar roles si están especificados en la ruta
      if (route.data['roles']) {
        const roles = route.data['roles'] as string[];
        if (!this.authService.hasRole(roles)) {
          // Usuario no tiene el rol requerido, redirigir al dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
      return true;
    }

    // No está autenticado, redirigir al login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
