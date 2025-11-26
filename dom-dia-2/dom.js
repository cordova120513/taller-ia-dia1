// Estoy creando una calculadora de operaciones básicas para javascript

//Suma
function sumar(a, b) {
    return a + b;
}

//Resta
function restar(a, b) {
    return a - b;
}

//Multiplicación
function multiplicar(a, b) {
    return a * b;
}

//División
function dividir(a, b) {
    if (b === 0) {
        return "Error: División por cero";
    }
    return a / b;
}

//Probando las funciones con diferentes valores
console.log("Suma: " + sumar(5, 3)); // 8
console.log("Resta: " + restar(10, 4)); // 6
console.log("Multiplicación: " + multiplicar(7, 6)); // 42
console.log("División: " + dividir(20, 5)); // 4
console.log("División por cero: " + dividir(10, 0)); // Error: División por cero