# Guía Completa - Prueba Técnica HotelBediaX

## 📋 Índice
1. [Configuración de Base de Datos PostgreSQL](#1-configuración-de-base-de-datos-postgresql)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Configuración del Backend](#3-configuración-del-backend)
4. [Modelos y Migraciones](#4-modelos-y-migraciones)
5. [API REST - Autenticación](#5-api-rest---autenticación)
6. [API REST - Destinations CRUD](#6-api-rest---destinations-crud)
7. [Configuración del Frontend](#7-configuración-del-frontend)
8. [Implementación Frontend](#8-implementación-frontend)
9. [Deploy a Render y Vercel](#9-deploy-a-render-y-vercel)

---

## 1. Configuración de Base de Datos PostgreSQL

### Paso 1.1: Verificar PostgreSQL instalado
```bash
# En WSL Ubuntu
sudo service postgresql status
```

Si no está instalado:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Paso 1.2: Iniciar PostgreSQL
```bash
sudo service postgresql start
```

### Paso 1.3: Crear usuario y base de datos
```bash
# Conectar como usuario postgres
sudo -u postgres psql

# Dentro de psql, ejecutar:
CREATE USER user_GTC WITH PASSWORD 'user_password';
ALTER USER user_GTC CREATEDB;
CREATE DATABASE hotelbediax_db OWNER user_GTC;
GRANT ALL PRIVILEGES ON DATABASE hotelbediax_db TO user_GTC;
\q
```

**Nota:** PostgreSQL convertirá el nombre del usuario a minúsculas (`user_gtc`). Si necesitas mantener mayúsculas, usa comillas: `CREATE USER "user_GTC"`. Para este proyecto usaremos `user_gtc` (minúsculas).

### Paso 1.4: Verificar conexión
```bash
# Probar conexión con el nuevo usuario
psql -U user_gtc -d hotelbediax_db -h localhost
# Cuando pida password, ingresar: user_password
```

Si funciona, verás el prompt de psql. Escribe `\q` para salir.

**✅ Verificación completada cuando puedas conectarte exitosamente**

---

## 2. Estructura del Proyecto

### Paso 2.1: Crear estructura de carpetas
En la carpeta raíz del proyecto, crear:

```
PT-GTC/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

**✅ Avísame cuando tengas la estructura creada**

---

## 3. Configuración del Backend

### Paso 3.1: Inicializar proyecto backend
```bash
cd backend
npm init -y
```

### Paso 3.2: Instalar dependencias
```bash
# Dependencias de producción
npm install express sequelize pg pg-hstore
npm install jsonwebtoken bcryptjs
npm install dotenv cors
npm install express-validator

# Dependencias de desarrollo
npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs
npm install -D @types/express-validator
npm install -D ts-node nodemon
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Paso 3.3: Crear tsconfig.json
Crear archivo `backend/tsconfig.json` con configuración para ES Modules:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Paso 3.4: Actualizar package.json
Modificar `backend/package.json`:

1. Agregar `"type": "module"` para usar ES Modules
2. Agregar scripts:
```json
{
  "name": "hotelbediax-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node --esm src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "ts-node --esm src/config/database.ts"
  }
}
```

**Nota:** El resto del package.json se mantiene igual, solo agrega/modifica estos campos.

### Paso 3.5: Crear .env
Crear `backend/.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotelbediax_db
DB_USER=user_gtc
DB_PASSWORD=user_password
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### Paso 3.6: Crear .gitignore
Crear `backend/.gitignore`:
```
node_modules/
dist/
.env
*.log
.DS_Store
```

**✅ Avísame cuando hayas completado estos pasos para continuar con la configuración de Sequelize**

---

## 4. Modelos y Migraciones

### Paso 4.1: Configurar Sequelize
Crear archivo de configuración de base de datos.

### Paso 4.2: Crear modelos
- Modelo User
- Modelo Destination

### Paso 4.3: Configurar relaciones
- User 1:N Destination

### Paso 4.4: Migraciones automáticas
- Configurar sincronización automática

**⏳ Esperando completar paso 3 antes de continuar...**

---

## 5. API REST - Autenticación

### Endpoints a implementar:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protegido)

**⏳ Esperando completar paso 4...**

---

## 6. API REST - Destinations CRUD

### Endpoints a implementar:
- GET /api/destinations (con paginación y filtros)
- GET /api/destinations/:id
- POST /api/destinations (protegido)
- PUT /api/destinations/:id (protegido)
- DELETE /api/destinations/:id (protegido)

**⏳ Esperando completar paso 5...**

---

## 7. Configuración del Frontend

### Paso 7.1: Crear proyecto React con TypeScript
```bash
cd frontend
npx create-react-app . --template typescript
```

**⏳ Esperando completar backend...**

---

## 8. Implementación Frontend

**⏳ Esperando completar paso 7...**

---

## 9. Deploy a Render y Vercel

**⏳ Esperando completar implementación...**

---

## 📝 Notas Importantes

- **Auto-reload**: Nodemon configurado en paso 3.4
- **ES Modules**: Configurado en tsconfig.json y package.json
- **Migraciones**: Sequelize sync automático
- **JWT**: Implementado en paso 5
- **Relación 1:N**: User -> Destinations

---

## 🚀 Siguiente Paso

**Comienza con el Paso 1: Configuración de PostgreSQL**

Avísame cuando hayas completado cada paso para continuar con el siguiente.

