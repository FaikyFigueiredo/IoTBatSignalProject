const backendws = "ws://localhost:3000";

let socket = new WebSocket(backendws);

export function wsInit(){
    socket.onopen = () => console.log("[WS] connected to the backend");

    socket.onmessage = (str) => {
        if(str === "ON")
            console.log("Button is ON");
        else if(str === "OFF")
            console.log("Button is OFF");
    }

    socket.onclose = () =>{
        console.log("[WS] lose connection");
        setTimeout(() => socket = new WebSocket(backendws));
    }

    socket.onerror = () => console.log("[WS] error, joker broke the network");
}

export function wsSend(station){
    if(socket && socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify({
            message: "TOGGLE",
            station: station
        }));
    }else
        console.log("[WS] can't send");
}
