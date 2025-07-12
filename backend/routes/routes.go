package routes

import (
	"backend/controllers/cover"
	"backend/controllers/template"
	"backend/controllers/user"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Guest routes (Register, Login)
	r.POST("/register", user.Register)
	r.POST("/login", user.Login)

	// Authenticated routes middleware/group
	auth := r.Group("/")
	auth.Use(middleware.IsAuthenticated())

	// Route to check if user is authenticated
	auth.GET("/info", user.TokenInfo)

	// Template routes (REST FUCKING GOOOOO)
	templates := auth.Group("/templates")
	templates.GET("", template.Get)
	templates.POST("", template.Create)
	// PUT (Edit)
	// DELETE (Delete)

	// Cover letter routes
	covers := auth.Group("/cover")
	covers.POST("", cover.Post)

	return r
}
