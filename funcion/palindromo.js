/**
 * Verifica si una cadena de texto es un palíndromo.
 * @param {string} texto - El texto a verificar.
 * @returns {boolean} - Verdadero si es palíndromo, falso en caso contrario.
 */
function esPalindromo(texto) {
    if (!texto) return false;

    // Convertir a minúsculas y eliminar caracteres no alfanuméricos
    const limpio = texto.toLowerCase().replace(/[\W_]/g, '');

    // Invertir la cadena limpia
    const invertido = limpio.split('').reverse().join('');

    return limpio === invertido;
}
