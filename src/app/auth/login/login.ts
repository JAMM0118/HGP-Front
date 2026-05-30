import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `],
})
export default class Login {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Crear usuarios de prueba si no existen
    this.createTestUsers();
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage = '¡Inicio de sesión exitoso!';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al iniciar sesión';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  private createTestUsers(): void {
    const usersJson = localStorage.getItem('users');
    if (!usersJson) {
      const testUsers = [
        {
          id: 'admin_001',
          email: 'admin@proppredict.com',
          password: 'admin123',
          name: 'Administrador',
          userType: 'admin'
        },
        {
          id: 'analyst_001',
          email: 'analyst@proppredict.com',
          password: 'analyst123',
          name: 'Analista de Datos',
          userType: 'analyst'
        },
        {
          id: 'guest_001',
          email: 'guest@proppredict.com',
          password: 'guest123',
          name: 'Usuario Invitado',
          userType: 'guest'
        }
      ];
      localStorage.setItem('users', JSON.stringify(testUsers));
    }
  }
}
