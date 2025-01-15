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

func SetGameStatus(gameState string) {
	data := ReadStatusData()
	data.GameState = gameState

	file, err := os.OpenFile("./status.json", os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}

	defer file.Close()

	buf, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	_, err = file.WriteAt(buf, 0)
	if err != nil {
		panic(err)
	}
}

type StatusData struct {
	GameState   string   `json:"gamestate"` // PREGAME, RUNNING, POSTGAME
	GameMasters []string `json:"gamemasters"`
}
