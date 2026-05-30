import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
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
export default class Register {
   name = '';
  email = '';
  userType: 'admin' | 'analyst' | 'guest' | '' = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isFormValid(): boolean {
    return !!(
      this.name &&
      this.email &&
      this.userType &&
      this.password &&
      this.password.length >= 6 &&
      this.password === this.confirmPassword &&
      this.acceptTerms
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(
      this.name,
      this.email,
      this.password,
      this.userType as 'admin' | 'analyst' | 'guest'
    ).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage = '¡Cuenta creada exitosamente! Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al crear la cuenta';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
