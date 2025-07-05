package controllers

import (
	"backend/models"
	"backend/utils"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgconn"
)

type User struct{}

type RegisterForm struct {
	Email          string `json:"email" validate:"required,email"`
	Name           string `json:"name" validate:"required,min=2,max=50"`
	Password       string `json:"password" validate:"required,min=8"`
	RepeatPassword string `json:"repeatPassword" validate:"required,min=8,eqfield=Password"`
}

func (u *User) Register(c *gin.Context) {
	// Receive data from frontend, check if data is okay, hash password, call model
	var data RegisterForm
	if err := c.ShouldBindJSON(&data); err != nil {
		utils.Error(c, err.Error(), http.StatusInternalServerError)
	}

	// Validate data
	validate := validator.New()
	if err := validate.Struct(data); err != nil {
		// Handle error
		utils.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Hash password
	hash, err := utils.HashPassword(data.Password)
	if err != nil {
		utils.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert into database
	userMod := models.User{}
	if err := userMod.Create(data.Email, data.Name, hash); err != nil {
		// Find out postgres error
		var pgErr *pgconn.PgError
		if !errors.As(err, &pgErr) {
			// Unknown error
			utils.Error(c, fmt.Sprintf("[UNEXPECTED DB ERROR] %v", err.Error()), http.StatusInternalServerError)
			return
		}

		// Postgres error
		log.Printf("[ERROR] Postgres code: %s", pgErr.Code)
		if pgErr.Code == "23505" {
			// UNIQUE constraint violation (EMAIL TAKEN)
			utils.Error(c, "Email already exists", http.StatusBadRequest)
			return
		}

		// Unknown error
		utils.Error(c, fmt.Sprintf("[UNKNOWN ERROR] %v", err.Error()), http.StatusInternalServerError)
		return
	}

	// Return success
	utils.Success(c, gin.H{
		"message": "Successfully registered",
	})
}
