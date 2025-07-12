package chatgpt

import (
	"backend/config"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

type ChatRequest struct {
	Model    string        `json:"model"`
	Messages []ChatMessage `json:"messages"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func GenerateCoverLetter(templateHTML string, jobHTML string) (string, error) {
	apiKey := config.Env["CHATGPT_KEY"]
	if apiKey == "" {
		return "", errors.New("no API key chat gpt provided")
	}

	payload := ChatRequest{
		Model: "gpt-4o", // o4-mini
		Messages: []ChatMessage{
			{
				Role:    "system",
				Content: `You are a helpful assistant that fills out cover letter templates in HTML format. Replace all <...> tags like <company>, <experience>, etc., with appropriate content based on the job application.`,
			},
			{
				Role: "user",
				Content: fmt.Sprintf(`Template: 
%s

Job description:
%s

Respond with ONLY the filled HTML cover letter.`, templateHTML, jobHTML),
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(body))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 20 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return "", err
	}

	if len(result.Choices) == 0 {
		return "", fmt.Errorf("no response from GPT")
	}

	return result.Choices[0].Message.Content, nil
}
