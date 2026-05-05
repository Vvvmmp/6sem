package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
)

const (
	baseURL = "http://127.0.0.1:3000/"
	destURL = "http://127.0.0.1:3000/"
	// baseURL    = "http://127.0.0.1:25006/"
	// destURL    = "http://127.0.0.1:25006/"
	user       = "dav01"
	pass       = "12345"
	baseFolder = "A"
	workFolder = "B"
)

func request(method, url string, body io.Reader, h map[string]string) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		log.Println(method, "error:", err)
		return
	}

	req.SetBasicAuth(user, pass)

	for k, v := range h {
		req.Header.Set(k, v)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(method, "error:", err)
		return
	}
	defer resp.Body.Close()

	b, _ := io.ReadAll(resp.Body)
	fmt.Println("=== ", method, url, " ===")
	fmt.Println("status:", resp.Status)
	fmt.Println(string(b))
	fmt.Println()
}

func main() {
	request("MKCOL", baseURL+baseFolder+"/", nil, nil)

	request("PUT", baseURL+baseFolder+"/hello.txt",
		bytes.NewBuffer([]byte("Hello WebDAV")),
		map[string]string{"Content-Type": "text/plain"})

	request("GET", baseURL+baseFolder+"/hello.txt", nil, nil)

	propfindXML := `<?xml version="1.0" encoding="utf-8" ?>
		<propfind xmlns="DAV:">
			<allprop/>
		</propfind>`
	request("PROPFIND", baseURL+baseFolder+"/",
		bytes.NewBuffer([]byte(propfindXML)),
		map[string]string{"Depth": "1", "Content-Type": "application/xml"})

	request("MKCOL", baseURL+workFolder+"/", nil, nil)

	request("COPY", baseURL+baseFolder+"/hello.txt", nil,
		map[string]string{"Destination": destURL + workFolder + "/hello_copy.txt"})

	request("MOVE", baseURL+workFolder+"/hello_copy.txt", nil,
		map[string]string{"Destination": destURL + baseFolder + "/hello_moved.txt"})

	//request("DELETE", baseURL+baseFolder+"/", nil, nil)
	//request("DELETE", baseURL+workFolder+"/", nil, nil)
}
