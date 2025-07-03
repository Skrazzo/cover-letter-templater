package main

import "time"

func main() {
	println("Hello, world!")

	for {
		time.Sleep(1 * time.Second)
	}
}
