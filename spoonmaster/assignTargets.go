package spoonmaster

import (
	"database/sql"
	"fmt"
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
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			context.JSON(500, gin.H{"error": err.Error()})
		}
	}(db)

	if data.Action == "clear" {
		_, err := db.Exec(`UPDATE "User" SET "currentTarget" = NULL`)
		if err != nil {
			context.JSON(500, gin.H{"error": err.Error()})
			return
		}

		context.JSON(200, gin.H{"message": "Targets cleared"})
	} else {
		targets, err := AssignTargets()
		if err != nil {
			context.JSON(500, gin.H{"error": err.Error()})
			return
		}

		for _, pair := range targets {
			_, err = db.Exec(`UPDATE "User" SET "currentTarget" = $1 WHERE "id" = $2`, pair[1], pair[0])
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
func AssignTargets() ([][]int, error) {
	db := GetConnection()
	defer db.Close()

	rulesQuery, err := db.Query(`SELECT "type", "player1id", "player2id" FROM "TargetRules"`)
	if err != nil {
		panic(err)
	}

	var rules []TargetRule
	for rulesQuery.Next() {
		var rule TargetRule
		err = rulesQuery.Scan(&rule.Type, &rule.Player1ID, &rule.Player2ID)
		if err != nil {
			panic(err)
		}
		rules = append(rules, rule)
	}

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

	// Shuffle the users array
	for i := range users {
		j := rand.IntN(i + 1)
		users[i], users[j] = users[j], users[i]
	}

	var prevUsers []int
	for _, user := range users {
		prevUsers = append(prevUsers, user)
	}

	// Apply rules to the users array
	for _, rule := range rules {
	loop:
		for i := len(users) - 1; i > 0; i-- {
			if users[i] == rule.Player2ID {
				for j := range users {
					if users[j] == rule.Player1ID {
						// remove player2id
						users = append(users[:i], users[i+1:]...)

						// insert player1id before player2id
						users = append(users[:j], append([]int{rule.Player2ID}, users[j:]...)...)
						break loop
					}
				}
			}
		}
	}

	var pairs [][]int // First index is the assassin, second index is the target

	for i := range users {
		assassin := users[i]
		target := users[(i+1)%len(users)] // The last user targets the first
		pairs = append(pairs, []int{assassin, target})
	}

	score := areArraysEqual(users, prevUsers)
	if score != 0 {
		return nil, fmt.Errorf("users array was malformed after applying rules (%d): %v", score, users)
	}

	return pairs, nil
}

type TargetRule struct {
	Type      int // 0 for player1 targets player2
	Player1ID int
	Player2ID int
}

func areArraysEqual(arr1, arr2 []int) int {
	// If lengths are different, arrays are not equal
	if len(arr1) != len(arr2) {
		return -1
	}

	count := len(arr1)

	// Decrement counts based on arr2
	for _, num := range arr1 {
		for _, num2 := range arr2 {
			if num == num2 {
				count--
				break
			}
		}
	}

	return count
}
