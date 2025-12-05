# Sistema de Gestión de Equipos

Sistema web para registrar y gestionar equipos informáticos con Flask, MySQL y Tailwind CSS.

## 🚀 Características

- ✅ Registro de equipos con autocompletado de especificaciones
- ✅ Tabla completa con operaciones CRUD
- ✅ Diseño responsive con Tailwind CSS
- ✅ API RESTful
- ✅ Validación de datos cliente y servidor
- ✅ Manejo robusto de errores

## 📋 Requisitos

- Python 3.8+
- MySQL 5.7+
- Node.js 16+ (para Tailwind CSS)

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd DiegoCentenoVivasFormulario
```

### 2. Configurar entorno Python
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 3. Configurar base de datos
```bash
# Crear la base de datos
mysql -h tu-host -u root -p < schema.sql
```

### 4. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tus credenciales
MYSQL_HOST=tu-host-rds.amazonaws.com
MYSQL_USER=root
MYSQL_PASSWORD=tu-contraseña
MYSQL_DB=hackaton
SECRET_KEY=genera-una-clave-segura
```

### 5. Instalar dependencias de Tailwind
```bash
npm install
```

### 6. Compilar CSS
```bash
npm run build:css
```

## ▶️ Ejecutar la aplicación

```bash
python app.py
```

La aplicación estará disponible en `http://localhost:5000`

## 📁 Estructura del proyecto

```
DiegoCentenoVivasFormulario/
├── app.py                 # Aplicación Flask principal
├── schema.sql             # Script de base de datos
├── requirements.txt       # Dependencias Python
├── package.json          # Dependencias Node.js
├── .env.example          # Plantilla de variables de entorno
├── templates/
│   ├── index.html        # Formulario de registro
│   └── equipos.html      # Tabla de equipos
├── static/
│   ├── css/
│   │   ├── input.css     # Estilos Tailwind (fuente)
│   │   └── output.css    # CSS compilado
│   ├── js/
│   │   ├── form.js       # Lógica del formulario
│   │   └── equipos.js    # Lógica de la tabla
│   └── img/
│       ├── logo.jpg
│       └── fondo.jpg
```

## 🔌 API Endpoints

### Equipos
- `GET /api/equipos` - Listar todos los equipos
- `POST /api/equipos` - Crear nuevo equipo
- `PUT /api/equipos/<id>` - Actualizar equipo
- `DELETE /api/equipos/<id>` - Eliminar equipo

## 🛠️ Desarrollo

### Compilar CSS en modo watch
```bash
npm run watch:css
```

### Variables de entorno importantes
- `MYSQL_HOST`: Host de MySQL
- `MYSQL_USER`: Usuario de MySQL
- `MYSQL_PASSWORD`: Contraseña de MySQL
- `MYSQL_DB`: Nombre de la base de datos
- `SECRET_KEY`: Clave secreta de Flask
- `PORT`: Puerto del servidor (default: 5000)

## 🔒 Seguridad

- ✅ Credenciales en variables de entorno
- ✅ Validación de datos en cliente y servidor
- ✅ Prepared statements para prevenir SQL injection
- ✅ Manejo específico de excepciones
- ✅ Secret key configurable

## 📝 Licencia

Este proyecto es de uso educativo.

## 👤 Autor

Diego Centeno Vivas
