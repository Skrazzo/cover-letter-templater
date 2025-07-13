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
	covers.GET("", cover.Get)           // Get all letters
	covers.GET("/:id", cover.GetID)     // get single letter
	covers.POST("", cover.Post)         // create new letter
	covers.PUT("/:id", cover.Put)       // edit letter
	covers.DELETE("/:id", cover.Delete) // delete letter

	return r
}
