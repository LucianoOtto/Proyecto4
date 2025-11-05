<<<<<<< HEAD
# Proyecto4 - Sistema de Gestión de Stock

Aplicación full-stack para gestión de productos con autenticación de usuarios.

## Características

- Backend con Express.js y MySQL
- Frontend con React + Vite + Tailwind CSS
- Autenticación JWT
- CRUD de productos
- Rutas protegidas
- Validación de formularios

## Requisitos Previos

- Node.js >= 14
- MySQL >= 8.0
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/GinoGregoret/Proyecto4.git
cd Proyecto4
```

2. Instalar dependencias (backend y frontend):
```bash
npm run install:all
```

3. Configurar base de datos:
   - Crear base de datos MySQL:
   ```sql
   CREATE DATABASE stock_utn;
   ```
   - Copiar `.env.example` a `.env` en la carpeta `back` y configurar las variables:
   ```
   NAME_DB=stock_utn
   USER_DB=root
   PASS_DB=tu_password
   HOST_DB=localhost
   PORT_DB=3306
   DIALECT_DB=mysql
   JWT_SECRET=tu_secreto
   PORT=3000
   ```

4. Iniciar la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Estructura del Proyecto

```
├── back/               # Backend con Express
│   ├── config/        # Configuración de DB
│   ├── middleware/    # Middleware JWT
│   ├── models/       # Modelos Sequelize
│   ├── routes/       # Rutas de la API
│   └── server.mjs    # Servidor Express
├── front/             # Frontend con React
│   ├── src/          # Código fuente
│   ├── components/   # Componentes React
│   └── contexts/     # Contextos (Auth)
└── package.json      # Scripts principales
```

## API Endpoints

### Autenticación
- POST `/api/auth/register` - Registro de usuario
- POST `/api/auth/login` - Login (devuelve JWT)
- GET `/api/auth/verify-token` - Verificar token JWT

### Productos (requieren autenticación)
- GET `/api/productos` - Listar productos
- POST `/api/productos` - Crear producto
- PUT `/api/productos/:id` - Actualizar producto
- DELETE `/api/productos/:id` - Eliminar producto

## Scripts Disponibles

- `npm run dev` - Inicia backend y frontend en modo desarrollo
- `npm run install:all` - Instala dependencias en todos los proyectos
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 89fd79582082601478b022b27c832740c478f0c4
