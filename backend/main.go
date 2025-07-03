package main

import (
	"backend/config"
	"backend/routes"
	"log"
	"net/http"
)

func main() {
	// Load env variables
	env := config.LoadEnv()

	// Setup routes
	routes := routes.SetupRoutes()

	// Listen on port smth
	log.Printf("Starting server on %s PORT\n", env["port"])
	log.Fatal(http.ListenAndServe(":"+env["port"], routes))
}
