package spoonmaster

import (
	"database/sql"
	"os"
)

func GetConnection() *sql.DB {
	user, _ := os.LookupEnv("DB_USER")
	password, _ := os.LookupEnv("DB_PASSWORD")
	host, _ := os.LookupEnv("DB_HOST")
	port, _ := os.LookupEnv("DB_PORT")
	dbname, _ := os.LookupEnv("DB_NAME")
	db, err := sql.Open("postgres", "postgres://"+user+
		":"+password+
		"@"+host+":"+port+
		"/"+dbname)
	if err != nil {
		panic(err)
		return nil
	}

	return db
}
