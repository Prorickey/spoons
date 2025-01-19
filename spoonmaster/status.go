package spoonmaster

import "fmt"

// GetStatus retrieves the current status of the game from the database.
// It returns the status as a string. If an error occurs during the query,
// it prints the error and returns an empty string.
func GetStatus() string {
	db := GetConnection()
	defer db.Close()
	query, err := db.Query(`SELECT value FROM "GameConfiguration" WHERE key="status"`)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	var status string
	err = query.Scan(&status)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	return status
}

const (
	// PREGAME indicates the game is in the pre-game state.
	PREGAME = "PREGAME"
	// RUNNING indicates the game is currently running.
	RUNNING = "RUNNING"
	// POSTGAME indicates the game has ended.
	POSTGAME = "POSTGAME"
)

// SetStatus updates the status of the game in the database.
// It takes a status string as an argument. If an error occurs during the update,
// it prints the error.
func SetStatus(status string) {
	db := GetConnection()
	defer db.Close()
	_, err := db.Exec(`UPDATE "GameConfiguration" SET value=$1 WHERE key="status"`, status)
	if err != nil {
		fmt.Println(err)
	}
}
