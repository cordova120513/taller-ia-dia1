/**
 * Generador de Colores Aleatorios
 * Script JavaScript vanilla que genera colores hexadecimales aleatorios
 * con funcionalidad de copiar al portapapeles
 */

// Referencias a elementos del DOM
const colorDisplay = document.getElementById('colorDisplay');
const colorCode = document.getElementById('colorCode');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const drawBtn = document.getElementById('drawBtn');
const copyFeedback = document.getElementById('copyFeedback');
const drawFeedback = document.getElementById('drawFeedback');

// Referencias del modal de dibujo
const drawModal = document.getElementById('drawModal');
const closeDrawBtn = document.getElementById('closeDrawBtn');
const drawingCanvas = document.getElementById('drawingCanvas');
const clearCanvasBtn = document.getElementById('clearCanvasBtn');
const saveDrawingBtn = document.getElementById('saveDrawingBtn');
const brushSizeInput = document.getElementById('brushSize');
const brushSizeDisplay = document.getElementById('brushSizeDisplay');
const drawColorBox = document.getElementById('drawColorDisplay');
const drawColorCode = document.getElementById('drawColorCode');

// Variable para almacenar el color actual
let currentColor = '#FFFFFF';

// Variables para el canvas
let isDrawing = false;
let ctx = null;
let lastX = 0;
let lastY = 0;

/**
 * Genera un color hexadecimal aleatorio (#RRGGBB)
 * @returns {string} Código hexadecimal del color en formato #RRGGBB
 */
function generateRandomColor() {
    // Genera tres números aleatorios entre 0 y 255
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // Convierte cada número a hexadecimal y rellena con ceros si es necesario
    const hex = '#' + [r, g, b].map(x => {
        const hexValue = x.toString(16);
        // Asegura que cada valor tenga 2 dígitos (ej: 0F en lugar de F)
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
    }).join('').toUpperCase();
    
    return hex;
}

/**
 * Actualiza el color mostrado en la interfaz
 * Cambia el fondo del div, el texto del código hexadecimal
 * y aplica animación visual
 * @param {string} color - Código hexadecimal del color a mostrar
 */
function updateColorDisplay(color) {
    // Actualiza el color de fondo del div
    colorDisplay.style.backgroundColor = color;
    
    // Actualiza el texto con el código hexadecimal
    colorCode.textContent = color;
    
    // Almacena el color actual
    currentColor = color;
    
    // Aplica animación visual al cambiar color
    colorDisplay.classList.remove('changing');
    // Fuerza un reflow para reiniciar la animación
    void colorDisplay.offsetWidth;
    colorDisplay.classList.add('changing');
}

/**
 * Maneja el evento de clic en el botón "Generar Color"
 * Genera un nuevo color aleatorio y actualiza la pantalla
 */
function handleGenerateColor() {
    const newColor = generateRandomColor();
    updateColorDisplay(newColor);
}

/**
 * Copia el código hexadecimal al portapapeles
 * Utiliza la API moderna de Clipboard si está disponible
 * con fallback a método antiguo (seleccionar y copiar)
 */
async function copyToClipboard() {
    try {
        // Usa la API moderna de Clipboard (navegadores modernos)
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(currentColor);
            showCopyFeedback();
        } else {
            // Fallback para navegadores antiguos
            copyWithOldMethod();
        }
    } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        // Si falla, intenta el método antiguo
        copyWithOldMethod();
    }
}

/**
 * Método antiguo para copiar al portapapeles
 * Crea un textarea temporal, copia el texto y lo elimina
 */
function copyWithOldMethod() {
    const textarea = document.createElement('textarea');
    textarea.value = currentColor;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (error) {
        console.error('Error con método antiguo:', error);
        alert('No se pudo copiar el código. Por favor, cópialo manualmente: ' + currentColor);
    } finally {
        document.body.removeChild(textarea);
    }
}

/**
 * Muestra el mensaje de confirmación visual
 * Aparece en la esquina superior derecha y desaparece después de 2 segundos
 */
function showCopyFeedback() {
    // Añade la clase 'show' para mostrar el feedback
    copyFeedback.classList.add('show');
    
    // Elimina la clase después de 2 segundos para ocultar el mensaje
    setTimeout(() => {
        copyFeedback.classList.remove('show');
    }, 2000);
}

/**
 * Maneja el evento de clic en el botón "Copiar Código"
 * Llama a la función de copiar al portapapeles
 */
function handleCopyColor() {
    copyToClipboard();
}

/**
 * Muestra el mensaje de feedback del canvas
 */
function showDrawFeedback() {
    drawFeedback.classList.add('show');
    setTimeout(() => {
        drawFeedback.classList.remove('show');
    }, 2000);
}

/**
 * Abre el modal de dibujo y configura el canvas
 */
function openDrawingModal() {
    drawModal.classList.add('active');
    showDrawFeedback();
    
    // Configura el canvas
    setTimeout(() => {
        resizeCanvas();
        ctx = drawingCanvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSizeInput.value;
        ctx.strokeStyle = currentColor;
        
        // Actualiza el color mostrado en el modal
        drawColorBox.style.backgroundColor = currentColor;
        drawColorCode.textContent = currentColor;
    }, 10);
}

/**
 * Cierra el modal de dibujo
 */
function closeDrawingModal() {
    drawModal.classList.remove('active');
    isDrawing = false;
}

/**
 * Redimensiona el canvas para que tenga el tamaño correcto
 */
function resizeCanvas() {
    const rect = drawingCanvas.getBoundingClientRect();
    drawingCanvas.width = rect.width;
    drawingCanvas.height = rect.height;
}

/**
 * Inicia el dibujo
 */
function startDrawing(e) {
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    const scaleX = drawingCanvas.width / rect.width;
    const scaleY = drawingCanvas.height / rect.height;
    
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
}

/**
 * Dibuja en el canvas mientras se mueve el ratón
 */
function draw(e) {
    if (!isDrawing || !ctx) return;
    
    const rect = drawingCanvas.getBoundingClientRect();
    const scaleX = drawingCanvas.width / rect.width;
    const scaleY = drawingCanvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Dibuja una línea desde el último punto al punto actual
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSizeInput.value;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
}

/**
 * Finaliza el dibujo
 */
function stopDrawing() {
    isDrawing = false;
}

/**
 * Limpia el canvas
 */
function clearCanvas() {
    if (ctx) {
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
}

/**
 * Guarda el dibujo como imagen PNG
 */
function saveDrawing() {
    const link = document.createElement('a');
    link.href = drawingCanvas.toDataURL('image/png');
    link.download = `dibujo-${currentColor}.png`;
    link.click();
}

/**
 * Actualiza el tamaño del pincel
 */
function updateBrushSize() {
    brushSizeDisplay.textContent = brushSizeInput.value + 'px';
    if (ctx) {
        ctx.lineWidth = brushSizeInput.value;
    }
}

/**
 * Inicializa la aplicación
 * Configura los event listeners y genera un color inicial
 */
function init() {
    // Genera un color aleatorio al cargar la página
    const initialColor = generateRandomColor();
    updateColorDisplay(initialColor);
    
    // Añade listeners a los botones principales
    generateBtn.addEventListener('click', handleGenerateColor);
    copyBtn.addEventListener('click', handleCopyColor);
    drawBtn.addEventListener('click', openDrawingModal);
    
    // Event listeners para el modal de dibujo
    closeDrawBtn.addEventListener('click', closeDrawingModal);
    clearCanvasBtn.addEventListener('click', clearCanvas);
    saveDrawingBtn.addEventListener('click', saveDrawing);
    brushSizeInput.addEventListener('input', updateBrushSize);
    
    // Cierra el modal al hacer clic fuera del contenedor
    drawModal.addEventListener('click', (e) => {
        if (e.target === drawModal) {
            closeDrawingModal();
        }
    });
    
    // Event listeners para dibujar
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);
    
    // Soporte para touch en móviles
    drawingCanvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        drawingCanvas.dispatchEvent(mouseEvent);
    });
    
    drawingCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        drawingCanvas.dispatchEvent(mouseEvent);
    });
    
    drawingCanvas.addEventListener('touchend', (e) => {
        const mouseEvent = new MouseEvent('mouseup', {});
        drawingCanvas.dispatchEvent(mouseEvent);
    });
    
    // También permite generar color al hacer clic en el div
    colorDisplay.addEventListener('click', handleGenerateColor);
    
    // Soporte para teclado: presionar Enter genera color
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !drawModal.classList.contains('active')) {
            handleGenerateColor();
        }
        if (event.key === 'Escape') {
            closeDrawingModal();
        }
    });
}

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', init);
