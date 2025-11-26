// ==========================================
// RELOJ DIGITAL INTERACTIVO CON ALARMA
// ==========================================

// ===== VARIABLES GLOBALES =====

// Objeto para almacenar configuración de alarma
const alarmaConfig = {
    activa: false,           // Estado de la alarma
    horaConfigrada: null,    // Hora configurada (formato 24h)
    sonando: false           // Si la alarma está sonando actualmente
};

// Modo 24h/12h
let modo24h = true;

// Array de meses en español
const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ===== ELEMENTOS DEL DOM =====

const elementoReloj = document.getElementById('reloj');
const elementoFecha = document.getElementById('fecha');
const elementoSaludo = document.getElementById('greeting');
const inputHoraAlarma = document.getElementById('horaAlarma');
const btnEstablecerAlarma = document.getElementById('btnEstablecerAlarma');
const btnCancelarAlarma = document.getElementById('btnCancelarAlarma');
const estadoAlarmaElement = document.getElementById('estadoAlarma');
const indicadorAlarma = document.getElementById('indicadorAlarma');
const notificacionAlarma = document.getElementById('notificacionAlarma');
const btnDespedirAlarma = document.getElementById('btnDespedirAlarma');
const toggleFormatBtn = document.getElementById('toggleFormat');

// ===== FUNCIÓN PRINCIPAL: Actualizar reloj =====

/**
 * Actualiza el reloj, la fecha, el saludo y verifica la alarma
 * Se ejecuta cada segundo mediante setInterval
 */
function actualizarReloj() {
    // Obtener hora actual
    const ahora = new Date();
    
    // Actualizar display del reloj
    actualizarDisplayReloj(ahora);
    
    // Actualizar fecha
    actualizarDisplayFecha(ahora);
    
    // Actualizar saludo
    actualizarSaludo(ahora);
    
    // Verificar si debe sonar la alarma
    verificarAlarma(ahora);
}

// ===== FUNCIÓN: Formatear números con ceros a la izquierda =====

/**
 * Agrega ceros a la izquierda si el número es menor a 10
 * @param {number} numero - Número a formatear
 * @returns {string} - Número con ceros a la izquierda
 */
function formatearNumero(numero) {
    return numero < 10 ? '0' + numero : numero;
}

// ===== FUNCIÓN: Actualizar display del reloj =====

/**
 * Actualiza el display del reloj en formato 24h o 12h
 * @param {Date} ahora - Objeto Date con hora actual
 */
function actualizarDisplayReloj(ahora) {
    let horas = ahora.getHours();
    const minutos = formatearNumero(ahora.getMinutes());
    const segundos = formatearNumero(ahora.getSeconds());
    
    let formato = '';
    
    if (modo24h) {
        // Formato 24 horas
        horas = formatearNumero(horas);
        formato = `${horas}:${minutos}:${segundos}`;
    } else {
        // Formato 12 horas con AM/PM
        const periodo = horas >= 12 ? 'PM' : 'AM';
        horas = horas % 12 || 12; // Convertir a 12h (0 se convierte en 12)
        horas = formatearNumero(horas);
        formato = `${horas}:${minutos}:${segundos} ${periodo}`;
    }
    
    elementoReloj.textContent = formato;
}

// ===== FUNCIÓN: Actualizar display de fecha =====

/**
 * Actualiza el display de la fecha con formato: Día, DD de Mes de YYYY
 * @param {Date} ahora - Objeto Date con fecha actual
 */
function actualizarDisplayFecha(ahora) {
    // Array de días de la semana en español
    const diasSemana = [
        'Domingo', 'Lunes', 'Martes', 'Miércoles', 
        'Jueves', 'Viernes', 'Sábado'
    ];
    
    const dia = ahora.getDay();
    const fecha = ahora.getDate();
    const mes = ahora.getMonth();
    const año = ahora.getFullYear();
    
    // Formato: Lunes, 26 de Noviembre de 2025
    const fechaFormato = `${diasSemana[dia]}, ${formatearNumero(fecha)} de ${meses[mes]} de ${año}`;
    
    elementoFecha.textContent = fechaFormato;
}

// ===== FUNCIÓN: Actualizar saludo según hora del día =====

/**
 * Muestra un saludo diferente según la hora del día
 * @param {Date} ahora - Objeto Date con hora actual
 */
function actualizarSaludo(ahora) {
    const horas = ahora.getHours();
    let saludo = '';
    
    // Clasificar según hora del día
    if (horas >= 6 && horas < 12) {
        saludo = '🌅 Buenos días';
    } else if (horas >= 12 && horas < 18) {
        saludo = '☀️ Buenas tardes';
    } else if (horas >= 18 && horas < 24) {
        saludo = '🌙 Buenas noches';
    } else {
        // Madrugada (00:00 - 06:00)
        saludo = '🌃 Buenas madrugadas';
    }
    
    elementoSaludo.textContent = saludo;
}

// ===== FUNCIÓN: Establecer alarma =====

/**
 * Establece una alarma en la hora seleccionada
 * Valida que la hora sea futura
 */
function establecerAlarma() {
    // Obtener la hora del input
    const horaSeleccionada = inputHoraAlarma.value;
    
    // Validar que haya seleccionado una hora
    if (!horaSeleccionada) {
        alert('Por favor selecciona una hora');
        return;
    }
    
    // Parsear la hora (formato HH:MM)
    const [horas, minutos] = horaSeleccionada.split(':').map(Number);
    
    // Obtener hora actual
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    
    // Convertir a minutos desde medianoche para comparación
    const minutosTotalesAlarma = horas * 60 + minutos;
    const minutosTotalesActual = horaActual * 60 + minutosActual;
    
    // Validar que la alarma sea futura
    if (minutosTotalesAlarma <= minutosTotalesActual) {
        alert('⚠️ La hora de la alarma debe ser futura. Por favor selecciona una hora posterior a la actual.');
        return;
    }
    
    // Guardar configuración de alarma
    alarmaConfig.horaConfigrada = horaSeleccionada;
    alarmaConfig.activa = true;
    
    // Actualizar UI
    actualizarUIAlarma();
    
    console.log(`✓ Alarma establecida para las ${horaSeleccionada}`);
}

// ===== FUNCIÓN: Cancelar alarma =====

/**
 * Desactiva la alarma configurada
 */
function cancelarAlarma() {
    // Resetear configuración
    alarmaConfig.activa = false;
    alarmaConfig.horaConfigrada = null;
    alarmaConfig.sonando = false;
    
    // Limpiar input
    inputHoraAlarma.value = '';
    
    // Actualizar UI
    actualizarUIAlarma();
    
    // Ocultar notificación si estaba visible
    notificacionAlarma.classList.remove('visible');
    
    console.log('✓ Alarma cancelada');
}

// ===== FUNCIÓN: Verificar si debe sonar la alarma =====

/**
 * Compara la hora actual con la alarma configurada
 * Si coinciden, activa la alarma
 * @param {Date} ahora - Objeto Date con hora actual
 */
function verificarAlarma(ahora) {
    // Si no hay alarma activa, no hacer nada
    if (!alarmaConfig.activa) {
        return;
    }
    
    // Obtener hora y minuto actual
    const horaActual = formatearNumero(ahora.getHours());
    const minutosActual = formatearNumero(ahora.getMinutes());
    const horaFormato = `${horaActual}:${minutosActual}`;
    
    // Comparar con hora de alarma configurada
    if (horaFormato === alarmaConfig.horaConfigrada) {
        // Si no está sonando, sonar
        if (!alarmaConfig.sonando) {
            sonarAlarma();
        }
    }
}

// ===== FUNCIÓN: Sonar alarma =====

/**
 * Activa la alarma: notificación visual, sonido y animación de parpadeo
 */
function sonarAlarma() {
    alarmaConfig.sonando = true;
    
    // Mostrar notificación
    notificacionAlarma.classList.add('visible');
    
    // Reproducir sonido (simulado con alert)
    // En una aplicación real, usarías Web Audio API
    reproducirSonidoAlarma();
    
    // Agregar clase de parpadeo al contenedor
    const container = document.querySelector('.container');
    container.classList.add('alarma-activa');
    
    console.log('🔔 ¡ALARMA SONANDO!');
}

// ===== FUNCIÓN: Reproducir sonido de alarma =====

/**
 * Simula el sonido de alarma usando alert
 * Nota: En producción se usaría Web Audio API
 */
function reproducirSonidoAlarma() {
    // Simulación visual y sonora
    let contador = 0;
    const intervaloSonido = setInterval(() => {
        contador++;
        // Reproducir 5 "beeps"
        if (contador <= 5) {
            // En navegadores modernos, esto produce un sonido
            console.log('📢 Beep ' + contador);
        } else {
            clearInterval(intervaloSonido);
        }
    }, 400);
}

// ===== FUNCIÓN: Despeñir alarma =====

/**
 * Desactiva la alarma que está sonando
 */
function despedirAlarma() {
    alarmaConfig.sonando = false;
    
    // Ocultar notificación
    notificacionAlarma.classList.remove('visible');
    
    // Remover clase de parpadeo
    const container = document.querySelector('.container');
    container.classList.remove('alarma-activa');
    
    // Desactivar alarma automáticamente
    cancelarAlarma();
    
    console.log('✓ Alarma desactivada');
}

// ===== FUNCIÓN: Actualizar UI de alarma =====

/**
 * Actualiza los elementos de UI relacionados con la alarma
 */
function actualizarUIAlarma() {
    if (alarmaConfig.activa) {
        // Mostrar estado
        estadoAlarmaElement.innerHTML = `
            <p class="alarm-active">
                ✓ Alarma activa para las <strong>${alarmaConfig.horaConfigrada}</strong>
            </p>
        `;
        
        // Activar botón cancelar
        btnCancelarAlarma.disabled = false;
        btnEstablecerAlarma.disabled = true;
        inputHoraAlarma.disabled = true;
        
        // Mostrar indicador
        indicadorAlarma.classList.add('visible');
    } else {
        // Mostrar estado desactivado
        estadoAlarmaElement.innerHTML = `<p>Sin alarma configurada</p>`;
        
        // Desactivar botón cancelar
        btnCancelarAlarma.disabled = true;
        btnEstablecerAlarma.disabled = false;
        inputHoraAlarma.disabled = false;
        
        // Ocultar indicador
        indicadorAlarma.classList.remove('visible');
    }
}

// ===== FUNCIÓN: Toggle formato 24h/12h =====

/**
 * Cambia entre formato 24h y 12h
 */
function toggleFormato() {
    modo24h = !modo24h;
    toggleFormatBtn.textContent = modo24h ? '24h' : '12h';
    console.log(`Formato: ${modo24h ? '24 horas' : '12 horas'}`);
}

// ===== EVENT LISTENERS =====

// Botón establecer alarma
btnEstablecerAlarma.addEventListener('click', establecerAlarma);

// Botón cancelar alarma
btnCancelarAlarma.addEventListener('click', cancelarAlarma);

// Botón despeñir alarma
btnDespedirAlarma.addEventListener('click', despedirAlarma);

// Toggle formato
toggleFormatBtn.addEventListener('click', toggleFormato);

// Enter en input de hora
inputHoraAlarma.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        establecerAlarma();
    }
});

// ===== INICIALIZACIÓN =====

/**
 * Inicia la aplicación cuando el DOM está listo
 */
function inicializar() {
    // Actualizar reloj inmediatamente
    actualizarReloj();
    
    // Configurar actualización cada segundo
    setInterval(actualizarReloj, 1000);
    
    // Actualizar UI de alarma
    actualizarUIAlarma();
    
    console.log('✓ Reloj digital inicializado');
}

// Iniciar cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}
