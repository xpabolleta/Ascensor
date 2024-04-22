const ANCHO = 0;
const LARGO = 1;
const PESO = 2;
const ASCENSOR = 4;
const PISOB = 0;
const PISO1 = 1;
const PISO2 = 2;
const PISO3 = 3;

const BOTON_CREAR = document.getElementById("crear_caja");
const FORMULARIO = document.querySelector("form");
/*const BOTON_B = document.getElementById("boton_pisoB");
const BOTON_1 = document.getElementById("boton_piso1");
const BOTON_2 = document.getElementById("boton_piso2");
const BOTON_3 = document.getElementById("boton_piso3");*/
const ALMACEN = document.getElementById("almacen");

let ascensor = {id : ASCENSOR, posicion : PISOB, estado : 0, pila : Array(), carga : Array()}
let pisoB = {id : PISOB, carga : Array()}
let piso1 = {id : PISO1, carga : Array()}
let piso2 = {id : PISO2, carga : Array()}
let piso3 = {id : PISO3, carga : Array()}
let botones = {botonB : 0, boton1 : 0, boton2 : 0, boton3 : 0,}
let cajas = Array();
let identificador = 0;

function Caja(id,dimension,posicion){

    this.id = id;
    this.dimension = dimension;
    this.posicion = posicion;
    
}

BOTON_CREAR.addEventListener("click", OpenPopup);
FORMULARIO.addEventListener("submit", CrearCaja);
FORMULARIO.addEventListener("reset", ClosePopup);

function OpenPopup(){

    document.getElementById("popup").style.display = "block";
    return;

}
function ClosePopup(){

    document.getElementById("popup").style.display = "none";
    return;

}

function CrearCaja(event){

    event.preventDefault();
    let largo = document.forms["create"]["largo"].value;
    let ancho = document.forms["create"]["ancho"].value;
    let peso = document.forms["create"]["peso"].value;
    let dimension = Array(ancho,largo,peso);
    let caja = new Caja(identificador,dimension,PISOB);
    let nueva_caja = document.createElement("div");
    let nuevo_id = document.createTextNode(identificador);

    if((largo < 10)||(ancho < 10)){

        alert("Tamaño incorrecto! \n El tamaño minimo es de 10cm");
        return;

    }
    
    cajas[identificador] = caja;
    pisoB["carga"].push(identificador);
    nueva_caja.appendChild(nuevo_id);
    nueva_caja.className = "caja";
    nueva_caja.id = "caja" + identificador;
    nueva_caja.style.width = (ancho * (100/250)) + "%";
    nueva_caja.style.height = (largo * (100/250)) + "%";
    ALMACEN.appendChild(nueva_caja);
    identificador ++;
    ClosePopup();
    return;
}