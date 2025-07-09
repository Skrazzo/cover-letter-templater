package user

import (
	"backend/config"
	"backend/models/user"
	"backend/utils/hash"
	"backend/utils/jwt"
	"errors"
	"fmt"
	"log"
	"net/http"

	res "backend/utils/responses"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgconn"
)

type RegisterForm struct {
	Email          string `json:"email" validate:"required,email"`
	Name           string `json:"name" validate:"required,min=2,max=50"`
	Password       string `json:"password" validate:"required,min=8"`
	RepeatPassword string `json:"repeatPassword" validate:"required,min=8,eqfield=Password"`
}

func Register(c *gin.Context) {
	// Receive data from frontend, check if data is okay, hash password, call model
	var data RegisterForm
	if err := c.ShouldBindJSON(&data); err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Validate data
	validate := validator.New()
	if err := validate.Struct(data); err != nil {
		// Handle error
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Hash password
	hash, err := hash.HashPassword(data.Password)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert into database
	if err := user.Create(data.Email, data.Name, hash); err != nil {
		// Find out postgres error
		var pgErr *pgconn.PgError
		if !errors.As(err, &pgErr) {
			// Unknown error
			res.Error(c, fmt.Sprintf("[UNEXPECTED DB ERROR] %v", err.Error()), http.StatusInternalServerError)
			return
		}

		// Postgres error
		log.Printf("[ERROR] Postgres code: %s", pgErr.Code)
		if pgErr.Code == "23505" {
			// UNIQUE constraint violation (EMAIL TAKEN)
			res.Error(c, "Email already exists", http.StatusBadRequest)
			return
		}

		// Unknown error
		res.Error(c, fmt.Sprintf("[UNKNOWN ERROR] %v", err.Error()), http.StatusInternalServerError)
		return
	}

	// Return success
	res.Success(c, gin.H{
		"message": "Successfully registered",
	})
}

type LoginForm struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func Login(c *gin.Context) {
	// Bind data
	var data LoginForm
	if err := c.ShouldBindJSON(&data); err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate data
	validate := validator.New()
	if err := validate.Struct(data); err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Find user in database
	user, err := user.FindByEmail(data.Email)
	if err != nil {
		var pgErr *pgconn.PgError
		// Check if pg err
		if errors.As(err, &pgErr) {
			res.Error(c, pgErr.Message, http.StatusInternalServerError)
			return
		}

		// Email not found
		res.Error(c, "Email or password are incorrect", http.StatusUnauthorized)
		return
	}

	// Check hash
	match := hash.CheckPasswordHash(data.Password, user.Password)
	if !match {
		res.Error(c, "Email or password are incorrect", http.StatusUnauthorized)
		return
	}

	// Generate JWT token, and send to client
	signedToken, err := jwt.GenerateJWT(user)
	if err != nil {
		res.Error(c, fmt.Sprintf("[JWT Generation] %s", err.Error()), http.StatusInternalServerError)
		return
	}

	// Return token as cookie
	secureCookie := config.Env["Environment"] != "dev" // In dev environment cookie wont be secure
	// 3600S -> 1H * 24H -> 1D * 7 -> 1W
	c.SetCookie("jwt-token", signedToken, 3600*24*7, "/", "localhost", secureCookie, true)

	// Return successful login
	res.Success(c, gin.H{"message": "Successfully logged in"})
}

// Returns info from token middleware
func TokenInfo(c *gin.Context) {
	user, err := jwt.GetUser(c)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, user)
}
