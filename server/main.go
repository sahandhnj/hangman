package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/julienschmidt/httprouter"
	"git.sahand.cloud/sahand/hangman/server/db"
	"git.sahand.cloud/sahand/hangman/server/schemas"
)

const HOST = "localhost"
const PORT = "8080"
const DB_HOST = "localhost"
const DB_NAME= "hangman"

func executeQuery(query string, schema graphql.Schema, operationName string, variables map[string]interface{}) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:         schema,
		RequestString:  query,
		OperationName:  operationName,
		VariableValues: variables,
	})

	if len(result.Errors) > 0 {
		fmt.Printf("unexpected errors: %v", result.Errors)
	}
	
	return result
}

func optionsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	w.Write([]byte(`{ "ok": true }`))
}

// graphql apiRequest type
type apiRequest struct {
	Query         string                 `json:"query"`
	OperationName string                 `json:"operationName"`
	Variables     map[string]interface{} `json:"variables"`
}

func apiHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var query string
	var operationName string
	var variables map[string]interface{}

	// check url parameters for query and operationNames
	if len(r.URL.Query()["query"]) > 0 {
		query = r.URL.Query()["query"][0]
	}
	if len(r.URL.Query()["operationName"]) > 0 {
		operationName = r.URL.Query()["operationName"][0]
	}

	// load request body
	body, _ := ioutil.ReadAll(r.Body)
	if len(body) > 0 {
		var req apiRequest

		// parse request body as apiRequest
		json.Unmarshal(body, &req)

		// check request body for query and operationName
		if len(req.Query) > 0 {
			query = req.Query
		}
		if len(req.Variables) > 0 {
			variables = req.Variables
		}
		if len(req.OperationName) > 0 {
			operationName = req.OperationName
		}
	}

	//execute query
	result := executeQuery(query, schemas.Schema, operationName, variables)

	//send result to client
	json.NewEncoder(w).Encode(result)
}

func rootMiddleWare(fn httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")

		w.Header().Set("Accept", "application/json")
		w.Header().Set("Accept-Charset", "utf8")
		w.Header().Set("Content-Type", "application/json; charset=utf-8")

		fn(w, r, p)
	}
}


func main() {

	router := httprouter.New()

	db.GameDB.Server = DB_HOST
	db.GameDB.Database = DB_NAME
	db.GameDB.Connect()


	// Two api method required 
	router.GET("/api", rootMiddleWare(apiHandler))
	router.POST("/api", rootMiddleWare(apiHandler))
	router.OPTIONS("/api", rootMiddleWare(optionsHandler))
		
	
	const listen_address = HOST + ":" + PORT

	fmt.Println("HangMan server listenting on", listen_address)
	log.Fatal(http.ListenAndServe(listen_address, router))
}