package template

import (
	"backend/db"
	"context"
	"time"
)

type Template struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Name      string    `json:"name"`
	Template  string    `json:"template"`
	CreatedAt time.Time `json:"created_at"`
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
	templates, err := Get(`"name" = $1 AND user_id = $2`, name, userId)
	if err != nil {
		return nil, err
	}

	return templates, nil
}

func Get(where string, args ...any) ([]Template, error) {
	// Create timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Build query and execute
	query := `SELECT * FROM templates`
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
	var results []Template
	for rows.Next() {
		var t Template
		if err := rows.Scan(&t.ID, &t.UserID, &t.Name, &t.Template, &t.CreatedAt); err != nil {
			return nil, err
		}

		results = append(results, t)
	}

	return results, nil
}

func Update(id int, name string, template string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `UPDATE templates SET name = $1, template = $2 WHERE id = $3`
	_, err := db.Pool.Exec(ctx, query, name, template, id)

	return err
}

func Delete(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `DELETE FROM templates WHERE id = $1`
	_, err := db.Pool.Exec(ctx, query, id)

	return err
}
