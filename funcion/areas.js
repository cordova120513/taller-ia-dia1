//crea una funcion para calcular el area de un circulo dado su radio
/**
 * Calcula el área de un círculo dado su radio.
 * @param {number} radio - El radio del círculo.
 * @returns {number} El área del círculo.
 * @example
 * areacirculo(5); // Returns approximately 78.54
 */
function areacirculo(radio) {
    return Math.PI * Math.pow(radio, 2);
}

// crea una funcion para calcular el area de un rectangulo dado su base y altura
/**
 * Calcula el área de un rectángulo dada su base y altura.
 * @param {number} base - La base del rectángulo.
 * @param {number} altura - La altura del rectángulo.
 * @returns {number} El área del rectángulo.
 */
function arearectangulo(base, altura) {
    return base * altura;
}



/**
 * Calcula el volumen de un cilindro dado su radio y altura.
 * @param {number} radio - El radio del cilindro.
 * @param {number} altura - La altura del cilindro.
 * @returns {number} El volumen del cilindro.
 * @example
 * volumencilindro(2, 5); // Devuelve aproximadamente 62.83
 */
function volumencilindro(radio, altura) {
    const areabase = areacirculo(radio);
    return areabase * altura;

}

/**
 * Calcula la derivada de una función polinomial simple de la forma ax^n.
 * @param {number} coeficiente - El coeficiente 'a' de la función.
 * @param {number} exponente - El exponente 'n' de la función.
 * @returns {{coeficiente: number, exponente: number}} Un objeto con el nuevo coeficiente y el nuevo exponente.
 * @example
 * derivadaPolinomial(5, 3); // Returns { coeficiente: 15, exponente: 2 } (para 5x^3 -> 15x^2)
 * derivadaPolinomial(7, 1); // Returns { coeficiente: 7, exponente: 0 } (para 7x -> 7)
 * derivadaPolinomial(10, 0); // Returns { coeficiente: 0, exponente: -1 } (para 10 -> 0)
 */
function derivadaPolinomial(coeficiente, exponente) {
    if (exponente === 0) {
        return { coeficiente: 0, exponente: -1 };
    }
    const nuevoCoeficiente = coeficiente * exponente;
    const nuevoExponente = exponente - 1;
    return { coeficiente: nuevoCoeficiente, exponente: nuevoExponente };
    //crea una funcion para calcular una integral simple de una funcion polinomial de la forma ax^n 
    /**
     * Calcula la integral de una función polinomial simple de la forma ax^n.
     * @param {number} coeficiente - El coeficiente 'a' de la función.
     * @param {number} exponente - El exponente 'n' de la función.
     * @returns {{coeficiente: number, exponente: number}} Un objeto con el nuevo coeficiente y el nuevo exponente.
     * @example
     * integralPolinomial(5, 3); // Returns { coeficiente: 5/4, exponente: 4 } (para 5x^3 -> 5/4x^4)
     * integralPolinomial(7, 1); // Returns { coeficiente: 7/2, exponente: 2 } (para 7x -> 7/2x^2)
     * integralPolinomial(10, 0); // Returns { coeficiente: 10, exponente: 1 } (para 10 -> 10x)
     */
    function integralPolinomial(coeficiente, exponente) {
        if (exponente === 0) {
            return { coeficiente: coeficiente, exponente: 1 };
        }
        const nuevoCoeficiente = coeficiente / (exponente + 1);
        const nuevoExponente = exponente + 1;
        return { coeficiente: nuevoCoeficiente, exponente: nuevoExponente };
    }
}



