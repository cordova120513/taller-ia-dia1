# ⏰ Reloj Digital Interactivo con Alarma

Un reloj digital moderno con interfaz tipo pantalla digital y funcionalidad de alarma completamente funcional.

## 🎯 Características

### ✅ Funcionalidades Principales

1. **Reloj Digital en Tiempo Real**
   - Display grande y legible (HH:MM:SS)
   - Actualización cada segundo
   - Formato 24h/12h con toggle
   - Efecto de brillo digital (glow)

2. **Fecha Completa**
   - Formato: Día, DD de Mes de YYYY
   - Nombres de días y meses en español
   - Actualización automática

3. **Sistema de Alarma**
   - Configuración de hora mediante input type="time"
   - Validación de hora futura
   - Activación/Cancelación de alarma
   - Estado visible de alarma activa
   - Indicador visual parpadeante

4. **Notificación de Alarma**
   - Alerta visual con animación
   - Mensaje indicativo
   - Botón para desactivar
   - Parpadeo del contenedor durante la alarma

5. **Extras Incluidos**
   - Saludo según hora del día:
     - 🌅 Buenos días (6:00 - 12:00)
     - ☀️ Buenas tardes (12:00 - 18:00)
     - 🌙 Buenas noches (18:00 - 24:00)
     - 🌃 Buenas madrugadas (00:00 - 6:00)
   - Toggle entre formato 24h y 12h
   - Diseño responsivo
   - Animaciones suaves

## 🖥️ Cómo Usar

1. Abre `index.html` en tu navegador
2. Observa el reloj actualizado en tiempo real
3. Para configurar una alarma:
   - Haz clic en el input de hora
   - Selecciona la hora deseada (debe ser posterior a la actual)
   - Haz clic en "Establecer Alarma" o presiona Enter
4. El indicador se volverá verde cuando la alarma esté activa
5. Cuando suene la alarma:
   - Aparecerá una notificación con animación
   - El contenedor parpadeará
   - Haz clic en "Desactivar" para cerrar

## 📁 Estructura de Archivos

```
reloj-digital-alarma/
├── index.html      # Estructura HTML
├── script.js       # Lógica JavaScript (310+ líneas comentadas)
├── style.css       # Estilos CSS con animaciones
└── README.md       # Este archivo
```

## 🎨 Diseño Visual

- **Tema Oscuro**: Fondo oscuro con acentos azul/verde
- **Efecto Digital**: Texto con brillo (glow effect)
- **Gradientes**: Botones con gradientes modernos
- **Animaciones**: 
  - Parpadeo de indicador
  - Glow dinámico del reloj
  - Animación pop-up de alarma
  - Parpadeo de alerta

## 💻 JavaScript Vanilla (Sin Frameworks)

El código incluye:

- ✅ Comentarios exhaustivos en cada función
- ✅ Variables globales documentadas
- ✅ Actualización cada segundo con `setInterval`
- ✅ Formateo con ceros a la izquierda (08:05:03)
- ✅ Comparación inteligente de horas
- ✅ Validación de entrada
- ✅ Manejo de eventos
- ✅ Manipulación del DOM
- ✅ Almacenamiento de configuración

## 📋 Flujo del Programa

```
1. INICIALIZACIÓN
   ├── Cargar elementos del DOM
   ├── Actualizar reloj inmediatamente
   └── Configurar setInterval (cada 1000ms)

2. CADA SEGUNDO - actualizarReloj()
   ├── Obtener fecha y hora actual
   ├── Actualizar display del reloj
   ├── Actualizar fecha
   ├── Actualizar saludo
   └── Verificar si debe sonar alarma

3. ESTABLECER ALARMA
   ├── Validar que hora sea futura
   ├── Guardar configuración
   └── Actualizar UI

4. VERIFICAR ALARMA
   ├── Comparar hora actual con alarma
   ├── Si coinciden → sonarAlarma()
   └── Mostrar notificación

5. DESACTIVAR
   ├── Ocultar notificación
   ├── Remover animaciones
   └── Resetear configuración
```

## 🔧 Tecnologías

- **HTML5**: Semántica moderna
- **CSS3**: Gradientes, animaciones, flexbox, media queries
- **JavaScript Vanilla**: Sin dependencias externas
- **Web APIs**: Date, setInterval, addEventListener

## 📱 Responsivo

Adaptado para:
- 📺 Pantallas de escritorio (1000px+)
- 💻 Tablets (768px - 1000px)
- 📱 Móviles (menos de 768px)
- 📵 Pantallas muy pequeñas (menos de 480px)

## 🎯 Ejemplos de Uso

### Configurar alarma para dentro de 5 minutos
1. Copia la hora actual
2. Suma 5 minutos
3. Pega en el input
4. Presiona "Establecer Alarma"

### Cambiar a formato 12h
- Haz clic en el botón "24h" para cambiar a "12h"
- El reloj mostrará: HH:MM:SS AM/PM

### Cancelar alarma
- Haz clic en "Cancelar Alarma" si aún no ha sonado
- O haz clic en "Desactivar" cuando esté sonando

## 🚀 Mejoras Futuras Opcionales

- [ ] Reproducir sonido real con Web Audio API
- [ ] Múltiples alarmas
- [ ] Almacenamiento con localStorage
- [ ] Temporizador (cuenta hacia atrás)
- [ ] Temas de color personalizables
- [ ] Integración con notificaciones del navegador

## 📄 Licencia

Libre para usar y modificar. Proyecto educativo.

---

**Autor**: Taller de Programación  
**Versión**: 1.0  
**Última actualización**: Noviembre 2025
