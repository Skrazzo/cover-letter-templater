package template

import (
	"backend/db"
	"context"
	"time"
)

type Template struct {
	ID        int
	UserID    int
	Name      string
	Template  string
	CreatedAt time.Time
}

func Create(name string, template string, userId float64) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// build query
	query := `INSERT INTO templates (name, template, user_id) VALUES ($1, $2, $3)`

	// execute query
	_, err := db.Pool.Exec(ctx, query, name, template, userId)

	return err
}

// * will follow the pointer to its value
// If user id is 0, then we will search only by name
func FindByName(name string, userId float64) ([]Template, error) {
	// Create timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Build query and execute
	query := `SELECT * FROM templates WHERE "name" = $1`
	args := []any{name}

	// Do we need to search by user id?
	if userId > 0 {
		query += " AND user_id = $2"
		args = append(args, userId)
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
	var results []Template
	for rows.Next() {
		var t Template
		if err := rows.Scan(&t.ID, &t.UserID, &t.Name, &t.Template, &t.CreatedAt); err != nil {
			return nil, err
		}

		results = append(results, t)
	}

	// Give pointer back
	return results, nil
}
