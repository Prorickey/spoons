package spoonmaster

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"os"
)

func GetStatus(router *gin.Engine) {
	router.GET("/status", func(context *gin.Context) {
		context.JSON(200, ReadStatusData())
	})
}

func ReadStatusData() StatusData {
	file, err := os.Open("./status.json")
	if err != nil {
		panic(err)
	}

	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		panic(err)
	}

	buf := make([]byte, stat.Size())
	_, err = file.Read(buf)

	var data StatusData
	err = json.Unmarshal(buf, &data)
	if err != nil {
		panic(err)
	}

	return data
}

type StatusData struct {
	GameState   string   `json:"gamestate"`
	GameMasters []string `json:"gamemasters"`
}
