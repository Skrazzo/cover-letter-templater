package main

import (
	"backend/config"
	"backend/routes"
	"log"
)

func main() {
	// Load env variables
	env := config.LoadEnv()

	// Setup routes
	routes := routes.SetupRoutes()

	// Listen on port smth
	log.Printf("Starting server on %s PORT\n", env["port"])
	log.Fatal(routes.Run(":8080"))
}
