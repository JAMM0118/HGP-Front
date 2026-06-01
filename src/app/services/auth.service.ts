import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'administrador' | 'analista_datos' | 'invitado';
}

export interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message?: string;
}

export interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Iniciar sesión
   *
   * Backend URL: POST /api/auth/login
   * Body: { email: string, password: string }
   * Response: { user: User, token: string, message?: string }
   */
  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          // Guardar usuario y token en localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('authToken', response.token);

          // Actualizar BehaviorSubject
          this.currentUserSubject.next(response.user);

          return response.user;
        })
      );
  }

  /**
   * Registrar nuevo usuario
   *
   * Backend URL: POST /api/auth/register
   * Body: { name: string, email: string, password: string, role: string }
   * Response: { user: User, token: string, message?: string }
   */
  register(name: string, email: string, password: string, role: 'administrador' | 'analista_datos' | 'invitado'): Observable<User> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
      role
    }).pipe(
      map(response => {
        // Guardar usuario y token en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);

        // Actualizar BehaviorSubject
        this.currentUserSubject.next(response.user);

        return response.user;
      })
    );
  }

  /**
   * Cerrar sesión
   *
   * Backend URL: POST /api/auth/logout
   * Headers: Authorization: Bearer <token>
   * Response: { message: string }
   */
  logout(): Observable<LogoutResponse> {
    const token = this.getToken();

    return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(response => {
        // Limpiar localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');

        // Actualizar BehaviorSubject
        this.currentUserSubject.next(null);

        return response;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.role);
  }
}
