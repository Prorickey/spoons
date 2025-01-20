package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/prorickey/spoonmaster/spoonmaster"
)

var version = "0.2.2"

func main() {
	gin.SetMode(gin.ReleaseMode)
	fmt.Println("Starting Spoonmaster version " + version)
	spoonmaster.StartServer()
}
