package cover

import (
	"backend/models/template"
	"backend/utils"
	"backend/utils/chatgpt"
	"backend/utils/jwt"
	res "backend/utils/responses"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

func Get(c *gin.Context) {
}

type CoverPost struct {
	TemplateId  string `json:"templateId" validate:"required,number,min=1"`
	Application string `json:"application" validate:"required,min=50"`
}

func Post(c *gin.Context) {
	// Receive data from frontend, check if data is okay, hash password, call model
	var data CoverPost
	if err := utils.BindAndValidate(&data, c); err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Get user data from the token
	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	// Get tempalte
	templates, err := template.Get("user_id = $1 AND id = $2", user.Id, data.TemplateId)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Check if template exists
	if len(templates) == 0 {
		res.Error(c, "Template not found", http.StatusNotFound)
		return
	}

	// Call chat and ask for cover letter nicely
	coverLetter, err := chatgpt.GenerateCoverLetter(templates[0].Template, data.Application)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, coverLetter)
}

func Put(c *gin.Context) {
}

func Delete(c *gin.Context) {
}
