package main

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)
type FinanceEntry struct {
	gorm.Model
	Category string  `json:"category"`
	Type     string  `json:"type"`   
	Goal     float64 `json:"goal"`   
	Actual   float64 `json:"actual"`
}

var DB *gorm.DB 

func initDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("tracker.db"), &gorm.Config{})
	if err != nil {
		fmt.Println("Error detail:", err) 
		panic("Failed to connect to database")
	}
	DB.AutoMigrate(&FinanceEntry{})
}

func seedData() {
	var count int64
	DB.Model(&FinanceEntry{}).Count(&count)
	if count == 0 {
		entries := []FinanceEntry{
			{Category: "Salary", Type: "income", Goal: 5000, Actual: 5050},
			{Category: "Rent", Type: "expense", Goal: 1200, Actual: 1200},
			{Category: "Gaming (HSR/Genshin)", Type: "expense", Goal: 100, Actual: 150},
			{Category: "Laptop Fund", Type: "income", Goal: 1000, Actual: 1000},
		}
		for _, e := range entries {
			DB.Create(&e)
		}
	}
}

func main() {
	initDatabase()
	app := fiber.New()
	app.Use(cors.New())

	app.Get("/api/entries", func(c *fiber.Ctx) error {
		var entries []FinanceEntry
		DB.Find(&entries)
		return c.JSON(entries)
	})

	app.Post("/api/entries", func(c *fiber.Ctx) error {
		entry := new(FinanceEntry)
		if err := c.BodyParser(entry); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}
		DB.Create(&entry)
		return c.Status(201).JSON(entry)
	})

	app.Put("/api/entries/:id", func(c *fiber.Ctx) error {
    id := c.Params("id")
    var entry FinanceEntry
    if err := DB.First(&entry, id).Error; err != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Entry not found"})
    }
    if err := c.BodyParser(&entry); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
    }
    DB.Save(&entry)
    return c.JSON(entry)
})

	app.Delete("/api/entries/:id", func(c *fiber.Ctx) error {
    id := c.Params("id")
    var entry FinanceEntry
    if err := DB.First(&entry, id).Error; err != nil {
        return c.Status(404).JSON(fiber.Map{"error": "Entry not found"})
    }
    DB.Delete(&entry)
    return c.JSON(fiber.Map{"message": "Entry deleted"})
})

	app.Listen(":8080")
}