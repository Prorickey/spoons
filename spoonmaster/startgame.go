package spoonmaster

import (
	"github.com/gin-gonic/gin"
	"math/rand/v2"

	_ "github.com/lib/pq"
)

func PostStartGame(router *gin.Engine) {
	router.POST("/startgame", func(context *gin.Context) {
		if ReadStatusData().GameState != "PREGAME" {
			context.JSON(400, gin.H{"error": "Game already started"})
			return
		}

		context.JSON(200, gin.H{"message": "Game started"})

		targetPairs := AssignTargets()
		db := GetConnection()
		for _, pair := range targetPairs {
			_, err := db.Exec(`UPDATE "User" SET "currentTarget" = $1 WHERE "id" = $2`, pair[1], pair[0])
			if err != nil {
				panic(err)
			}
		}

		db.Close()

		SetGameStatus("RUNNING")
	})
}

/*
AssignTargets assigns targets to each user in the game. The first
index of the returned slice is the assassin, the second index is the target.
*/
func AssignTargets() [][]int {
	db := GetConnection()

	query, err := db.Query(`SELECT "id" FROM "User"`)
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

	db.Close()

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

		// TODO: Still happens if there are only two players left to get and recieve targets
		// Prevent having your target hunt you
		for _, pair := range pairs {
			if pair[1] == target {
				i--
				continue
			}
		}

		targets = append(targets[:n], targets[n+1:]...)
		pairs = append(pairs, []int{users[i], target})
	}

	return pairs
}

func randRange(min, max int) int {
	return rand.IntN(max-min) + min
}
