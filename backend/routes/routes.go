package routes

import (
	"backend/controllers/template"
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

	// Route to check if user is authenticated
	auth.GET("/info", user.TokenInfo)

	// Template routes (REST FUCKING GOOOOO)
	templates := auth.Group("/templates")
	// GET (Gets all templates)
	templates.POST("", template.Create)
	// PUT (Edit)
	// DELETE (Delete)

	return r
}
