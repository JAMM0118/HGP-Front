import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'admin' | 'analyst' | 'guest';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return new Observable(observer => {
      // Simulación de llamada a API
      setTimeout(() => {
        // Buscar usuario en localStorage (usuarios registrados)
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          const authenticatedUser: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType
          };

          localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
          this.currentUserSubject.next(authenticatedUser);
          observer.next(authenticatedUser);
          observer.complete();
        } else {
          observer.error({ message: 'Email o contraseña incorrectos' });
        }
      }, 500);
    });
  }

  register(name: string, email: string, password: string, userType: 'admin' | 'analyst' | 'guest'): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getStoredUsers();

        // Verificar si el email ya existe
        if (users.find(u => u.email === email)) {
          observer.error({ message: 'El email ya está registrado' });
          return;
        }

        // Crear nuevo usuario
        const newUser = {
          id: this.generateId(),
          email,
          password, // En producción, esto debería estar hasheado
          name,
          userType
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const authenticatedUser: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          userType: newUser.userType
        };

        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        this.currentUserSubject.next(authenticatedUser);

        observer.next(authenticatedUser);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    return roles.includes(user.userType);
  }

  private getStoredUsers(): any[] {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}
