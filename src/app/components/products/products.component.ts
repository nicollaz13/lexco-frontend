import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Verifica esta ruta
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule, TableModule, TagModule, PopoverModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router); // <--- ESTO FALTABA
  userRole = localStorage.getItem('role') || 'USER';
  // --- SIGNALS PARA EL CARRITO ---
  cart = signal<any[]>([]);
  cartCount = computed(() => this.cart().length);
  cartTotal = computed(() => this.cart().reduce((acc, item) => acc + Number(item.price), 0));

  products: any[] = [];
  

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.authService.getProducts().subscribe({
      next: (data: any) => this.products = data,
      error: (err: any) => console.error('Error', err)
    });
  }

  addToCart(product: any) {
    this.cart.update(currentCart => [...currentCart, product]);
  }
  removeFromCart(index: number) {
  this.cart.update(currentCart => {
    const newCart = [...currentCart];
    newCart.splice(index, 1); // Elimina el producto en esa posición
    return newCart;
  });
}

  irAUsuarios() { this.router.navigate(['/admin/users']); }
  irAProductos() { this.router.navigate(['/products']); }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

    getSeverity(stock: number): any {
    if (stock > 5) return 'success';   // Más de 5 es "En Stock"
    if (stock > 0) return 'warning';   // 1 a 5 es "Poco Stock"
    return 'danger';                   // 0 es "Agotado"
    }
    getStockStatus(stock: number): string {
      if (stock > 5) return 'INSTOCK';
      if (stock > 0) return 'LOWSTOCK';
      return 'OUTOFSTOCK';
    }
}