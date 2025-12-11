// ============================================
// MÓDULO DE FORMULARIO DE REGISTRO
// ============================================
// Maneja el registro de equipos con:
// - Auto-completado de especificaciones por modelo
// - Validación de datos en cliente
// - Comunicación con API REST
// ============================================

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    API_ENDPOINT: "/api/equipos",
    MENSAJE_TIMEOUT: 3000,
    FECHA_MIN_OFFSET: 0 // días desde hoy para fecha mínima de mantenimiento
};

// ============================================
// DATOS ESTÁTICOS: Modelos por marca
// ============================================
const modelosPorMarca = {
    "hp": ["HP 15-ef1xxx", "HP 15-dy1xxx", "HP ProBook 450 G7", "HP ProBook 640 G5", "HP Pavilion 15", "HP Envy 13", "HP ZBook 15"],
    "dell": ["Dell Inspiron 15 3000", "Dell Inspiron 15 5000", "Dell XPS 13", "Dell XPS 15", "Dell Latitude 5520", "Dell Latitude 7420", "Dell Vostro 15"],
    "lenovo": ["Lenovo ThinkPad E15", "Lenovo ThinkPad T14", "Lenovo ThinkPad X1", "Lenovo IdeaPad 5", "Lenovo IdeaPad 3", "Lenovo Legion 5", "Lenovo Yoga 9"],
    "asus": ["ASUS VivoBook 15", "ASUS VivoBook Pro", "ASUS ROG G513", "ASUS ROG Zephyrus", "ASUS ZenBook 13", "ASUS ZenBook 14", "ASUS TUF Gaming"],
    "apple": ["MacBook Air M1", "MacBook Air M2", "MacBook Pro 13", "MacBook Pro 14", "MacBook Pro 16", "iMac 24", "Mac Mini M1"]
};

// Especificaciones por modelo
const especificacionesModelo = {
    "HP 15-ef1xxx": { ram: 8, almacenamiento: 256, procesador: "AMD Ryzen 5" },
    "HP 15-dy1xxx": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "HP ProBook 450 G7": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "HP ProBook 640 G5": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "HP Pavilion 15": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "HP Envy 13": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "HP ZBook 15": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Dell Inspiron 15 3000": { ram: 4, almacenamiento: 128, procesador: "Intel Core i3" },
    "Dell Inspiron 15 5000": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "Dell XPS 13": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Dell XPS 15": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Dell Latitude 5520": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Dell Latitude 7420": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Dell Vostro 15": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "Lenovo ThinkPad E15": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "Lenovo ThinkPad T14": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Lenovo ThinkPad X1": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Lenovo IdeaPad 5": { ram: 8, almacenamiento: 256, procesador: "AMD Ryzen 5" },
    "Lenovo IdeaPad 3": { ram: 4, almacenamiento: 128, procesador: "Intel Core i3" },
    "Lenovo Legion 5": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "Lenovo Yoga 9": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "ASUS VivoBook 15": { ram: 8, almacenamiento: 256, procesador: "AMD Ryzen 5" },
    "ASUS VivoBook Pro": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "ASUS ROG G513": { ram: 32, almacenamiento: 1024, procesador: "Intel Core i9" },
    "ASUS ROG Zephyrus": { ram: 32, almacenamiento: 1024, procesador: "Intel Core i9" },
    "ASUS ZenBook 13": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "ASUS ZenBook 14": { ram: 8, almacenamiento: 256, procesador: "Intel Core i5" },
    "ASUS TUF Gaming": { ram: 16, almacenamiento: 512, procesador: "Intel Core i7" },
    "MacBook Air M1": { ram: 8, almacenamiento: 256, procesador: "Apple M1" },
    "MacBook Air M2": { ram: 8, almacenamiento: 256, procesador: "Apple M2" },
    "MacBook Pro 13": { ram: 16, almacenamiento: 512, procesador: "Apple M1" },
    "MacBook Pro 14": { ram: 16, almacenamiento: 512, procesador: "Apple M1 Pro" },
    "MacBook Pro 16": { ram: 32, almacenamiento: 1024, procesador: "Apple M1 Max" },
    "iMac 24": { ram: 16, almacenamiento: 512, procesador: "Apple M1" },
    "Mac Mini M1": { ram: 8, almacenamiento: 256, procesador: "Apple M1" }
};

// ============================================
// CACHEO DE ELEMENTOS DOM
// ============================================
// Se cargan una vez en inicialización para mejor rendimiento
const elementos = {
    form: null,
    marcas: null,
    modelo: null,
    ram: null,
    almacenamiento: null,
    mantenimiento: null,
    mensaje: null,
    submitBtn: null
};

// ============================================
// FUNCIONES UTILITARIAS
// ============================================
const utils = {
    getFechaActual: () => new Date().toISOString().split('T')[0],
    
    crearOpcion: (valor, texto = valor) => {
        const option = document.createElement("option");
        option.value = valor;
        option.textContent = texto;
        return option;
    },
    
    limpiarSelect: (select, textoDefault = "Seleccionar...") => {
        select.innerHTML = "";
        select.appendChild(utils.crearOpcion("", textoDefault));
    },
    
    validarFormData: (data) => {
        const camposRequeridos = ['codigo', 'tipo', 'marcas', 'modelo', 'so', 'almacenamiento', 'ram', 'estado', 'mantenimiento'];
        return camposRequeridos.every(campo => data[campo] && data[campo].toString().trim() !== '');
    }
};

// ============================================
// HANDLER: Gestión de modelos
// ============================================
// Carga modelos dinámicamente desde la API según la marca seleccionada
const modelosHandler = {
    cargarModelos: async (marca) => {
        utils.limpiarSelect(elementos.modelo);
        
        if (!marca) {
            elementos.ram.value = "";
            elementos.almacenamiento.value = "";
            return;
        }
        
        try {
            const response = await fetch(`/api/modelos/${marca.toLowerCase()}`);
            const data = await response.json();
            
            if (data.ok && data.modelos) {
                const fragment = document.createDocumentFragment();
                for (const modelo of data.modelos) {
                    fragment.appendChild(utils.crearOpcion(modelo.nombre));
                }
                elementos.modelo.appendChild(fragment);
                
                // Guardar especificaciones en un objeto global para acceso rápido
                window.especificacionesModelo = {};
                for (const modelo of data.modelos) {
                    window.especificacionesModelo[modelo.nombre] = {
                        ram: modelo.ram,
                        almacenamiento: modelo.almacenamiento,
                        procesador: modelo.procesador
                    };
                }
            } else {
                console.error('Error al cargar modelos:', data.error);
            }
        } catch (error) {
            console.error('Error en la carga de modelos:', error);
        }
        
        // Limpiar especificaciones cuando cambia la marca
        elementos.ram.value = "";
        elementos.almacenamiento.value = "";
    },
    
    aplicarEspecificaciones: (modelo) => {
        if (window.especificacionesModelo && window.especificacionesModelo[modelo]) {
            const specs = window.especificacionesModelo[modelo];
            elementos.ram.value = specs.ram;
            elementos.almacenamiento.value = specs.almacenamiento;
        }
    }
};

// ============================================
// HANDLER: Sistema de mensajes
// ============================================
// Muestra notificaciones temporales de éxito/error
const mensajesHandler = {
    mostrar: (texto, tipo = "exito") => {
        elementos.mensaje.textContent = texto;
        
        const claseBase = "mt-5 p-4 rounded-lg text-center font-bold block transition-all duration-300";
        const clasesTipo = tipo === "exito" 
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200";
        
        elementos.mensaje.className = `${claseBase} ${clasesTipo}`;
        
        setTimeout(() => {
            elementos.mensaje.className = "mt-5 p-4 rounded-lg text-center font-bold hidden";
        }, CONFIG.MENSAJE_TIMEOUT);
    }
};

// ============================================
// HANDLER: Lógica del formulario
// ============================================
// Gestiona envío, validación y estado del formulario
const formHandler = {
    toggleSubmitButton: (disabled) => {
        elementos.submitBtn.disabled = disabled;
        elementos.submitBtn.classList.toggle('opacity-50', disabled);
        elementos.submitBtn.classList.toggle('cursor-not-allowed', disabled);
        elementos.submitBtn.textContent = disabled ? 'Enviando...' : 'Registrar';
    },
    
    obtenerDatos: () => {
        return {
            codigo: document.getElementById("codigo").value.trim(),
            tipo: document.getElementById("tipo").value,
            marcas: document.getElementById("marcas").value,
            modelo: document.getElementById("modelo").value,
            so: document.getElementById("so").value,
            almacenamiento: Number.parseInt(document.getElementById("almacenamiento").value, 10),
            ram: Number.parseInt(document.getElementById("ram").value, 10),
            estado: document.getElementById("estado").value.trim(),
            mantenimiento: document.getElementById("mantenimiento").value
        };
    },
    
    limpiar: () => {
        elementos.form.reset();
        utils.limpiarSelect(elementos.modelo);
        elementos.ram.value = "";
        elementos.almacenamiento.value = "";
    },
    
    enviar: async (e) => {
        e.preventDefault();
        
        const formData = formHandler.obtenerDatos();
        
        // Validación cliente
        if (!utils.validarFormData(formData)) {
            mensajesHandler.mostrar("Por favor completa todos los campos", "error");
            return;
        }
        
        formHandler.toggleSubmitButton(true);
        
        try {
            const response = await fetch(CONFIG.API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.ok) {
                mensajesHandler.mostrar("✓ Equipo registrado exitosamente", "exito");
                formHandler.limpiar();
            } else {
                mensajesHandler.mostrar(data.error || "Error al registrar el equipo", "error");
            }
        } catch (error) {
            console.error("Error en el envío:", error);
            mensajesHandler.mostrar(`Error de conexión: ${error.message}`, "error");
        } finally {
            formHandler.toggleSubmitButton(false);
        }
    }
};

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializar() {
    // Cachear referencias a elementos DOM para mejor rendimiento
    elementos.form = document.getElementById("equipoForm");
    elementos.marcas = document.getElementById("marcas");
    elementos.modelo = document.getElementById("modelo");
    elementos.ram = document.getElementById("ram");
    elementos.almacenamiento = document.getElementById("almacenamiento");
    elementos.mantenimiento = document.getElementById("mantenimiento");
    elementos.mensaje = document.getElementById("mensaje");
    elementos.submitBtn = elementos.form.querySelector('button[type="submit"]');
    
    // Establecer fecha mínima
    elementos.mantenimiento.min = utils.getFechaActual();
    
    // Event listeners
    elementos.marcas.addEventListener("change", (e) => {
        modelosHandler.cargarModelos(e.target.value.toLowerCase());
    });
    
    elementos.modelo.addEventListener("change", (e) => {
        modelosHandler.aplicarEspecificaciones(e.target.value);
    });
    
    elementos.form.addEventListener("submit", formHandler.enviar);
    
    console.log("✓ Formulario de equipos inicializado correctamente");
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
