import { ProjectFile } from '../fileTypes';

/**
 * Generates a Go (Golang) project template
 * @returns Array of project files for a Go project
 */
export const generateGoProject = (): ProjectFile[] => {
  return [
    {
      path: 'main.go',
      content: `package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// AppConfig stores application-wide configurations.
type AppConfig struct {
	Port         string
	DatabaseURL  string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

// DB stores the database connection.
var DB *gorm.DB

// loadConfig loads the application configuration from environment variables.
func loadConfig() (AppConfig, error) {
	err := godotenv.Load()
	if err != nil && os.Getenv("APP_ENV") != "production" {
		log.Println("Failed to load .env file, using environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return AppConfig{}, NewError("DATABASE_URL must be set")
	}

	readTimeout := getEnvAsDuration("READ_TIMEOUT", 5*time.Second)
	writeTimeout := getEnvAsDuration("WRITE_TIMEOUT", 5*time.Second)
	idleTimeout := getEnvAsDuration("IDLE_TIMEOUT", 120*time.Second)

	return AppConfig{
		Port:         port,
		DatabaseURL:  databaseURL,
		ReadTimeout:  readTimeout,
		WriteTimeout: writeTimeout,
		IdleTimeout:  idleTimeout,
	}, nil
}

// getEnvAsDuration gets an environment variable as a duration.
func getEnvAsDuration(name string, defaultValue time.Duration) time.Duration {
	valueStr := os.Getenv(name)
	if valueStr == "" {
		return defaultValue
	}
	value, err := time.ParseDuration(valueStr)
	if err != nil {
		log.Printf("Invalid duration for %s: %v, using default value %v", name, err, defaultValue)
		return defaultValue
	}
	return value
}

// initializeDatabase initializes the database connection.
func initializeDatabase(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, NewError("failed to connect to database: " + err.Error())
	}

	// AutoMigrate the schema
	err = db.AutoMigrate(&User{}, &Product{})
	if err != nil {
		return nil, NewError("failed to migrate database: " + err.Error())
	}

	return db, nil
}

// setupRouter sets up the HTTP router.
func setupRouter() *mux.Router {
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/users", GetUsersHandler).Methods("GET")
	r.HandleFunc("/users/{id}", GetUserHandler).Methods("GET")
	r.HandleFunc("/users", CreateUserHandler).Methods("POST")
	r.HandleFunc("/users/{id}", UpdateUserHandler).Methods("PUT")
	r.HandleFunc("/users/{id}", DeleteUserHandler).Methods("DELETE")

	r.HandleFunc("/products", GetProductsHandler).Methods("GET")
	r.HandleFunc("/products/{id}", GetProductHandler).Methods("GET")
	r.HandleFunc("/products", CreateProductHandler).Methods("POST")
	r.HandleFunc("/products/{id}", UpdateProductHandler).Methods("PUT")
	r.HandleFunc("/products/{id}", DeleteProductHandler).Methods("DELETE")

	// Add middleware
	r.Use(loggingMiddleware)
	r.Use(recoverMiddleware)

	return r
}

// loggingMiddleware logs HTTP requests.
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		next.ServeHTTP(w, r)
		duration := time.Since(startTime)

		log.Printf("%s %s %s %v", r.Method, r.RequestURI, r.RemoteAddr, duration)
	})
}

// recoverMiddleware recovers from panics.
func recoverMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic: %v", err)
				RespondWithError(w, http.StatusInternalServerError, "Internal server error")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load configuration
	config, err := loadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	DB, err = initializeDatabase(config.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Setup router
	router := setupRouter()

	// Configure HTTP server
	server := &http.Server{
		Addr:         ":" + config.Port,
		Handler:      router,
		ReadTimeout:  config.ReadTimeout,
		WriteTimeout: config.WriteTimeout,
		IdleTimeout:  config.IdleTimeout,
	}

	// Start the server
	log.Printf("Server starting on port %s", config.Port)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

`
    },
    {
      path: 'models.go',
      content: `package main

import (
	"time"

	"gorm.io/gorm"
)

// User represents the user model.
type User struct {
	gorm.Model
	Name     string    \`json:"name"\`
	Email    string    \`json:"email" gorm:"uniqueIndex"\`
	Password string    \`json:"password"\`
	Orders   []Product \`json:"orders"\`
}

// Product represents the product model.
type Product struct {
	gorm.Model
	Title       string    \`json:"title"\`
	Description string    \`json:"description"\`
	Price       float64   \`json:"price"\`
	UserID      uint      \`json:"user_id"\`
	User        User      \`json:"user"\`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt \`gorm:"index"\`
}
`
    },
    {
      path: 'handlers.go',
      content: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetUsersHandler retrieves all users.
func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	var users []User
	result := DB.Find(&users)
	if result.Error != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to retrieve users")
		return
	}

	RespondWithJSON(w, http.StatusOK, users)
}

// GetUserHandler retrieves a single user by ID.
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var user User
	result := DB.First(&user, id)
	if result.Error != nil {
		RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	RespondWithJSON(w, http.StatusOK, user)
}

// CreateUserHandler creates a new user.
func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	result := DB.Create(&user)
	if result.Error != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	RespondWithJSON(w, http.StatusCreated, user)
}

// UpdateUserHandler updates an existing user.
func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var user User
	result := DB.First(&user, id)
	if result.Error != nil {
		RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	err = json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	DB.Save(&user)

	RespondWithJSON(w, http.StatusOK, user)
}

// DeleteUserHandler deletes an existing user.
func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var user User
	result := DB.First(&user, id)
	if result.Error != nil {
		RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	DB.Delete(&user)

	w.WriteHeader(http.StatusNoContent)
}

// GetProductsHandler retrieves all products.
func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	var products []Product
	result := DB.Find(&products)
	if result.Error != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to retrieve products")
		return
	}

	RespondWithJSON(w, http.StatusOK, products)
}

// GetProductHandler retrieves a single product by ID.
func GetProductHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var product Product
	result := DB.First(&product, id)
	if result.Error != nil {
		RespondWithError(w, http.StatusNotFound, "Product not found")
		return
	}

	RespondWithJSON(w, http.StatusOK, product)
}

// CreateProductHandler creates a new product.
func CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	var product Product
	err := json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	result := DB.Create(&product)
	if result.Error != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to create product")
		return
	}

	RespondWithJSON(w, http.StatusCreated, product)
}

// UpdateProductHandler updates an existing product.
func UpdateProductHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var product Product
	result := DB.First(&product, id)
	if result.Error != nil {
		RespondWithError(w, http.StatusNotFound, "Product not found")
		return
	}

	err = json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	DB.Save(&product)

	RespondWithJSON(w, http.StatusOK, product)
}

// DeleteProductHandler deletes an existing product.
func DeleteProductHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var product Product
	result := DB.First(&product, id)
	if result.Error != nil {
		RespondWithError(w, http.StatusNotFound, "Product not found")
		return
	}

	DB.Delete(&product)

	w.WriteHeader(http.StatusNoContent)
}
`
    },
    {
      path: 'utils.go',
      content: `package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Error represents a custom error type.
type Error struct {
	Message string \`json:"message"\`
}

// NewError creates a new custom error.
func NewError(message string) *Error {
	return &Error{Message: message}
}

// Error implements the error interface.
func (e *Error) Error() string {
	return e.Message
}

// RespondWithError responds with a JSON error message.
func RespondWithError(w http.ResponseWriter, code int, message string) {
	RespondWithJSON(w, code, map[string]string{"error": message})
}

// RespondWithJSON responds with a JSON payload.
func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to marshal JSON response: %v", err)
		RespondWithError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_, err = w.Write(response)
	if err != nil {
		log.Printf("Failed to write response: %v", err)
	}
}
`
    },
    {
      path: 'go.mod',
      content: `module go-api

go 1.21.0

require (
	github.gorilla/mux v1.8.0
	github.com/joho/godotenv v1.5.1
	gorm.io/driver/postgres v1.5.2
	gorm.io/gorm v1.25.2
)

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a // indirect
	github.com/jackc/pgx/v5 v5.3.1 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
)
`
    },
    {
      path: '.env',
      content: `PORT=8080
DATABASE_URL=postgres://user:password@host:port/dbname
READ_TIMEOUT=5s
WRITE_TIMEOUT=5s
IDLE_TIMEOUT=120s
`
    },
    {
      path: 'Dockerfile',
      content: `FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 8080

CMD ["./main"]
`
    },
    {
      path: 'README.md',
      content: `# Go API Project

This is a basic Go API project with the following features:

-   **Database**: PostgreSQL
-   **ORM**: GORM
-   **Router**: Gorilla Mux
-   **Configuration**: .env file

## Getting Started

### Prerequisites

-   Go 1.21 or higher
-   Docker (optional)
-   Docker Compose (optional)

### Installation

1.  Clone the repository:

    \`\`\`bash
    git clone <repository_url>
    cd <project_name>
    \`\`\`

2.  Install dependencies:

    \`\`\`bash
    go mod download
    \`\`\`

3.  Create a \`.env\` file based on the \`.env.example\` file and configure your database settings.

    \`\`\`bash
    cp .env.example .env
    \`\`\`

### Running the Application

1.  Start the database:

    -   Using Docker Compose (recommended):

        \`\`\`bash
        docker-compose up -d
        \`\`\`

    -   Manually:

        Ensure you have a PostgreSQL database running and accessible.

2.  Run the application:

    \`\`\`bash
    go run main.go
    \`\`\`

    The server will start on port 8080 (or the port specified in your \`.env\` file).

### API Endpoints

-   \`GET /users\`: Retrieve all users
-   \`GET /users/{id}\`: Retrieve a user by ID
-   \`POST /users\`: Create a new user
-   \`PUT /users/{id}\`: Update an existing user
-   \`DELETE /users/{id}\`: Delete a user
-   \`GET /products\`: Retrieve all products
-   \`GET /products/{id}\`: Retrieve a product by ID
-   \`POST /products\`: Create a new product
-   \`PUT /products/{id}\`: Update an existing product
-   \`DELETE /products/{id}\`: Delete a product

### Docker

You can use Docker to build and run the application.

1.  Build the Docker image:

    \`\`\`bash
    docker build -t go-api .
    \`\`\`

2.  Run the Docker container:

    \`\`\`bash
    docker run -p 8080:8080 go-api
    \`\`\`

### Docker Compose

You can use Docker Compose to build and run the application along with a PostgreSQL database.

1.  Start the application and database:

    \`\`\`bash
    docker-compose up -d
    \`\`\`

### Contributing

1.  Fork the repository
2.  Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3.  Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4.  Push to the branch (\`git push origin feature/amazing-feature\`)
5.  Open a Pull Request
`
    }
  ];
};
