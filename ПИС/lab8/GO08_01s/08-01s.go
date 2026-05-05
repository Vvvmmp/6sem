package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/ws", handler)
	log.Println("WebSocket server on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func handler(w http.ResponseWriter, r *http.Request) {
	if conn, err := upgrader.Upgrade(w, r, nil); err == nil {
		defer conn.Close()
		for {
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				log.Println("client disconnected (closed)")
				break
			} else {
				log.Println("received:", string(msg))
				reply := "from server " + string(msg)
				if err = conn.WriteMessage(msgType, []byte(reply)); err != nil {
					log.Println("write:", err)
				}
			}
		}
	} else {
		log.Println("Upgrade:", err)
	}
}
