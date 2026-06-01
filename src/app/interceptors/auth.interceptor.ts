import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token de autenticación
    const token = this.authService.getToken();

    // Si hay token, agregarlo a los headers
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Enviar la petición y manejar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es error 401 (No autorizado), hacer logout
        if (error.status === 401) {
          // Limpiar sesión local sin llamar al backend
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
          // Redirigir al login si es necesario
          // this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
