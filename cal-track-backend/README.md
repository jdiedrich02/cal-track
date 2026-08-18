# Cal-Track Backend

RESTful API for the Cal-Track calorie tracking application.

## Technologies

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
JWT_SECRET=super_secret_token_here
JWT_EXPIRES=<NUMBER>m
```

## Running the Server

### Development
```bash
npm start
```

The server will start on `http://localhost:3000`

## Database

The application uses SQLite with the following tables:

### Database Initialization

The database (`cal.db`) is automatically created on first run with all necessary tables. No manual setup is required. Simply start the server and the database will be initialized automatically.

### Database Schema

### users
- `id` (integer, primary key)
- `username` (text, unique)
- `email` (text, unique)
- `password_hash` (text)
- `created_at` (datetime)

### settings
- `id` (integer, primary key)
- `user_id` (integer, foreign key)
- `calorie_goal` (integer)
- `protein_goal` (integer)
- `starting_weight` (real)
- `goal_type` (text)

### macros
- `id` (integer, primary key)
- `user_id` (integer, foreign key)
- `name` (text, unique)
- `unit` (text: 'grams' or 'quantity')
- `grams` (integer)
- `calories` (integer)
- `protein` (integer)
- `carbs` (integer)

### food_log
- `id` (integer, primary key)
- `user_id` (integer, foreign key)
- `name` (text)
- `calories` (integer)
- `protein` (integer)
- `carbs` (integer)
- `meal_type` (text: 'breakfast', 'lunch', 'dinner', 'snack')
- `logged_at` (datetime)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Development

### Project Structure
```
cal-track-backend/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
├── db.js          # Database initialization
├── app.js         # Express app setup
└── .env           # Environment variables
```

### Adding New Endpoints

1. Create route in `routes/`
2. Create controller in `controllers/`
3. Create model in `models/` (if needed)
4. Register route in `app.js`
