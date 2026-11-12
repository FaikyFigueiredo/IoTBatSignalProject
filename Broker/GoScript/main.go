package main

import (
	"os"
	"os/signal"
	"syscall"
)

func main() {
	go startMqtt()
	go startWebSocketClient()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	go disconnectMqtt()
}
