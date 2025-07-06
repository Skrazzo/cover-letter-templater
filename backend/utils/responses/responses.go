package responses

import (
	"github.com/gin-gonic/gin"
)

func Success(c *gin.Context, data gin.H) {
	// Return success to api
	c.JSON(200, gin.H{
		"success": true,
		"data":    data,
	})
}

func Error(c *gin.Context, err string, code int) {
	// Return error to api
	c.JSON(code, gin.H{
		"success": false,
		"error":   err,
	})
}
