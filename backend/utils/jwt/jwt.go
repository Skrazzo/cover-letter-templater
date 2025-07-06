package jwt

import (
	"backend/config"
	"backend/models/user"
	"fmt"
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
