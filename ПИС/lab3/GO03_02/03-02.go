package main

import (
	"GO03_02/P03_02"
	"fmt"
	"log"
	"net/http"
)

var globalStats P03_02.Stats

func handlerS(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		globalStats.PlusGet()
	} else if r.Method == "POST" {
		globalStats.PlusPost()
	}
	fmt.Fprintf(w, "Счетчик обновлен для метода %s", r.Method)
}

func handlerG(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, globalStats.GenStr())
}

func main() {
	http.HandleFunc("/S", handlerS)
	http.HandleFunc("/G", handlerG)
	log.Println("Server at running http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
