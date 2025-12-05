// ============================================
// MÓDULO DE LISTA DE EQUIPOS
// ============================================
// Maneja la visualización y gestión de equipos:
// - Lista de todos los equipos registrados
// - Edición mediante prompts simples
// - Eliminación con confirmación
// ============================================

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    API_ENDPOINT: "/api/equipos",
    MENSAJE_TIMEOUT: 3000
};

// Elementos DOM cacheados
let elementos = {};

// ============================================
// HANDLER: Sistema de mensajes
// ============================================
const mensajesHandler = {
    mostrar: (texto, tipo = "exito") => {
        elementos.mensaje.textContent = texto;
        
        const claseBase = "mb-4 p-4 rounded-lg text-center font-bold block transition-all duration-300";
        const clasesTipo = tipo === "exito" 
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200";
        
        elementos.mensaje.className = `${claseBase} ${clasesTipo}`;
        
        setTimeout(() => {
            elementos.mensaje.className = "mb-4 p-4 rounded-lg text-center font-bold hidden";
        }, CONFIG.MENSAJE_TIMEOUT);
    }
};

// ============================================
// FUNCIÓN: Cargar equipos desde API
// ============================================
async function cargarEquipos() {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT);
        const data = await response.json();
        
        if (data.ok && data.equipos) {
            mostrarEquipos(data.equipos);
        } else {
            elementos.tablaEquipos.innerHTML = `
                <tr>
                    <td colspan="10" class="px-4 py-8 text-center text-red-500">
                        Error al cargar equipos: ${data.error || 'Error desconocido'}
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Error:", error);
        elementos.tablaEquipos.innerHTML = `
            <tr>
                <td colspan="10" class="px-4 py-8 text-center text-red-500">
                    Error de conexión: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Mostrar equipos en la tabla
function mostrarEquipos(equipos) {
    if (equipos.length === 0) {
        elementos.tablaEquipos.innerHTML = `
            <tr>
                <td colspan="10" class="px-4 py-8 text-center text-gray-500">
                    No hay equipos registrados
                </td>
            </tr>
        `;
        return;
    }
    
    elementos.tablaEquipos.innerHTML = equipos.map((equipo, index) => `
        <tr class="hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            <td class="px-4 py-3 text-sm">${equipo.codigo}</td>
            <td class="px-4 py-3 text-sm">${equipo.tipo}</td>
            <td class="px-4 py-3 text-sm">${equipo.marcas}</td>
            <td class="px-4 py-3 text-sm">${equipo.modelo}</td>
            <td class="px-4 py-3 text-sm">${equipo.so}</td>
            <td class="px-4 py-3 text-sm">${equipo.almacenamiento} GB</td>
            <td class="px-4 py-3 text-sm">${equipo.ram} GB</td>
            <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    equipo.estado.toLowerCase() === 'operativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }">${equipo.estado}</span>
            </td>
            <td class="px-4 py-3 text-sm">${formatearFecha(equipo.mantenimiento)}</td>
            <td class="px-4 py-3">
                <div class="flex gap-1 justify-center">
                    <button onclick="editar(${equipo.id})" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs" title="Editar">✏️</button>
                    <button onclick="eliminar(${equipo.id}, '${equipo.codigo}')" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs" title="Eliminar">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ============================================
// FUNCIÓN: Editar equipo
// ============================================
// Usa prompts simples para solicitar nuevos valores
// y actualiza el equipo mediante PUT request
function editar(id) {
    const codigo = prompt('Nuevo código:');
    const tipo = prompt('Nuevo tipo (Laptop/Desktop/Servidor/Impresora):');
    const marcas = prompt('Nueva marca:');
    const modelo = prompt('Nuevo modelo:');
    const so = prompt('Nuevo SO:');
    const almacenamiento = prompt('Nuevo almacenamiento (GB):');
    const ram = prompt('Nueva RAM (GB):');
    const estado = prompt('Nuevo estado:');
    const mantenimiento = prompt('Nueva fecha de mantenimiento (YYYY-MM-DD):');
    
    if (!codigo || !tipo || !marcas || !modelo || !so || !almacenamiento || !ram || !estado || !mantenimiento) {
        return alert('Todos los campos son obligatorios');
    }
    
    fetch(`${CONFIG.API_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, tipo, marcas, modelo, so, almacenamiento: Number(almacenamiento), ram: Number(ram), estado, mantenimiento })
    })
    .then(r => r.json())
    .then(d => {
        if (d.ok) {
            mensajesHandler.mostrar('✓ Equipo actualizado', 'exito');
            cargarEquipos();
        } else {
            mensajesHandler.mostrar(d.error || 'Error al actualizar', 'error');
        }
    })
    .catch(e => mensajesHandler.mostrar('Error: ' + e.message, 'error'));
}

// ============================================
// FUNCIÓN: Eliminar equipo
// ============================================
// Solicita confirmación y elimina mediante DELETE request
function eliminar(id, codigo) {
    if (!confirm(`¿Eliminar equipo ${codigo}?`)) return;
    
    fetch(`${CONFIG.API_ENDPOINT}/${id}`, { method: 'DELETE' })
    .then(r => r.json())
    .then(d => {
        if (d.ok) {
            mensajesHandler.mostrar('✓ Equipo eliminado', 'exito');
            cargarEquipos();
        } else {
            mensajesHandler.mostrar(d.error || 'Error al eliminar', 'error');
        }
    })
    .catch(e => mensajesHandler.mostrar('Error: ' + e.message, 'error'));
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================
function inicializar() {
    // Cachear elementos DOM
    elementos.tablaEquipos = document.getElementById('tablaEquipos');
    elementos.mensaje = document.getElementById('mensaje');
    
    // Cargar equipos al iniciar
    cargarEquipos();
    
    console.log("✓ Lista de equipos inicializada");
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
