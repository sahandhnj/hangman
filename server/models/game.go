package models

import (
	"gopkg.in/mgo.v2/bson"
)

type status int

const (
	INPROGRESS status = iota
	WON
	LOST
)

type Game struct {
	ID         bson.ObjectId `bson:"_id" json:"id"`
	PlayerName string        `bson:"playername" json:"playername"`
	Word       string        `bson:"word" json:"word"`
	Answers    []string      `bson:"answers" json:"answers"`
	Status     int           `bson:"status" json:"status"`
	Mistakes   int           `bson:"mistakes" json:"mistakes"`
}
