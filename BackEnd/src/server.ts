import express, { Request, Response } from 'express';
import http, { IncomingMessage } from 'http';
import { addState, getStates } from './LedStateService';
import { WebSocketServer, WebSocket as WsConnection } from 'ws';
import { wsAdd, wsAlert, wsRemove, wsSearchSend } from './WebSocketHandler';
import { LedState } from './LedStateClass';

const app = express();
const server = http.createServer(app);
const brokers = new Set<WsConnection>();
const clients = new Set<WsConnection>();
const PORT = 3000;
const ws = new WebSocketServer({ server });

app.use(express.json());

app.use(express.static("frontend"));

//HTTP STUFF

app.post('/status/post', (req : Request, res : Response) =>{
        addState(new LedState(req.body.state, req.body.station));
        wsAlert(clients, req.body.state);
        res.status(201).send("Successfully created");
});

app.get('/status/get', (req : Request, res: Response) => {
    res.status(200).send(getStates());
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//WEBSOCKET STUFF

ws.on( 'connection', (client : WsConnection, req : IncomingMessage) =>{
    const url = req.url || '';
    
    console.log("[WS] a connection request:");
    console.log(url);
    url.startsWith("/dashboard") ?
        wsAdd(client,clients):
        wsAdd(client,brokers);

    client.on('message', (message : Buffer) => {
        console.log(`Message: ${message.toString()}, received!`);
        const toggle = JSON.parse(message.toString());
        if(toggle.message === "TOGGLE")
            wsSearchSend(brokers);
    })

    client.on( 'close', () =>{
        url.startsWith("/dashboard") ?
            wsRemove(client,clients):
            wsRemove(client,brokers);
    });
});