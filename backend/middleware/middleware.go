package middleware

import (
	"backend/utils/jwt"
	res "backend/utils/responses"

	"github.com/gin-gonic/gin"
)

func IsAuthenticated() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from cookie
		token, err := c.Cookie("jwt-token")
		if err != nil {
			res.NeedsToLogin(c)
			return
		}

		// Parse and check token
		parsed, err := jwt.ParseJWT(token)
		if err != nil {
			// Fail the request
			res.NeedsToLogin(c)
			return
		}

		// Set user in context
		c.Set("user", parsed)

		// Execute next middleware/request
		c.Next()
	}
}

// TODO: Implement middleware for accessing your specific template
// Check if template exists, and is user template (type shi)
