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

type ResponseFormat struct {
	Type string `json:"type"`
}

type ChatRequest struct {
	Model          string          `json:"model"`
	Messages       []ChatMessage   `json:"messages"`
	ResponseFormat *ResponseFormat `json:"response_format,omitempty"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GeneratedCover struct {
	Name  string `json:"name"`
	Cover string `json:"cover"`
}

func GenerateCoverLetter(templateHTML string, jobHTML string) (GeneratedCover, error) {
	apiKey := config.Env["CHATGPT_KEY"]
	if apiKey == "" {
		return GeneratedCover{}, errors.New("no API key chat gpt provided")
	}

	payload := ChatRequest{
		Model: "gpt-4o", // o4-mini
		ResponseFormat: &ResponseFormat{Type: "json_object"},
		Messages: []ChatMessage{
			{
				Role:    "system",
				Content: `You are a helpful assistant that fills out cover letter templates in HTML format and provides a name for it. Replace all <...> tags like <company>, <experience>, etc., with appropriate content based on the job application. You must respond with a JSON object with two keys: "name" for the cover letter title (e.g., "Cover Letter for a Software Engineer"), and "cover" for the filled HTML cover letter.`,
			},
			{
				Role: "user",
				Content: fmt.Sprintf(`Template:
%s

Job description:
%s`, templateHTML, jobHTML),
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return GeneratedCover{}, err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(body))
	if err != nil {
		return GeneratedCover{}, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 20 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return GeneratedCover{}, err
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
		return GeneratedCover{}, err
	}

	if len(result.Choices) == 0 {
		return GeneratedCover{}, fmt.Errorf("no response from GPT")
	}

	var cover GeneratedCover
	if err := json.Unmarshal([]byte(result.Choices[0].Message.Content), &cover); err != nil {
		return GeneratedCover{}, fmt.Errorf("failed to parse GPT response: %w", err)
	}

	return cover, nil
}
