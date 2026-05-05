package main

import (
	"fmt"
	"log"
	"net/http"
)

func trace(w http.ResponseWriter, r *http.Request) {
	log.Printf("%s %s\n", r.Method, r.URL.Path)
	fmt.Fprintf(w, "%s %s\n", r.Method, r.URL.Path)
}

func handleGetRoot(w http.ResponseWriter, r *http.Request)  { trace(w, r) }
func handlePostRoot(w http.ResponseWriter, r *http.Request) { trace(w, r) }
func handlePutRoot(w http.ResponseWriter, r *http.Request)  { trace(w, r) }

func handleGetA(w http.ResponseWriter, r *http.Request)  { trace(w, r) }
func handlePostA(w http.ResponseWriter, r *http.Request) { trace(w, r) }
func handlePutA(w http.ResponseWriter, r *http.Request)  { trace(w, r) }

func handleGetAB(w http.ResponseWriter, r *http.Request)  { trace(w, r) }
func handlePostAB(w http.ResponseWriter, r *http.Request) { trace(w, r) }
func handlePutAB(w http.ResponseWriter, r *http.Request)  { trace(w, r) }
