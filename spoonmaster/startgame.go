package spoonmaster

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"math/rand/v2"
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

	var pairs [][]int // First index is the assassin, second index is the target

	for i := range users {
		j := rand.IntN(i + 1)
		users[i], users[j] = users[j], users[i]
	}

	for i := range users {
		assassin := users[i]
		target := users[(i+1)%len(users)] // The last user targets the first
		pairs = append(pairs, []int{assassin, target})
	}

	return pairs
}

func randRange(min, max int) int {
	return rand.IntN(max-min) + min
}
