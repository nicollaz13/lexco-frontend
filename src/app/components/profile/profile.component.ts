import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  profileForm: FormGroup;
  loading: boolean = false;

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Email suele ser no editable
      role: [{ value: '', disabled: true }] // El rol solo lo cambia otro Admin
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Asumiendo que tienes un método getProfile() en tu AuthService
    this.authService.getProfile().subscribe({
      next: (user: any) => {
        this.profileForm.patchValue(user);
      },
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
          this.loading = false;
        }
      });
    }
  }
}