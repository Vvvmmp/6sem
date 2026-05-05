package main

import (
	"GO02_01/go02_01lib"
	"fmt"
	"net/http"
)

const C01 float32 = 3.14

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "405 Method Not Allowed")
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprintf(w, "C01 = %e, \nC02 = %e, \nC03 = %e\n", C01, C02, go02_01lib.C03)
}

func main() {
	http.HandleFunc("/", handler)
	fmt.Println("Server started on http://localhost:3000")
	http.ListenAndServe("localhost:3000", nil)
}
