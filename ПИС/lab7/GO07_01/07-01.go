package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

var (
	mu        sync.Mutex
	precision = 0
	methods   = map[string]func(RPCRequest) RPCResponse{}
)

type RPCRequest struct {
	Jsonrpc string          `json:"jsonrpc"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params"`
	ID      interface{}     `json:"id"`
}

type RPCResponse struct {
	Jsonrpc string      `json:"jsonrpc"`
	Result  interface{} `json:"result,omitempty"`
	Error   interface{} `json:"error,omitempty"`
	ID      interface{} `json:"id"`
}

type SumArg struct{ X, Y float64 }
type SumResult struct{ Value float64 }

type SubArg struct{ X, Y float64 }
type SubResult struct{ Value float64 }

type MulArg struct{ X, Y float64 }
type MulResult struct{ Value float64 }

type DivArg struct{ X, Y float64 }
type DivResult struct{ Value float64 }

type PreArg struct{ N int }
type PreResult struct{ Status string }

func round(v float64) float64 {
	mu.Lock()
	p := precision
	mu.Unlock()
	f := math.Pow(10, float64(p))
	return math.Round(v*f) / f
}

func extractParams(raw json.RawMessage, dst interface{}) error {
	log.Println("extractParams")
	var rc error = nil
	if len(raw) > 0 && raw[0] == '{' {
		rc = json.Unmarshal(raw, dst)
	} else if len(raw) > 0 && raw[0] == '[' {
		var arr []float64
		if err := json.Unmarshal(raw, &arr); err == nil {
			obj := map[string]float64{}
			if len(arr) > 0 {
				obj["x"] = arr[0]
			}
			if len(arr) > 1 {
				obj["y"] = arr[1]
			}
			b, _ := json.Marshal(obj)
			rc = json.Unmarshal(b, dst)
		}
	} else {
		var objArr []map[string]float64
		if err := json.Unmarshal(raw, &objArr); err == nil {
			obj := map[string]float64{}
			for _, m := range objArr {
				for k, v := range m {
					obj[k] = v
				}
			}
			b, _ := json.Marshal(obj)
			rc = json.Unmarshal(b, dst)
		}
	}
	return rc
}

func register(name string, fn func(RPCRequest) RPCResponse) {
	methods[name] = fn
}

func callMethod(r RPCRequest) RPCResponse {
	if r.Jsonrpc != "2.0" {
		return RPCResponse{
			Jsonrpc: "2.0",
			Error:   "invalid jsonrpc version",
			ID:      r.ID,
		}
	}

	var rc RPCResponse
	if method := methods[r.Method]; method != nil {
		rc = method(r)
	} else {
		rc = RPCResponse{
			Jsonrpc: "2.0",
			Error:   "method not found",
			ID:      r.ID,
		}
	}
	return rc
}

func rpcHandler(w http.ResponseWriter, r *http.Request) {
	var raw json.RawMessage
	if err := json.NewDecoder(r.Body).Decode(&raw); err == nil {
		if len(raw) > 0 && raw[0] == '[' {
			var reqs []RPCRequest
			json.Unmarshal(raw, &reqs)
			responses := make([]RPCResponse, 0)

			for _, rq := range reqs {
				resp := callMethod(rq)
				if rq.ID != nil || resp.Error != nil {
					responses = append(responses, resp)
				}
			}

			if len(responses) > 0 {
				json.NewEncoder(w).Encode(responses)
			}
		} else {
			var rq RPCRequest
			json.Unmarshal(raw, &rq)
			resp := callMethod(rq)
			if rq.ID != nil || resp.Error != nil {
				json.NewEncoder(w).Encode(resp)
			}
		}
	} else {
		json.NewEncoder(w).Encode(RPCResponse{Jsonrpc: "2.0", Error: "parse error"})
	}
}

func main() {
	register("sum", func(r RPCRequest) RPCResponse {
		var p SumArg
		extractParams(r.Params, &p)
		return RPCResponse{"2.0", SumResult{round(p.X + p.Y)}, nil, r.ID}
	})
	register("sub", func(r RPCRequest) RPCResponse {
		var p SubArg
		extractParams(r.Params, &p)
		return RPCResponse{"2.0", SubResult{round(p.X - p.Y)}, nil, r.ID}
	})
	register("mul", func(r RPCRequest) RPCResponse {
		var p MulArg
		extractParams(r.Params, &p)
		return RPCResponse{"2.0", MulResult{round(p.X * p.Y)}, nil, r.ID}
	})
	register("div", func(r RPCRequest) RPCResponse {
		var p DivArg
		extractParams(r.Params, &p)
		if p.Y == 0 {
			return RPCResponse{Jsonrpc: "2.0", Error: "division by zero", ID: r.ID}
		}
		return RPCResponse{"2.0", DivResult{round(p.X / p.Y)}, nil, r.ID}
	})
	register("pre", func(r RPCRequest) RPCResponse {
		var p PreArg
		extractParams(r.Params, &p)
		log.Println("pre, ", p)
		mu.Lock()
		precision = p.N
		mu.Unlock()
		return RPCResponse{"2.0", PreResult{"ok"}, nil, r.ID}
	})

	router := mux.NewRouter()
	router.HandleFunc("/rpc", rpcHandler).Methods("POST")
	log.Println("Server started on port 3000")
	http.ListenAndServe(":3000", router)
}
