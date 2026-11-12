package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	ws "github.com/gorilla/websocket"
)

const wsUrl = "ws://localhost:3000/device"

type ControlMessage struct {
	Command string `json:"message"`
}

func startWebSocketClient() {
	for {
		fmt.Printf("[WebSocket] Connecting to %s...\n", wsUrl)
		conn, _, err := ws.DefaultDialer.Dial(wsUrl, nil)
		if err != nil {
			log.Printf("[WebSocket] Connection failed: %v. Retrying in 3 seconds...", err)
			time.Sleep(3 * time.Second)
			continue
		}
		fmt.Println("[WebSocket] Connected successfully to server /device route!")

		// Listen for incoming messages from the server
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Printf("[WebSocket] Read error (disconnected?): %v", err)
				conn.Close()
				break
			}

			var cmd ControlMessage
			if err := json.Unmarshal(message, &cmd); err != nil {
				log.Printf("[WebSocket] Failed to parse JSON message: %v", err)
				continue
			}

			if cmd.Command == "TOGGLE" {
				go publishToggle()
			}
		}

		// Wait before attempting to reconnect if the connection drops
		time.Sleep(3 * time.Second)
	}
}
