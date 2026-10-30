import { MqttClient } from "mqtt";
import { LedState } from "./LedStateClass";

export class MqttHandler{
    static connect(broker : MqttClient) : void{
        console.log('Connected to MQTT broker');
        broker.subscribe('batsignal/status', (err) => {
            if (!err) {
                console.log('Subscribed to led/status topic');
                return;
            }
        })
    }

    static receive(topic : String, message : Buffer) : Number{
        if(message.toString() === "ON")
            return 1;
        return 0;
    }

    static send(broker : MqttClient) : void{
        broker.publish("batsignal/led","BATSIGNAL_TOGGLE");
    }

    static createState(message : String) : LedState{
        if(message === "ON"){
            return new LedState(1);
        }else{
            return new LedState(0);
        }
    }
}