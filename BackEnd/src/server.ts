import express, { Request, Response } from 'express';
import http from 'http';
import { addState, getStates } from './LedStateService';
import { WebSocketServer } from 'ws';
import { wsAdd, wsAlert, wsRemove } from './WebSocketHandler';
import { LedState } from './LedStateClass';

const app = express();
const server = http.createServer(app);
const ws = new WebSocketServer({ server });
const brokers = new Set<WebSocket>();
const clients = new Set<WebSocket>();
const PORT = 3000;

app.use(express.json());

//HTTP STUFF
app.post('/status/post', (req : Request, res : Response) =>{
        addState(new LedState(req.body.state, req.body.station));
        wsAlert(clients, req.body.state);
        res.status(201).send("Successfully created");
});
app.post('/toggleled', (req : Request, res : Response) => {
    const station = req.body.station;
    res.status(201).send("LED toggled");
});

app.get('/status/get', (req : Request, res: Response) => {
    res.status(200).send(getStates());
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//WEBSOCKET STUFF
ws.on( 'connection', (client : WebSocket) =>{
    client.url.startsWith("/frontend") ? 
        wsAdd(client,clients):
        wsAdd(client,brokers);
    
    ws.on( 'close', (client : WebSocket) =>{
        client.url.startsWith("/frontend") ? 
            wsRemove(client,clients):
            wsRemove(client,brokers);
    });
});