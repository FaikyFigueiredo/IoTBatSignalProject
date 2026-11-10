package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var msg mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("[MQTT] Received message: DMNAPSDSPANd")
	//METODOS HTTP PARA ENVIO DE NOVO DADO AQUI!!!
}

var lst mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	log.Printf("[MQTT] Connection lost")
}

func main() {
	broker := "mqtt://localhost:1883"
	clientID := "go-script"

	options := mqtt.NewClientOptions()

	options.AddBroker(broker)
	options.SetClientID(clientID)
	options.SetDefaultPublishHandler(msg)
	options.SetConnectionLostHandler(lst)

	client := mqtt.NewClient(options)

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic("[MQTT] ERROR AAAAAA")
	}

	token := client.Subscribe("gotham/dpgc/batimados/batstatus", 1, msg)

	token.Wait()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	fmt.Println("\n[MQTT] Disconnecting...")
	client.Disconnect(250)
	fmt.Println("[MQTT] Disconnected cleanly.")
}
