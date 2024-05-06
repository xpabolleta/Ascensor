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
const FORMULARIO = document.querySelector("form");
const BOTON_B = document.getElementById("boton_pisoB");
const BOTON_1 = document.getElementById("boton_piso1");
const BOTON_2 = document.getElementById("boton_piso2");
const BOTON_3 = document.getElementById("boton_piso3");
const ALMACEN = document.getElementById("almacenB");
const POPUP = document.getElementById("popup");

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
    pila : Array(),
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

BOTON_CREAR.addEventListener("click", OpenPopup);
FORMULARIO.addEventListener("submit", CrearCaja);
FORMULARIO.addEventListener("reset", ClosePopup);

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
    let pos_caja = whereCaja(draggedElement.id);
    let pos_target;

    switch(event.target.id){
        case "almacenB":
            pos_target = pisoB;
            break;
        case "almacen1":
            pos_target = piso1;
            break;
        case "almacen2":
            pos_target = piso2;
            break;
        case "almacen3":
            pos_target = piso3;
            break;
        case "ascensor":
            pos_target = ascensor;
            break;
    }

    if(ascensor["estado"] != ABIERTO){
        return;
    }

    if((pos_target["id"] != ASCENSOR)&&(ascensor["posicion"] == pos_target["id"])){

        draggedElement.style.position="relative";
        draggedElement.style.removeProperty("top");
        draggedElement.style.removeProperty("left");
        event.target.appendChild(draggedElement);
        pos_caja.eliminarCaja(draggedElement.id);
        pos_target.añadirCaja(draggedElement.id);
        
    }else if((pos_target["id"] == ASCENSOR)&&((pos_caja["id"] == ascensor["posicion"])||(pos_caja["id"] == ASCENSOR))){

        if(((box_posx + draggedElement.offsetWidth) > contenedor_posx)||((box_posy + draggedElement.offsetHeight) > contenedor_posy)){return;}
        let aux = false;
        cajas.forEach(element => {
            let posicion = whereCaja(element["id"]);
            let caja = document.getElementById(element["id"]);
            let dragged = draggedElement.getBoundingClientRect();
            let box = caja.getBoundingClientRect();
            if(posicion["id"] == ASCENSOR){
                if(
                    dragged.left < box.right &&
                    dragged.right > box.left &&
                    dragged.top < box.bottom &&
                    dragged.bottom > box.top
                ){
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
        pos_caja.eliminarCaja(draggedElement.id);
        pos_target.añadirCaja(draggedElement.id);

    }    
}