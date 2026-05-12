import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; 
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    ToolbarModule, 
    TableModule, 
    TagModule, 
    PopoverModule, 
    DialogModule, 
    InputTextModule, 
    ReactiveFormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  userRole = localStorage.getItem('role') || 'USER';
  
  // --- SIGNALS PARA EL CARRITO ---
  cart = signal<any[]>([]);
  cartCount = computed(() => this.cart().length);
  cartTotal = computed(() => this.cart().reduce((acc, item) => acc + Number(item.price), 0));

  products: any[] = [];
  
  // --- VARIABLES PARA EL CRUD DE ADMIN ---
  productDialog: boolean = false;
  productForm: FormGroup;
  isEdit: boolean = false;
  selectedProductId: number | null = null;

  constructor() {
    // Inicializamos el formulario de productos
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.authService.getProducts().subscribe({
      next: (data: any) => this.products = data,
      error: (err: any) => console.error('Error cargando productos', err)
    });
  }

  // --- LÓGICA DEL CARRITO ---
  addToCart(product: any) {
    this.cart.update(currentCart => [...currentCart, product]);
  }

  removeFromCart(index: number) {
    this.cart.update(currentCart => {
      const newCart = [...currentCart];
      newCart.splice(index, 1);
      return newCart;
    });
  }

  // --- LÓGICA CRUD PRODUCTOS (ADMIN) ---

  openNew() {
    this.isEdit = false;
    this.selectedProductId = null;
    this.productForm.reset({ price: 0, stock: 0 });
    this.productDialog = true;
  }

  editProduct(product: any) {
    this.isEdit = true;
    this.selectedProductId = product.id;
    this.productForm.patchValue(product);
    this.productDialog = true;
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      if (this.isEdit && this.selectedProductId) {
        // ACTUALIZAR PRODUCTO
        this.authService.updateProduct(this.selectedProductId, productData).subscribe({
          next: () => {
            this.loadProducts();
            this.productDialog = false;
          },
          error: (err) => console.error('Error al actualizar producto', err)
        });
      } else {
        // CREAR PRODUCTO
        this.authService.createProduct(productData).subscribe({
          next: () => {
            this.loadProducts();
            this.productDialog = false;
          },
          error: (err) => console.error('Error al crear producto', err)
        });
      }
    }
  }

  deleteProduct(product: any) {
    if (confirm(`¿Seguro que quieres eliminar el producto ${product.name}?`)) {
      this.authService.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error al borrar producto', err)
      });
    }
  }

  // --- NAVEGACIÓN Y UTILIDADES ---
  irAUsuarios() { this.router.navigate(['/admin/users']); }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

getSeverity(stock: number): any {
    if (stock > 5) return 'success';
    if (stock > 0) return 'warn';
    return 'danger';}
  

  getStockStatus(stock: number): string {
    if (stock > 5) return 'INSTOCK';
    if (stock > 0) return 'LOWSTOCK';
    return 'OUTOFSTOCK';
  }
  checkout() {
  this.authService.purchase(this.cart()).subscribe({
    next: () => {
      alert('¡Compra exitosa!');
      this.cart.set([]); // Limpiamos el carrito
      this.loadProducts(); // Recargamos la tabla para ver el nuevo stock
    }
  });
}
confirmPurchase() {
  if (this.cart().length === 0) return;

  // IMPORTANTE: Laravel espera un objeto con la llave "items"
  const payload = {
    items: this.cart() 
  };

  this.authService.purchase(payload).subscribe({
    next: (res: any) => {
      alert('¡Compra realizada con éxito! El stock ha sido actualizado.');
      this.cart.set([]); // Limpiamos el carrito (Signal)
      this.loadProducts(); // Recargamos la tabla para ver el stock actualizado
    },
    error: (err: any) => {
      console.error('Error en la compra:', err);
      // Si entra aquí, mira la pestaña "Network" de tu navegador (F12) 
      // para ver qué dice el error que devuelve Laravel.
      alert('Hubo un error al procesar la compra.');
    }
  });
}
}
