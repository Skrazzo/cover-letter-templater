package user

import (
	"backend/db"
	"context"
	"strings"
	"time"
)

type User struct {
	Id        int
	Email     string
	Name      string
	Password  string
	CreatedAt time.Time
}

func Create(email string, name string, hash string) error {
	// Generate background context for managing timeouts and disconnections
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Build database query
	query := `INSERT INTO users (email, name, password) VALUES ($1, $2, $3)`
	_, err := db.Pool.Exec(ctx, query, strings.ToLower(email), name, hash)

	// Return error if any
	return err
}

// Symbol * will follow the pointer to its value
func FindByEmail(email string) (*User, error) {
	// bg context
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Build query
	query := `SELECT * FROM users WHERE email = $1`
	row := db.Pool.QueryRow(ctx, query, strings.ToLower(email))

	// Scan will map rows to User struct
	var u User
	if err := row.Scan(&u.Id, &u.Email, &u.Name, &u.Password, &u.CreatedAt); err != nil {
		return nil, err
	}

	// give pointer
	return &u, nil
}
