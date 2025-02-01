package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/prorickey/spoonmaster/spoonmaster"
)

var version = "0.3.1"

func main() {
	/*err := godotenv.Load(".env.local")
	if err != nil {
		panic(err)
	}*/
	gin.SetMode(gin.ReleaseMode)
	fmt.Println("Starting Spoonmaster version " + version)
	spoonmaster.StartServer()
}
