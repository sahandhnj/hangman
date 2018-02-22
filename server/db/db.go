package db

import (
	. "git.sahand.cloud/sahand/hangman/server/models"
	mongo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

var database *mongo.Database
var GameDB = GameDBModel{}

const (
	// COLLECTION the collection name
	COLLECTION = "games"
)

// GameDBModel Mongo data model
type GameDBModel struct {
	Server   string
	Database string
}

// Connect to DB
func (g *GameDBModel) Connect() {
	session, err := mongo.Dial(g.Server)
	if err != nil {
		log.Fatal(err)
	}

	database = session.DB(g.Database)
}

// FindAll games
func (g *GameDBModel) FindAll() ([]Game, error) {
	var games []Game
	err := database.C(COLLECTION).Find(bson.M{}).All(&games)

	return games, err
}

// FindByGameID
func (g *GameDBModel) FindByGameID(id string) (Game, error) {
	var game Game
	err := database.C(COLLECTION).Find(bson.M{"gameid": id}).One(&game)

	return game, err
}

// FindByID finds one per Id
func (g *GameDBModel) FindByID(id string) (Game, error) {
	var game Game
	err := database.C(COLLECTION).FindId(bson.ObjectIdHex(id)).One(&game)

	return game, err
}

// Insert create model to mongo
func (g *GameDBModel) Insert(game Game) error {
	game.ID = bson.NewObjectId()
	err := database.C(COLLECTION).Insert(&game)

	return err
}

// Update the current game
func (g *GameDBModel) Update(game Game) error {
	err := database.C(COLLECTION).UpdateId(game.ID, &game)
	return err
}
