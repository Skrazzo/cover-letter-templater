package routes

import (
	"backend/controllers/user"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Guest routes (Register, Login, check auth)
	r.POST("/register", user.Register)
	r.POST("/login", user.Login)

	return r
}
