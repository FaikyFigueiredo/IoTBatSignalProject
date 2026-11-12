import { WebSocket as WsConnection } from "ws";

export const wsAdd = (ws : WsConnection, list : Set<WsConnection>) =>{
    list.add(ws);
}
export const wsRemove = (ws : WsConnection, list : Set<WsConnection>) =>{
    list.delete(ws);
}
export const wsAlert = (list : Set<WsConnection>, bit : Number) =>{
    for(const ws of list){
        if(ws.readyState === WsConnection.OPEN)
            ws.send(bit.toString());
    }
}
export const wsSearchSend = (list : Set<WsConnection>) => {
    for(const ws of list){
        if(ws.readyState === WsConnection.OPEN)
            ws.send('{ "message": "TOGGLE" }');
    }
}