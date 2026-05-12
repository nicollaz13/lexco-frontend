import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Hay token, puedes pasar
  } else {
    // No hay token, te mando al login
    router.navigate(['/login']);
    return false;
  }
};