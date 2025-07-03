package config

import "os"

func defaultValue(val string, def string) string {
	if val == "" {
		return def
	}
	return val
}

func LoadEnv() map[string]string {
	// Create object where to store used variables
	env := make(map[string]string, 1)

	// Get env variables that will be used while server is running
	env["db"] = defaultValue(os.Getenv("POSTGRES_DB"), "postgresql://postgres:postgres@db:5432/cover-letter")

	return env
}
