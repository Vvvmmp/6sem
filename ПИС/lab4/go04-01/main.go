package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"

	"github.com/gorilla/mux"
)

type Celebrity struct {
	Id           int    `json:"id"`
	FullName     string `json:"fullName"`
	Nationality  string `json:"nationality"`
	ReqPhotoPath string `json:"reqPhotoPath"`
}

var (
	celebrities []Celebrity
	mutex       = &sync.RWMutex{}
	jsonFile    = "Celebrities.json"
)

func loadCelebrities() error {
	mutex.Lock()
	defer mutex.Unlock()

	file, err := os.Open(jsonFile)
	if err != nil {
		if os.IsNotExist(err) {
			log.Printf("Файл %s не найден, создаем новый.", jsonFile)
			celebrities = []Celebrity{}
			return saveCelebrities()
		}
		return err
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}

	return json.Unmarshal(bytes, &celebrities)
}

func saveCelebrities() error {
	bytes, err := json.MarshalIndent(celebrities, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile(jsonFile, bytes, 0644)
}

func getAllCelebrities(w http.ResponseWriter, r *http.Request) {
	log.Printf("Запрос получен: %s %s", r.Method, r.URL.Path)
	mutex.RLock()
	defer mutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(celebrities)
}

func getCelebrityByID(w http.ResponseWriter, r *http.Request) {
	log.Printf("Запрос получен: %s %s", r.Method, r.URL.Path)
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	mutex.RLock()
	defer mutex.RUnlock()

	for _, celebrity := range celebrities {
		if celebrity.Id == id {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(celebrity)
			return
		}
	}

	http.Error(w, "Элемент не найден", http.StatusNotFound)
}

func createCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Запрос получен: %s %s", r.Method, r.URL.Path)
	var newCelebrity Celebrity
	if err := json.NewDecoder(r.Body).Decode(&newCelebrity); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	for _, celebrity := range celebrities {
		if celebrity.Id == newCelebrity.Id {
			http.Error(w, "Элемент с таким ID уже существует", http.StatusConflict)
			return
		}
	}

	celebrities = append(celebrities, newCelebrity)
	if err := saveCelebrities(); err != nil {
		http.Error(w, "Не удалось сохранить данные", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newCelebrity)
}

func updateCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Запрос получен: %s %s", r.Method, r.URL.Path)
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	var updatedCelebrity Celebrity
	if err := json.NewDecoder(r.Body).Decode(&updatedCelebrity); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updatedCelebrity.Id = id

	mutex.Lock()
	defer mutex.Unlock()

	found := false
	for i, celebrity := range celebrities {
		if celebrity.Id == id {
			celebrities[i] = updatedCelebrity
			found = true
			break
		}
	}

	if !found {
		http.Error(w, "Элемент для обновления не найден", http.StatusNotFound)
		return
	}

	if err := saveCelebrities(); err != nil {
		http.Error(w, "Не удалось сохранить данные", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedCelebrity)
}

func deleteCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Запрос получен: %s %s", r.Method, r.URL.Path)
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Неверный ID", http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	indexToRemove := -1
	for i, celebrity := range celebrities {
		if celebrity.Id == id {
			indexToRemove = i
			break
		}
	}

	if indexToRemove == -1 {
		http.Error(w, "Элемент для удаления не найден", http.StatusNotFound)
		return
	}

	celebrities = append(celebrities[:indexToRemove], celebrities[indexToRemove+1:]...)

	if err := saveCelebrities(); err != nil {
		http.Error(w, "Не удалось сохранить данные", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func main() {
	if err := loadCelebrities(); err != nil {
		log.Fatalf("Не удалось загрузить данные из файла: %v", err)
	}

	r := mux.NewRouter()

	r.HandleFunc("/Celebrities/All", getAllCelebrities).Methods("GET")
	r.HandleFunc("/Celebrities/{id}", getCelebrityByID).Methods("GET")
	r.HandleFunc("/Celebrities", createCelebrity).Methods("POST")
	r.HandleFunc("/Celebrities/{id}", updateCelebrity).Methods("PUT")
	r.HandleFunc("/Celebrities/{id}", deleteCelebrity).Methods("DELETE")

	port := "3000"
	log.Printf("Сервер запускается на порту %s...", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
