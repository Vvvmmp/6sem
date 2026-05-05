package main

import (
	"GO02_02/go02_02lib"
	"fmt"
	"net/http"
)

const A01 int = 3

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "405 Method Not Allowed")
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprintf(w, "A01 = %d, \nA02 = %t, \nA03 = %s\n", A01, A02, go02_02lib.A03)
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Println("Server started on http://localhost:4000")
	http.ListenAndServe("localhost:4000", nil)
}
