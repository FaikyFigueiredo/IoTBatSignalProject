import { wsSend } from "./websocket-handler.js";

const villains = [ "Coringa", "Pinguim", "Espantalho", "Duas-Caras", "Homem Calendário", "ScarFace", "Alexandre, o grande", "Thaynara", "Patati e Patata", "Junin", "Mr. Freez", "Rhas Al Ghoul", "Satanás", "Barbie", "Velozes e furiosos", "Seu Marquinhos da esquina"];
let index = 0;

//Indentificar elemento texto
const text = document.getElementById("feedback-message");

//Indentificar elemento imagem
const img = document.getElementById("led-img");

//Indentificar bat botão
const batButton = document.getElementById("batsignal-button");
let batStatus = 0;

//Botão:
batButton.addEventListener('click', ()=>{
    console.log(index);
    batStatus = 1 - batStatus;
    if(batStatus){
        img.src="images/led_cinza_ofc.png"
        text.textContent = "A paz reinou em gotham city mais uma vez!"
    }else{
        img.src="images/led_azul_ofc.png"
        text.textContent = `Viiiish, ${villains[index]} ataca gotham city mais uma vez!`
        index += Math.floor(Math.random()*villains.length-2) + 1;
        if(index > villains.length - 1) index -= villains.length - 1;
    }
    wsSend('batfriends');
});