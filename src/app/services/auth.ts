import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- MÉTODOS QUE FALTABAN ---
  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // --- MÉTODOS PARA DATOS REALES ---
  getProducts() {
    return this.http.get(`${this.apiUrl}/products`, { headers: this.getHeaders() });
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }
  
  createUser(data: any) {
  return this.http.post(`${this.apiUrl}/users`, data, { headers: this.getHeaders() });
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/users/${id}`, data, { headers: this.getHeaders() });
  }
  deleteUser(id: number) {
  return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }
  createProduct(data: any) {
  return this.http.post(`${this.apiUrl}/products`, data, { headers: this.getHeaders() });
}

updateProduct(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/products/${id}`, data, { headers: this.getHeaders() });
}

deleteProduct(id: number) {
  return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
}
getProfile() {
  return this.http.get(`${this.apiUrl}/user-profile`, { headers: this.getHeaders() });
}

updateProfile(data: any) {
  return this.http.put(`${this.apiUrl}/user-profile`, data, { headers: this.getHeaders() });
}
purchase(data: any) {
  // Esta función envía el payload (con los items) al backend
  return this.http.post(`${this.apiUrl}/products/purchase`, data, { 
    headers: this.getHeaders() 
  });
}

}