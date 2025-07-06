package responses

import (
	"net/http"

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

func NeedsToLogin(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"success":             false,
		"error":               "Authentication required",
		"needsAuthentication": true, // only appears in this error
	})
}
