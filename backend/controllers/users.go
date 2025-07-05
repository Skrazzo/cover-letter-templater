package controllers

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type User struct{}

type RegisterForm struct {
	Email          string `json:"email" validate:"required,email"`
	Name           string `json:"name" validate:"required"`
	Password       string `json:"password" validate:"required"`
	RepeatPassword string `json:"repeatPassword" validate:"required"`
}

func (u *User) Register(c *gin.Context) {
	// Receive data from frontend, check if data is okay, hash password, call model
	var data RegisterForm
	if err := c.ShouldBindJSON(&data); err != nil {
		// TODO: Handle error
	}

	// Validate data
	validate := validator.New()
	if err := validate.Struct(data); err != nil {
		// Handle error
		log.Fatalf("Error: %v", err.Error())
	}

	// fmt.Println(data)
}
