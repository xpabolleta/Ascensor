const ANCHO = 0;
const LARGO = 1;
const PESO = 2;
const CERRADO = 0;
const ABIERTO = 1;
const ABRIENDO = 2;
const CERRANDO = 3;
const PISOB = 0;
const PISO1 = 1;
const PISO2 = 2;
const PISO3 = 3;
const ASCENSOR = 4;

const BOTON_CREAR = document.getElementById("crear_caja");
const PUERTA_IZQ = document.getElementById("puerta_izq");
const PUERTA_DER = document.getElementById("puerta_der");
const FORMULARIO = document.querySelector("form");
const BOTONES = document.getElementsByClassName("boton");
const BOTON_B = document.getElementsByClassName("boton_pisoB");
const BOTON_1 = document.getElementsByClassName("boton_piso1");
const BOTON_2 = document.getElementsByClassName("boton_piso2");
const BOTON_3 = document.getElementsByClassName("boton_piso3");
const ALMACEN = document.getElementById("almacenB");
const POPUP = document.getElementById("popup");
const LED = document.getElementsByClassName("led");
const LEDB = document.getElementsByClassName("ledB");
const LED1 = document.getElementsByClassName("led1");
const LED2 = document.getElementsByClassName("led2");
const LED3 = document.getElementsByClassName("led3");

let cajas = Array();
let identificador = 0;
let piso3 = new Piso(PISO3);
let piso2 = new Piso(PISO2);
let piso1 = new Piso(PISO1);
let pisoB = new Piso(PISOB);
let ascensor = {
    id: ASCENSOR,
    carga: Array(),
    posicion : PISOB, 
    estado : ABIERTO, 
    pila : Array(4),
    añadirCaja : function(id){
        if(this.carga.indexOf(id) == -1){
            this.carga.push(id);
        }
    },
    eliminarCaja : function(id){
        this.carga.forEach(function(valor,indice,array) {
            if(id == valor){
                array.splice(indice,1);
            }
        });
    },
    isCaja : function(id){
        let aux = false;
        this.carga.forEach(element => {
            if(element == id){
                aux = true;
                return;
            }
        });
        return aux;
    }
}

function Piso(id){
    this.id = id;
    this.carga = Array();
    this.añadirCaja = function(id){
        if(this.carga.indexOf(id) == -1){
            this.carga.push(id);
        }
    }
    this.eliminarCaja = function(id){
        this.carga.forEach(function(valor,indice,array) {
            if(id == valor){
                array.splice(indice,1);
            }
        });
    }
    this.isCaja = function(id){
        let aux = false;
        this.carga.forEach(element => {
            if(element == id){
                aux = true;
                return;
            }
        });
        return aux;
    }
}

function Caja(id,dimension){

    this.id = id;
    this.dimension = dimension;
    
}

function whereCaja(id){
    
    if(ascensor.isCaja(id)){return ascensor;}
    else if(pisoB.isCaja(id)){return pisoB;}
    else if(piso1.isCaja(id)){return piso1;}
    else if(piso2.isCaja(id)){return piso2;}
    else if(piso3.isCaja(id)){return piso3;}
    else{return null};
    
}
let TEMP_MAIN = setInterval(main,4000);
BOTON_CREAR.addEventListener("click", OpenPopup);
FORMULARIO.addEventListener("submit", CrearCaja);
FORMULARIO.addEventListener("reset", ClosePopup);
Array.from(BOTONES).forEach(el => {el.addEventListener("click", Llamada);});


function main(){
    if(ascensor.pila.every(el => el == null)){return;}
    if((ascensor.pila[0] - ascensor.posicion) > 0){
        ascensor.posicion++;
    }else{
        ascensor.posicion--;
    }
    switch(ascensor.posicion){
        case PISOB:
            Array.from(LED).forEach(el => {el.style.background = "";});
            Array.from(LEDB).forEach(el => {el.style.background = "red";});
            Array.from(BOTON_B).forEach(el => {el.style.background = "";});
            break;
        case PISO1:
            Array.from(LED).forEach(el => {el.style.background = "";});
            Array.from(LED1).forEach(el => {el.style.background = "red";});
            Array.from(BOTON_1).forEach(el => {el.style.background = "";});
            break;
        case PISO2:
            Array.from(LED).forEach(el => {el.style.background = "";});
            Array.from(LED2).forEach(el => {el.style.background = "red";});
            Array.from(BOTON_2).forEach(el => {el.style.background = "";});
            break;
        case PISO3:
            Array.from(LED).forEach(el => {el.style.background = "";});
            Array.from(LED3).forEach(el => {el.style.background = "red";});
            Array.from(BOTON_3).forEach(el => {el.style.background = "";});
            break;
    }
    if(ascensor.pila[0] == ascensor.posicion){
        ascensor.pila.shift();
        ascensor.pila.length = 4;
        //clearInterval(TEMP_MAIN);
        //AbrirPuerta();
    }
}
function OpenPopup(){

    POPUP.style.display = "block";
    return;

}
function ClosePopup(){

    POPUP.style.display = "none";
    return;

}
function CrearCaja(event){

    event.preventDefault();
    let largo = document.forms["create"]["largo"].value;
    let ancho = document.forms["create"]["ancho"].value;
    let peso = document.forms["create"]["peso"].value;
    let dimension = Array(ancho,largo,peso);
    let caja = new Caja(("caja" + identificador),dimension);
    let nueva_caja = document.createElement("div");
    let nuevo_id = document.createTextNode(identificador);

    cajas[identificador] = caja;
    pisoB.añadirCaja("caja" + identificador);
    nueva_caja.appendChild(nuevo_id);
    nueva_caja.className = "caja";
    nueva_caja.id = "caja" + identificador;
    nueva_caja.draggable = true;
    nueva_caja.ondragstart = drag;
    nueva_caja.style.width = (ancho * (100/250)) + "%";
    nueva_caja.style.height = (largo * (100/200)) + "%";
    ALMACEN.appendChild(nueva_caja);
    identificador ++;
    ClosePopup();
    return;
}
function allowDrop(event) {
    event.preventDefault();
}
function drag(event) {
    event.dataTransfer.setData("text/html", event.target.id);
}
function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text/html");
    let draggedElement = document.getElementById(data);
    let box_posx = event.offsetX;
    let box_posy = event.offsetY;
    let contenedor_posx = event.target.offsetWidth;
    let contenedor_posy = event.target.offsetHeight;
    let origen = whereCaja(draggedElement.id);
    let destino;

    switch(event.target.id){
        case "almacenB": destino = pisoB;break;
        case "almacen1": destino = piso1;break;
        case "almacen2": destino = piso2;break;
        case "almacen3": destino = piso3;break;
        case "ascensor": destino = ascensor;break;
        default: return;
    }

    if(ascensor["estado"] != ABIERTO){
        return;
    }

    if((destino["id"] != ASCENSOR)&&(destino["id"] == ascensor["posicion"])){

        draggedElement.style.position="relative";
        draggedElement.style.removeProperty("top");
        draggedElement.style.removeProperty("left");
        event.target.appendChild(draggedElement);
        
        origen.eliminarCaja(draggedElement.id);
        destino.añadirCaja(draggedElement.id);
        
    }else if((destino["id"] == ASCENSOR)&&((origen["id"] == ascensor["posicion"])||(origen["id"] == ASCENSOR))){

        if(((box_posx + draggedElement.offsetWidth) > contenedor_posx)||((box_posy + draggedElement.offsetHeight) > contenedor_posy)){return;}
        let aux = false;
        cajas.forEach(element => {
            let posicion = whereCaja(element["id"]);
            if((posicion["id"] == ASCENSOR)&&(element["id"] != draggedElement.id)){
                let caja = document.getElementById(element["id"]).getBoundingClientRect();
                if(
                    event.clientX < caja.right &&
                    event.clientX + draggedElement.offsetWidth > caja.left &&
                    event.clientY < caja.bottom &&
                    event.clientY + draggedElement.offsetHeight > caja.top
                ){
                    console.log("colision");
                    aux = true;
                    return;
                }
            }
        });
        if(aux){return;}
        draggedElement.style.position="absolute";
        draggedElement.style.top = box_posy + "px";
        draggedElement.style.left = box_posx + "px";
        event.target.appendChild(draggedElement);
        
        origen.eliminarCaja(draggedElement.id);
        destino.añadirCaja(draggedElement.id);

    }    
}
function Llamada(event){
    let boton = event.target;
    let llamada;
    switch(boton.className){
        case "boton boton_pisoB":
            llamada = PISOB;
            break;
        case "boton boton_piso1":
            llamada = PISO1;
            break;
        case "boton boton_piso2":
            llamada = PISO2;
            break;
        case "boton boton_piso3":
            llamada = PISO3;
            break;
        
    }
    boton = document.getElementsByClassName(boton.className);
    for(let i = 0; i<4;i++){
        if(ascensor.posicion != llamada){
            if(ascensor.pila[i] == llamada){
                return;
            }else if(ascensor.pila[i] == null){
                ascensor.pila[i] = llamada;
                Array.from(boton).forEach(el => {el.style.background = "red";});
                return;
            }
        }else{
            AbrirPuerta();
        }
    }
}