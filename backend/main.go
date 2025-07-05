package main

import (
	"backend/config"
	"backend/db"
	"backend/routes"
	"log"
	"os"
)

func main() {
	// Load env variables
	env := config.LoadEnv()

	// Connect to database
	err := db.Connect(env["db"])
	if err != nil {
		os.Exit(1)
	}

	// Migrate database if needed
	err = db.Migrate()
	if err != nil {
		os.Exit(1)
	}

	// Setup routes
	routes := routes.SetupRoutes()

	// Listen on port smth
	log.Printf("Starting server ...")
	log.Fatal(routes.Run(":8080"))
}
