package utils

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

func BindAndValidate(data any, c *gin.Context) error {
	fmt.Println("🔍 BindAndValidate called")

	if err := c.ShouldBindJSON(data); err != nil {
		fmt.Println("❌ Bind error:", err)
		return err
	}

	fmt.Println("✅ Bind success:", data)

	if err := validate.Struct(data); err != nil {
		fmt.Println("❌ Validation error:", err)
		return err
	}

	fmt.Println("✅ Validation success")
	return nil
}
