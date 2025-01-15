package spoonmaster

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"math/rand/v2"
)

func PostStartGame(router *gin.Engine) {
	router.POST("/startgame", func(c *gin.Context) {

		if ReadStatusData().GameState != "PREGAME" {
			c.JSON(400, gin.H{"error": "Game already started"})
			return
		}

		SetGameStatus("RUNNING")

	})
}

/*
AssignTargets assigns targets to each user in the game. The first
index of the returned slice is the assassin, the second index is the target.
*/
func AssignTargets() [][]int {
	envFile, _ := godotenv.Read(".env")
	db, err := sql.Open("postgres", envFile["DATABASE_URL"])
	if err != nil {
		panic(err)
		return nil
	}

	query, err := db.Query(`SELECT id FROM User`)
	if err != nil {
		panic(err)
		return nil
	}

	var users []int
	for query.Next() {
		var id int
		err = query.Scan(&id)
		if err != nil {
			panic(err)
			return nil
		}
		users = append(users, id)
	}

	targets := make([]int, len(users))
	copy(targets, users)

	var pairs [][]int // First index is the assassin, second index is the target
	for i := 0; i < len(users); i++ {
		n := randRange(0, len(targets))
		target := targets[n]

		// Prevent self targeting
		if target == users[i] {
			i--
			continue
		}

		// Prevent having your target hunt you
		for _, pair := range pairs {
			if pair[1] == target {
				i--
				continue
			}
		}

		targets = append(targets[:n], targets[n+1:]...)
	}

	return pairs
}

func randRange(min, max int) int {
	return rand.IntN(max-min) + min
}
