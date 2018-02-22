package schemas

import (
	"git.sahand.cloud/sahand/hangman/server/db"
	"git.sahand.cloud/sahand/hangman/server/models"
	"git.sahand.cloud/sahand/hangman/server/services"
	"github.com/graphql-go/graphql"
	"log"
	"math/rand"
	"strconv"
)

var gameType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Game",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.String,
		},
		"playername": &graphql.Field{
			Type: graphql.String,
		},
		"word": &graphql.Field{
			Type: graphql.String,
		},
		"answers": &graphql.Field{
			Type: graphql.NewList(graphql.String),
		},
		"status": &graphql.Field{
			Type: graphql.Int,
		},
		"mistakes": &graphql.Field{
			Type: graphql.Int,
		},
	},
})

// root mutation
var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootMutation",
	Fields: graphql.Fields{
		// curl -g 'http://localhost:8080/api?query=mutation+_{createGame(playername:"sahand"){id,player,answers}}'
		"createGame": &graphql.Field{
			Type:        gameType,
			Description: "create new game",
			Args: graphql.FieldConfigArgument{
				"playername": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				// marshall and cast the argument value
				playername, _ := params.Args["playername"].(string)

				game := models.Game{
					PlayerName: playername,
					Word:       "TEST",
					Answers:    []string{},
					Status:     0,
					Mistakes:   0,
					GameId: strconv.Itoa(rand.Intn(1000000000000000)),
				}

				game.Answers = make([]string, len(game.Word))
				for i := range game.Answers {
					game.Answers[i] = "_"
				}

				err := db.GameDB.Insert(game)
				if err != nil {
					log.Fatal(err)
				}

				return game, nil
			},
		},
	},
})

// root query
var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootQuery",
	Fields: graphql.Fields{
		// curl -g 'http://localhost:8080/api?query={game(id:"id"){id,answers,playername,status,mistakes}}'
		"game": &graphql.Field{
			Type:        gameType,
			Description: "Retrieve Game",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {

				id, isOK := params.Args["id"].(string)
				if isOK {
					game, _ := db.GameDB.FindByID(id)

					return game, nil
				}

				return models.Game{}, nil
			},
		},
		// curl -g 'http://localhost:8080/api?query={answer(id:"id",letter:"w"){id,answers,playername,status,mistakes}}'
		"answer": &graphql.Field{
			Type:        gameType,
			Description: "Retrieve Game",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"letter": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id, idIsOk := params.Args["id"].(string)
				letter, letterIsOk := params.Args["letter"].(string)
				gameService := services.GameService{}

				if idIsOk && letterIsOk {
					return gameService.Play(id, letter)
				}

				return models.Game{}, nil
			},
		},
	},
})

// Schema : define Schema, with our rootQuery and rootMutation
var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
})
