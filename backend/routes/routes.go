package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Controllers
	users := controllers.User{}

	// Guest routes (Register, Login, check auth)
	r.POST("/register", users.Register)

	return r
}
