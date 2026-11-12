package main

import (
	"fmt"
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

const broker = "mqtt://localhost:1883"
const clientID = "go-script"
const statusTopic = "gotham/dpgc/batimados/batstatus"
const sendTopic = "gotham/dpgc/batimados/batsignal"

var client mqtt.Client

func publishToggle() {
	if client == nil {
		log.Println("[MQTT Error] Client is uninitialized (nil)!")
		return
	}
	client.Publish(sendTopic, 0, true, "BATSIGNAL_TOGGLE")
}

var msg mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	state := string(msg.Payload())
	if state == "BATSIGNAL_ON" {
		go postState(1)
	} else if state == "BATSIGNAL_OFF" {
		go postState(0)
	}
}

var lst mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	log.Printf("[MQTT] Connection lost")
}

func startMqtt() {
	options := mqtt.NewClientOptions()

	options.AddBroker(broker)
	options.SetClientID(clientID)
	options.SetDefaultPublishHandler(msg)
	options.SetConnectionLostHandler(lst)

	client = mqtt.NewClient(options)

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic("[MQTT] ERROR AAAAAA")
	}

	token := client.Subscribe(statusTopic, 1, msg)

	token.Wait()
}

func disconnectMqtt() {
	fmt.Println("\n[MQTT] Disconnecting...")
	client.Disconnect(250)
	fmt.Println("[MQTT] Disconnected cleanly.")
}
