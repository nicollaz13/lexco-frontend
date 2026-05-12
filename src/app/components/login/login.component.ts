import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth'; 
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private router = inject(Router); 
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // --- ESTE ES EL BLOQUE QUE ACTUALIZAMOS ---
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          // 1. Guardamos el token para las peticiones
          localStorage.setItem('token', res.token);
          
          // 2. NUEVA LÍNEA: Guardamos el rol para la visual del Front
          // Nota: Asegúrate que tu Laravel envíe 'user' y dentro 'role'
          localStorage.setItem('role', res.user.role); 
          
          // 3. Navegamos a productos
          this.router.navigate(['/products']); 
        },
        error: (err) => console.error('Error', err)
      });
      // ------------------------------------------
    }
  }
}