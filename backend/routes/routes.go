package routes

import (
	"backend/controllers/user"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Guest routes (Register, Login, check auth)
	r.POST("/register", user.Register)
	r.POST("/login", user.Login)

	// Authenticated routes middleware/group
	auth := r.Group("/")
	auth.Use(middleware.IsAuthenticated())

	auth.GET("/info", user.TokenInfo) // Route to check if user is authenticated

	return r
}
