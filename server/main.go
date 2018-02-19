package main

import (
	. "git.sahand.cloud/sahand/hangman/server/db"
)

const DB_HOST = "localhost"
const DB_NAME= "hangman"


var database = GameDBModel{}

func main() {

	database.Server = DB_HOST
	database.Database = DB_NAME
	database.Connect()

}