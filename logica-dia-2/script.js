//Ejercicio: Array y objetos
//1. array(listas)
//crea una lista de tus 3 comidas favoritas
let comidasFavoritas = ["Pizza", "Sushi", "Tacos"];

//2. objeto(key y value)

let persona = {
    nombre: "Juan",
    edad: 30,
    ciudad: "Madrid",
    habilidades: ["programación", "dibujo", "cocina"],
    estatura: 1.75,
    programador: true

};

//como accedo a la propiedoad nombre de mi objeto persona
console.log(persona.nombre);
//como accedo a la propiedad habilidades de mi objeto persona
console.log(persona.habilidades);
//como accedo a  la habilidad de dibujo de mi objeto persona
console.log(persona.habilidades[1]);
//3. array de objetos
// crea un lista de 3 alumnos(objetos) con nombre y calificacion
let alumnos = [
    { nombre: "Ana", calificacion: 85 },
    { nombre: "Luis", calificacion: 90 },
    { nombre: "Marta", calificacion: 95 },
    {nombre: "Carlos", }
];
// escribe un bucle que recorra al array de alumnos e imprima solo los que tenga una calificacion mayor a 80
for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].calificacion > 80) {
        console.log(alumnos[i].nombre + " tiene una calificacion de " + alumnos[i].calificacion);
    }
}