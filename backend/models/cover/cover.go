package cover

import (
	"backend/db"
	"context"
	"time"
)

type Cover struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Name      string    `json:"name"`
	Letter    string    `json:"letter"`
	CreatedAt time.Time `json:"created_at"`
}

func Get(where string, args ...any) ([]Cover, error) {
	// Create timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Build query and execute
	query := `SELECT * FROM cover_letters`
	if where != "" {
		query += " WHERE " + where
	}

	rows, err := db.Pool.Query(ctx, query, args...)
	// Query executes query instantly, and returns error instantly
	// Not like QueryRow, which executes query only on row.Scan
	if err != nil {
		return nil, err
	}
	// need to tell database to close the rows connection
	// and free up resources
	defer rows.Close()

	// Prepeare results now
	var results []Cover
	for rows.Next() {
		var t Cover
		if err := rows.Scan(&t.ID, &t.UserID, &t.Name, &t.Letter, &t.CreatedAt); err != nil {
			return nil, err
		}

		results = append(results, t)
	}

	return results, nil
}

func Create(name string, letter string, userId float64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// build query
	query := `INSERT INTO cover_letters (name, letter, user_id) VALUES ($1, $2, $3)`

	// execute query
	_, err := db.Pool.Exec(ctx, query, name, letter, userId)

	return err
}
