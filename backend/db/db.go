package db

import (
	"context"
	"embed"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect(url string) error {
	// Create context timeout, if connection takes more than 5 seconds, it will be canceled automatically
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	// Always cancel timeout to clean up resources
	defer cancel()

	// Open new connection with database url
	var err error
	Pool, err = pgxpool.New(ctx, url)
	if err != nil {
		log.Printf("[ERROR] Failed to connect to DB: %v\n", err)
		return err
	}

	// Ping database to check if its online
	err = Pool.Ping(ctx)
	if err != nil {
		log.Printf("[ERROR] Failed to ping DB: %v", err)
		return err
	}

	// Connection successful
	log.Printf("[INFO] Connected to DB: %v\n", url)
	return nil
}

//go:embed migrations.sql
var migrationFS embed.FS

func Migrate() error {
	// Read file from embed
	sql, err := migrationFS.ReadFile("migrations.sql")
	if err != nil {
		log.Printf("[ERROR] Failed to read migrations.sql: %v\n", err)
		return err
	}

	// Execute sql file into database
	_, err = Pool.Exec(context.Background(), string(sql))
	if err != nil {
		log.Printf("[ERROR] Failed to migrate DB: %v\n", err)
		return err
	}

	return nil
}
