package spoonmaster

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func PostStartGame(context *gin.Context) {
	if GetStatus() != "PREGAME" {
		context.JSON(450, gin.H{"error": "Game already started"})
		return
	}

	targetPairs, err := AssignTargets()
	if err != nil {
		context.JSON(500, gin.H{"error": err})
		return
	}
	db := GetConnection()
	defer db.Close()

	for _, pair := range targetPairs {
		_, err := db.Exec(`UPDATE "User" SET "currentTarget" = $1 WHERE "id" = $2`, pair[1], pair[0])
		if err != nil {
			context.JSON(400, gin.H{"error": err})
		}
	}

	SetStatus(RUNNING)
	context.JSON(200, gin.H{"message": "Game started"})
}
