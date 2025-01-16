package spoonmaster

import (
	"database/sql"
	"github.com/joho/godotenv"
)

func GetConnection() *sql.DB {
	envFile, _ := godotenv.Read(".env")
	db, err := sql.Open("postgres", "postgres://" + ":password@localhost/pqgotest?sslmode=verify-full")
	if err != nil {
		panic(err)
		return nil
	}

	return db
}
