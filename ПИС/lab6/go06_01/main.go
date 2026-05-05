package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

type Celebrity struct {
	Id           int    `json:"id" gorm:"primaryKey;column:Id;autoIncrement:false"`
	FullName     string `json:"fullName" gorm:"column:FullName"`
	Nationality  string `json:"nationality" gorm:"column:Nationality"`
	ReqPhotoPath string `json:"reqPhotoPath" gorm:"column:ReqPhotoPath"`
}

var db *gorm.DB

func initDB() {
	connString := "server=localhost;user id=sa;password=##TEST$$mmomega1!M;database=hiring_staff;encrypt=disable"

	var err error
	db, err = gorm.Open(sqlserver.Open(connString), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к БД через GORM:", err)
	}

	log.Println("Успешное подключение к MS SQL Server через GORM")
}

func getAllCelebrities(w http.ResponseWriter, r *http.Request) {
	log.Printf("Трассировка GORM: %s %s", r.Method, r.URL.Path)
	var celebrities []Celebrity

	db.Find(&celebrities)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(celebrities)
}

func getCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Трассировка GORM: %s %s", r.Method, r.URL.Path)
	id := mux.Vars(r)["id"]
	var c Celebrity

	if err := db.First(&c, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "Элемент не найден", 404)
		} else {
			http.Error(w, err.Error(), 500)
		}
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func createCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Трассировка GORM: %s %s", r.Method, r.URL.Path)
	var c Celebrity
	json.NewDecoder(r.Body).Decode(&c)

	var existing Celebrity
	result := db.First(&existing, c.Id)
	if result.Error == nil {
		http.Error(w, "Status 409: Элемент с таким Id уже существует", 409)
		return
	}

	if err := db.Create(&c).Error; err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.WriteHeader(201)
	json.NewEncoder(w).Encode(c)
}

func updateCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Трассировка GORM: %s %s", r.Method, r.URL.Path)
	id := mux.Vars(r)["id"]
	var c Celebrity

	var existing Celebrity
	if err := db.First(&existing, id).Error; err != nil {
		http.Error(w, "Status 404: Элемент не найден", 404)
		return
	}

	json.NewDecoder(r.Body).Decode(&c)
	c.Id = existing.Id

	db.Save(&c)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func deleteCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Трассировка GORM: %s %s", r.Method, r.URL.Path)
	id := mux.Vars(r)["id"]

	result := db.Delete(&Celebrity{}, id)

	if result.RowsAffected == 0 {
		http.Error(w, "Status 404: Элемент не найден", 404)
		return
	}

	w.WriteHeader(204)
}

func main() {
	initDB()

	r := mux.NewRouter()
	r.HandleFunc("/Celebrities/All", getAllCelebrities).Methods("GET")
	r.HandleFunc("/Celebrities/{id}", getCelebrity).Methods("GET")
	r.HandleFunc("/Celebrities", createCelebrity).Methods("POST")
	r.HandleFunc("/Celebrities/{id}", updateCelebrity).Methods("PUT")
	r.HandleFunc("/Celebrities/{id}", deleteCelebrity).Methods("DELETE")

	fmt.Println("GORM Сервер GO06_01 запущен на порту 3000")
	log.Fatal(http.ListenAndServe(":3000", r))
}
