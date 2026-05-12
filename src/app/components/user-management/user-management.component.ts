import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // <-- Faltaba esto
import { AuthService } from '../../services/auth';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog'; // <-- Faltaba esto
import { InputTextModule } from 'primeng/inputtext'; // <-- Faltaba esto

@Component({
  selector: 'app-user-management',
  standalone: true,
  // IMPORTANTE: Agregué ReactiveFormsModule, DialogModule e InputTextModule aquí
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    ToolbarModule, 
    DialogModule, 
    InputTextModule, 
    ReactiveFormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder); // <-- Necesario para crear el formulario

  // --- VARIABLES DE ESTADO (Las que hacían que se reventara) ---
  users: any[] = [];
  userDialog: boolean = false;
  userForm: FormGroup;
  isEdit: boolean = false;
  selectedUserId: number | null = null;

  constructor() {
    // Inicializamos el formulario con sus reglas
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      password: [''] // En edición puede ir vacío, en creación Laravel debería validarlo
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data: any) => this.users = data,
      error: (err: any) => console.error('Error cargando usuarios', err)
    });
  }

  // --- FUNCIONES DE ACCIÓN ---

  openNew() {
    this.isEdit = false;
    this.selectedUserId = null;
    this.userForm.reset({ role: 'USER' }); // Limpiamos el formulario
    this.userDialog = true; // Abrimos la ventana
  }

  editUser(user: any) {
    this.isEdit = true;
    this.selectedUserId = user.id;
    // Llenamos el formulario con los datos del usuario seleccionado
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    this.userDialog = true;
  }

  saveUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.isEdit && this.selectedUserId) {
        this.authService.updateUser(this.selectedUserId, userData).subscribe({
          next: () => {
            this.loadUsers();
            this.userDialog = false;
          },
          error: (err) => console.error('Error al actualizar', err)
        });
      } else {
        this.authService.createUser(userData).subscribe({
          next: () => {
            this.loadUsers();
            this.userDialog = false;
          },
          error: (err) => console.error('Error al crear', err)
        });
      }
    }
  }

  deleteUser(user: any) {
    if (confirm(`¿Seguro que quieres eliminar a ${user.name}?`)) {
      this.authService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error al borrar', err)
      });
    }
  }
}