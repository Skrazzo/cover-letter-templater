package template

import (
	"backend/models/template"
	"backend/utils/jwt"
	res "backend/utils/responses"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type TemplateForm struct {
	Name     string `json:"name" validate:"required,min=2,max=50"`
	Template string `json:"template" validate:"required"`
}

var validate = validator.New()

func Create(c *gin.Context) {
	// Receive data from frontend, check if data is okay, hash password, call model
	var data TemplateForm
	if err := c.ShouldBindJSON(&data); err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Validate data
	if err := validate.Struct(data); err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Get user id
	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	// Check if template already exists
	templates, err := template.FindByName(data.Name, user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Check if template already exists with that name
	if len(templates) > 0 {
		res.Error(c, "Template already exists", http.StatusBadRequest)
		return
	}

	// Create in database
	if err := template.Create(data.Name, data.Template, user.Id); err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, gin.H{"message": "Successfully created template"})
}

func Get(c *gin.Context) {
	// Get user from context
	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	// Get all user templates
	templates, err := template.Get("user_id = $1", user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, templates)
}

func Update(c *gin.Context) {
}

func Delete(c *gin.Context) {
}
