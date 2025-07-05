package models

import (
	"backend/db"
	"context"
	"time"
)

type User struct {
	ID        int
	email     string
	name      string
	password  string
	createdAt string
}

func (u *User) Create(email string, name string, hash string) error {
	// Generate background context for managing timeouts and disconnections
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Build database query
	query := `INSERT INTO users (email, name, password) VALUES ($1, $2, $3)`
	_, err := db.Pool.Exec(ctx, query, email, name, hash)

	// Return error if any
	return err
}
