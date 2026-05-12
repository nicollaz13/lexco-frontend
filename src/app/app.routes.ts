import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Protegemos productos y la gestión de usuarios
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { 
    path: 'admin/users', 
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];