package models

type User struct {
	ID        int
	email     string
	name      string
	password  string
	createdAt string
}

func Create(email string, name string, hash string) {
	// TODO: Insert user into database
}
