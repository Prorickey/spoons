package spoonmaster

import (
	"github.com/gin-gonic/gin"
	"math/rand/v2"
)

type targetData struct {
	Action string `json:"action"`
}

func PostAssignTargets(context *gin.Context) {

	var data targetData
	if err := context.ShouldBindJSON(&data); err != nil {
		context.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := GetConnection()
	defer db.Close()

	if data.Action == "clear" {
		_, err := db.Exec(`UPDATE "User" SET "currentTarget" = NULL`)
		if err != nil {
			context.JSON(500, gin.H{"error": err.Error()})
			return
		}

		context.JSON(200, gin.H{"message": "Targets cleared"})
	} else {
		targets := AssignTargets()

		for _, pair := range targets {
			_, err := db.Exec(`UPDATE "User" SET "currentTarget" = $1 WHERE "id" = $2`, pair[1], pair[0])
			if err != nil {
				context.JSON(500, gin.H{"error": err.Error()})
				return
			}
		}

		context.JSON(200, targets)
	}
}

/*
AssignTargets assigns targets to each user in the game. The first
index of the returned slice is the assassin, the second index is the target.
*/
func AssignTargets() [][]int {
	db := GetConnection()
	defer db.Close()

	query, err := db.Query(`SELECT "id" FROM "User" WHERE gamemaster=FALSE`)
	if err != nil {
		panic(err)
	}

	var users []int
	for query.Next() {
		var id int
		err = query.Scan(&id)
		if err != nil {
			panic(err)
		}
		users = append(users, id)
	}

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
