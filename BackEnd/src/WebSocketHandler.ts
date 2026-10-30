export const wsAdd = (ws : WebSocket, list : Set<WebSocket>) =>{
    list.add(ws);
}
export const wsRemove = (ws : WebSocket, list : Set<WebSocket>) =>{
    list.delete(ws);
}
export const wsAlert = (list : Set<WebSocket>, bit : Number) =>{
    for(const ws of list){
        if(ws.readyState === WebSocket.OPEN)
            ws.send(bit.toString());
    }
}