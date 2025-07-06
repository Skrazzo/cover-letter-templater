package jwt

import (
	"backend/config"
	"backend/models/user"
	"time"

	"github.com/golang-jwt/jwt"
)

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
