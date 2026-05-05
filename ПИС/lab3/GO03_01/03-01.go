package main

import (
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", handleGetRoot)
	mux.HandleFunc("POST /", handlePostRoot)
	mux.HandleFunc("PUT /", handlePutRoot)

	mux.HandleFunc("GET /A", handleGetA)
	mux.HandleFunc("POST /A", handlePostA)
	mux.HandleFunc("PUT /A", handlePutA)

	mux.HandleFunc("GET /A/B", handleGetAB)
	mux.HandleFunc("POST /A/B", handlePostAB)
	mux.HandleFunc("PUT /A/B", handlePutAB)

	mux.HandleFunc("/", trace)

	log.Println("Server running at http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", mux))
}
