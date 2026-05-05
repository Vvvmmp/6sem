package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/microsoft/go-mssqldb"
)

type Celebrity struct {
	Id           int    `json:"id"`
	FullName     string `json:"fullName"`
	Nationality  string `json:"nationality"`
	ReqPhotoPath string `json:"reqPhotoPath"`
}

var db *sql.DB

func initDB() {
	connString := "server=localhost;user id=sa;password=##TEST$$mmomega1!M;database=hiring_staff;encrypt=disable"

	var err error
	db, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Ошибка открытия БД:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}
	log.Println("Успешное подключение к MS SQL Server в Docker")
}

func getAllCelebrities(w http.ResponseWriter, r *http.Request) {
	log.Printf("Лог: %s %s", r.Method, r.URL.Path)
	rows, err := db.Query("SELECT Id, FullName, Nationality, ReqPhotoPath FROM Celebrities")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	var result []Celebrity
	for rows.Next() {
		var c Celebrity
		rows.Scan(&c.Id, &c.FullName, &c.Nationality, &c.ReqPhotoPath)
		result = append(result, c)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func getCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Лог: %s %s", r.Method, r.URL.Path)
	id := mux.Vars(r)["id"]
	var c Celebrity
	err := db.QueryRow("SELECT Id, FullName, Nationality, ReqPhotoPath FROM Celebrities WHERE Id = @p1", id).
		Scan(&c.Id, &c.FullName, &c.Nationality, &c.ReqPhotoPath)

	if err == sql.ErrNoRows {
		http.Error(w, "Не найдено", 404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func createCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Лог: %s %s", r.Method, r.URL.Path)
	var c Celebrity
	json.NewDecoder(r.Body).Decode(&c)

	var exists int
	db.QueryRow("SELECT COUNT(*) FROM Celebrities WHERE Id = @p1", c.Id).Scan(&exists)
	if exists > 0 {
		http.Error(w, "Conflict: Id already exists", 409)
		return
	}

	_, err := db.Exec("INSERT INTO Celebrities (Id, FullName, Nationality, ReqPhotoPath) VALUES (@p1, @p2, @p3, @p4)",
		c.Id, c.FullName, c.Nationality, c.ReqPhotoPath)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(201)
	json.NewEncoder(w).Encode(c)
}

func updateCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Лог: %s %s", r.Method, r.URL.Path)
	id := mux.Vars(r)["id"]
	var c Celebrity
	json.NewDecoder(r.Body).Decode(&c)

	res, err := db.Exec("UPDATE Celebrities SET FullName=@p1, Nationality=@p2, ReqPhotoPath=@p3 WHERE Id=@p4",
		c.FullName, c.Nationality, c.ReqPhotoPath, id)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	rows, _ := res.RowsAffected()
	if rows == 0 {
		http.Error(w, "Not Found", 404)
		return
	}
	c.Id, _ = strconv.Atoi(id)
	json.NewEncoder(w).Encode(c)
}

func deleteCelebrity(w http.ResponseWriter, r *http.Request) {
	log.Printf("Лог: %s %s", r.Method, r.URL.Path)
	id := mux.Vars(r)["id"]
	res, err := db.Exec("DELETE FROM Celebrities WHERE Id=@p1", id)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	rows, _ := res.RowsAffected()
	if rows == 0 {
		http.Error(w, "Not Found", 404)
		return
	}
	w.WriteHeader(204)
}

func main() {
	initDB()
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/Celebrities/All", getAllCelebrities).Methods("GET")
	r.HandleFunc("/Celebrities/{id}", getCelebrity).Methods("GET")
	r.HandleFunc("/Celebrities", createCelebrity).Methods("POST")
	r.HandleFunc("/Celebrities/{id}", updateCelebrity).Methods("PUT")
	r.HandleFunc("/Celebrities/{id}", deleteCelebrity).Methods("DELETE")

	log.Println("Сервер GO05_01 запущен на порту 3000")
	http.ListenAndServe(":3000", r)
}
