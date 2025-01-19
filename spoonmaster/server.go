package spoonmaster

import "github.com/gin-gonic/gin"

func StartServer() {
	router := gin.New()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.POST("/assignTargets", PostAssignTargets)
	router.POST("/startgame", PostStartGame)

	err := router.Run("0.0.0.0:7892")
	if err != nil {
		panic(err)
	}
}
