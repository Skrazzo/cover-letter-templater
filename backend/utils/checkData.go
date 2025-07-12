package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

func BindAndValidate(data any, c *gin.Context) error {
	if err := c.ShouldBindJSON(data); err != nil {
		return err
	}

	if err := validate.Struct(data); err != nil {
		return err
	}
	return nil
}
