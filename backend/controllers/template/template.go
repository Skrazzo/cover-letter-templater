package template

import (
	"backend/models/template"
	"backend/utils"
	"backend/utils/jwt"
	res "backend/utils/responses"
	"net/http"
	"strconv"
	"time"

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

type TemplatePreview struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	UserID    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}

func Get(c *gin.Context) {
	// Get user from context
	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	// Get all user templates
	templates, err := template.Get("user_id = $1 ORDER BY created_at DESC", user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	templatePreview := make([]TemplatePreview, len(templates))
	for i, t := range templates {
		templatePreview[i] = TemplatePreview{
			Id:        t.ID,
			Name:      t.Name,
			UserID:    t.UserID,
			CreatedAt: t.CreatedAt,
		}
	}

	res.Success(c, templatePreview)
}

func GetID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	templates, err := template.Get("id = $1 AND user_id = $2", id, user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(templates) == 0 {
		res.Error(c, "Template not found", http.StatusNotFound)
		return
	}

	res.Success(c, gin.H{"template": templates[0]})
}

type PutData struct {
	Name    string `json:"name" validate:"required,min=1,max=50"`
	Content string `json:"content" validate:"required,min=50"`
}

func Put(c *gin.Context) {
	// Get request data, with id, and user
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	var data PutData
	if err := utils.BindAndValidate(&data, c); err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if template already exists
	templates, err := template.Get("user_id = $1 AND id = $2", user.Id, id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Check if template is found
	if len(templates) == 0 {
		res.Error(c, "Template not found", http.StatusNotFound)
		return
	}

	// Update template
	err = template.Update(id, data.Name, data.Content)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, gin.H{"message": "Successfully updated template"})
}

func Delete(c *gin.Context) {
	// Get request data, with id, and user
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	// Check if template exists
	templates, err := template.Get("id = $1 AND user_id = $2", id, user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(templates) == 0 {
		res.Error(c, "Template not found", http.StatusNotFound)
		return
	}

	// Delete template, and return success
	if err := template.Delete(id); err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, gin.H{"message": "Successfully deleted template"})
}
