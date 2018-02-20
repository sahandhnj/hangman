package services

import (
	"git.sahand.cloud/sahand/hangman/server/db"
	"git.sahand.cloud/sahand/hangman/server/models"
)

type GameService struct{}

func (g *GameService) Play(id string, letter string) (models.Game, error) {
	game, _ := db.GameDB.FindByID(id)
	hadAnAnswer := false

	for i, char := range game.Word {
		if string(char) == letter {
			game.Answers[i] = letter
			hadAnAnswer = true
		}
	}

	if hadAnAnswer != true {
		game.Mistakes++
	}

	hasAllLetters := true

	for _, answer := range game.Answers {
		if answer == "_" {
			hasAllLetters = false
		}
	}

	if hasAllLetters {
		game.Status = 2
	}

	if game.Mistakes == 5 {
		game.Status = 1
	}

	db.GameDB.Update(game)

	return game, nil
}
