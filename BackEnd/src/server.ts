import express, { Request, Response } from 'express';
import http from 'http';
import mqtt, { MqttClient } from 'mqtt';
import { MqttHandler } from './MqttHandler';
import { addState, getStates } from './LedStateService';
import { WebSocketServer } from 'ws';
import { wsAdd, wsAlert, wsRemove } from './WebSocketHandler';

const app = express();
const server = http.createServer(app);
const ws = new WebSocketServer({ server });
const clients = new Set<WebSocket>();
const PORT: number = 3000;

const mqttClient : MqttClient = mqtt.connect("mqtt://localhost:1883");

app.use(express.json());

//MQTT STUFF
mqttClient.on(
    'connect', () =>
        MqttHandler.connect(mqttClient)
);
mqttClient.on(
    'message', (topic : String, message : Buffer) =>{
        if(topic === "batsignal/status"){
            wsAlert(clients, MqttHandler.receive(topic, message));
        }else{
            addState(MqttHandler.createState(message.toString()));
        }
});

//HTTP STUFF
app.get('/status/get', (req : Request, res: Response) => {
    res.status(200).send(getStates());
});

app.get('/toggleled', (req : Request, res : Response) => {
    MqttHandler.send(mqttClient);
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//WEBSOCKET STUFF
ws.on( 'connection', (client : WebSocket) =>{
    wsAdd(client,clients);
    
    ws.on( 'close', (client : WebSocket) =>
        wsRemove(client,clients)
    );
});