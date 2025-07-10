package jwt

import (
	"backend/config"
	"backend/models/user"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type UserClaims struct {
	Id    float64 `json:"id"`
	Name  string  `json:"name"`
	Email string  `json:"email"`
}

func GenerateJWT(u *user.User) (string, error) {
	// Generate JWT token
	mySigningKey := []byte(config.Env["JWT_SECRET"])
	token := jwt.New(jwt.SigningMethodHS256)

	// Add claims (Values)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = u.Id
	claims["name"] = u.Name
	claims["email"] = u.Email
	claims["exp"] = time.Now().Add(time.Hour * 24 * 7).Unix() // Expire in 7 days

	// Generate signed token
	tokenString, err := token.SignedString(mySigningKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ParseJWT(tokenString string) (jwt.MapClaims, error) {
	mySigningKey := []byte(config.Env["JWT_SECRET"])

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return mySigningKey, nil
	})
	// Check token parsing errors
	if err != nil {
		return nil, err
	}

	// If good values then return
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	// Return on invalid token
	return nil, fmt.Errorf("invalid token")
}

func GetUser(c *gin.Context) (UserClaims, error) {
	// Get user from context
	user, ok := c.Get("user")
	if !ok {
		return UserClaims{}, fmt.Errorf("no user in middleware context")
	}

	// Get claims from user
	mapClaims, ok := user.(jwt.MapClaims)
	if !ok {
		return UserClaims{}, fmt.Errorf("invalid token claims")
	}

	return UserClaims{
		Id:    mapClaims["id"].(float64),
		Name:  mapClaims["name"].(string),
		Email: mapClaims["email"].(string),
	}, nil
}
