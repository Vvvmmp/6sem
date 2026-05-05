package main

import (
	"log"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

func main() {
	conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:3000/ws", nil)
	if err == nil {
		defer conn.Close()
		for i := 1; i <= 5; i++ {
			msg := []byte("client message" + strconv.Itoa(i))
			if err = conn.WriteMessage(websocket.TextMessage, msg); err == nil {
				if _, reply, err := conn.ReadMessage(); err == nil {
					log.Println("received from server:", string(reply))
				} else {
					break
				}
			}
			time.Sleep(1 * time.Second)
		}
	} else {
		log.Fatal("dial:", err)
	}
	conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "bye"))
}
