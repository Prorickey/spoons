package spoonmaster

import "github.com/gin-gonic/gin"

func StartServer() {
	router := gin.New()

	GetStatus(router)

	err := router.Run("0.0.0.0:7892")
	if err != nil {
		panic(err)
	}
}
