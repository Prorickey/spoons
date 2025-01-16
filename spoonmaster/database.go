package spoonmaster

import (
	"database/sql"
	"github.com/joho/godotenv"
)

func GetConnection() *sql.DB {
	envFile, _ := godotenv.Read(".env")
	db, err := sql.Open("postgres", envFile["DATABASE_URL"])
	if err != nil {
		panic(err)
		return nil
	}

	return db
}
