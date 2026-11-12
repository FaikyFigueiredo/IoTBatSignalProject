// http.go
package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

const url = "http://localhost:3000/status/post"

type StatePayload struct {
	State int `json:"state"`
}

func postState(newState int) {
	api := StatePayload{State: newState}
	body, err := json.Marshal(api)
	if err != nil {
		log.Printf("[HTTP POST] Failed to marshal JSON: %v", err)
		return
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		log.Printf("[HTTP POST] Failed to send request to server: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		log.Printf("[HTTP POST] Successfully reported state (%d) to server.", newState)
	} else {
		log.Printf("[HTTP POST] Server returned non-OK status: %d", resp.StatusCode)
	}
}
