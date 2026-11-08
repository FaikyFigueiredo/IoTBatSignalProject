const backendws = "ws://localhost:3000/dashboard";

let batSocket;

export function wsInit(){

    batSocket = new WebSocket(backendws);

    batSocket.onopen = () => console.log("[WS] connected to the backend");

    batSocket.onmessage = (str) => {
        if(str.data === "1")
            console.log("Button is ON");
        else if(str.data === "0")
            console.log("Button is OFF");
    }

    batSocket.onclose = () =>{
        console.log("[WS] lose connection");
        setTimeout(wsInit, 2000);
    }

    batSocket.onerror = () => console.log("[WS] error, joker broke the network");
}

export function wsSend(station){
    if(batSocket && batSocket.readyState === WebSocket.OPEN){
        batSocket.send(JSON.stringify({
            message: "TOGGLE",
            station: station
        }));
    }else
        console.log("[WS] can't send");
}

const batButton = document.getElementById("batsignal-button");

batButton.addEventListener('click', ()=>{
    wsSend('batfriends');
});