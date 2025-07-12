package config

import "os"

func defaultValue(val string, def string) string {
	if val == "" {
		return def
	}
	return val
}

var Env map[string]string

func LoadEnv() {
	// Create object where to store used variables
	Env = make(map[string]string)

	// Get env variables that will be used while server is running
	Env["db"] = defaultValue(os.Getenv("POSTGRES_DB"), "postgresql://postgres:postgres@db:5432/cover-letter")
	Env["JWT_SECRET"] = defaultValue(os.Getenv("JWT_SECRET"), "just a random string here")
	Env["Environment"] = defaultValue(os.Getenv("Environment"), "dev")
	Env["CHATGPT_KEY"] = defaultValue(os.Getenv("CHATGPT_KEY"), "")
}
