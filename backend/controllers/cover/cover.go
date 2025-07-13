package cover

import (
	"backend/models/cover"
	"backend/models/template"
	"backend/utils"
	"backend/utils/chatgpt"
	"backend/utils/jwt"
	res "backend/utils/responses"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

type CoverGet struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func Get(c *gin.Context) {
	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	covers, err := cover.Get("user_id = $1 ORDER BY created_at DESC", user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Asign only id and name, for efficieny
	coverPreviews := make([]CoverGet, len(covers))
	for i, cover := range covers {
		coverPreviews[i] = CoverGet{
			Id:   cover.ID,
			Name: cover.Name,
		}
	}

	res.Success(c, gin.H{"covers": coverPreviews})
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

	cover, err := cover.Get("id = $1 AND user_id = $2", id, user.Id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(cover) == 0 {
		res.Error(c, "Cover not found", http.StatusNotFound)
		return
	}

	res.Success(c, gin.H{"cover": cover[0]})
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
	generatedCover, err := chatgpt.GenerateCoverLetter(templates[0].Template, data.Application)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	// Find cover name that doesnt exist
	coverName := generatedCover.Name
	for i := 1; true; i++ {
		// Try to find cover with same name
		covers, err := cover.Get("name = $1 AND user_id = $2", coverName, user.Id)
		if err != nil {
			res.Error(c, err.Error(), http.StatusInternalServerError)
			return
		}

		// Found non existent name
		if len(covers) == 0 {
			break
		}

		// Change number on name
		coverName = fmt.Sprintf("%s (%d)", generatedCover.Name, i)
	}

	// Save name in database
	if err := cover.Create(coverName, generatedCover.Cover, user.Id); err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, gin.H{"message": "Successfully created " + coverName})
}

type CoverPut struct {
	Name   string `json:"name" validate:"required,min=1"`
	Letter string `json:"letter" validate:"required,min=50"`
}

func Put(c *gin.Context) {
	// Get request data
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	var data CoverPut
	if err := utils.BindAndValidate(&data, c); err != nil {
		res.Error(c, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := jwt.GetUser(c)
	if err != nil {
		res.NeedsToLogin(c)
		return
	}

	// Find cover letter in database, verify it exists, and update it
	letters, err := cover.Get("user_id = $1 AND id = $2", user.Id, id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(letters) == 0 {
		res.Error(c, "Cover letter not found", http.StatusNotFound)
		return
	}

	err = cover.Update(data.Name, data.Letter, id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, gin.H{"message": "Successfully updated cover letter"})
}

func Delete(c *gin.Context) {
	// Get request data
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

	// Find cover letter in database, verify it exists, and delete it
	letters, err := cover.Get("user_id = $1 AND id = $2", user.Id, id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(letters) == 0 {
		res.Error(c, "Cover letter not found", http.StatusNotFound)
		return
	}

	err = cover.Delete(id)
	if err != nil {
		res.Error(c, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Success(c, gin.H{"message": "Successfully deleted cover letter"})
}
