Marketplace Pro - Prueba Técnica
Desarrollador: Nicolas Hernandez

Fecha: Mayo 2026

Este sistema es una solución Fullstack para la gestión de productos y usuarios, construida con una arquitectura modular y segura.

🚀 Tecnologías Utilizadas
Backend (Laravel 11)
Autenticación: Laravel Sanctum (Tokens y Cookies HttpOnly).

Base de Datos: PostgreSQL.

Seguridad: Middlewares personalizados para Roles (Admin/User) y Límite de Sesiones (Máx. 2).

Arquitectura: Rutas modulares (auth.php, products.php, user.php).

Frontend (Angular 21)
UI Framework: PrimeNG (Tablas, Diálogos, Popovers, Toolbars).

Estado: Angular Signals para la gestión reactiva del carrito.

Seguridad: Guards de Autenticación y de Roles.
Backend
# Entrar a la carpeta
cd lexco-backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Configurar Base de Datos en .env (PostgreSQL)
# DB_CONNECTION=pgsql
# DB_DATABASE=tu_base_de_datos

# Ejecutar migraciones y seeders
php artisan migrate --seed
2. Frontend (Angular)
# Entrar a la carpeta
cd lexco-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

Credenciales de Prueba
Lógica de Roles: El primer usuario que se registre será automáticamente ADMIN. Los siguientes serán USER.

Límite de Sesiones: El sistema permite máximo 2 sesiones activas simultáneamente.

Estructura de Rutas Modular
Se implementó una división de rutas para mejorar la mantenibilidad:

/api/auth: Registro, Login y Perfil.

/api/products: CRUD de productos y lógica de compra con descuento de stock.

/api/users: Gestión de usuarios (Solo Admin).