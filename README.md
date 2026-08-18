# Cal-Track

A full-stack calorie tracking application built with Angular and Node.js/Express, designed to help users track their daily food intake and monitor nutritional goals.

## Features

- **User Authentication**: Secure login/signup with JWT-based authentication
- **Food Logging**: Track meals throughout the day (breakfast, lunch, dinner, snacks)
- **Macro Tracking**: Monitor calories, protein, and carbohydrates
- **Daily Goals**: Set and track daily calorie and protein goals
- **History View**: Review past days' nutritional intake
- **Real-time Updates**: Immediate feedback on progress toward goals
- **Responsive Design**: Clean, modern UI built with PrimeNG components

## Tech Stack

### Frontend
- **Angular 19**: Modern reactive framework
- **PrimeNG 19**: UI component library
- **TypeScript**: Type-safe development

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **SQLite**: Lightweight database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

## Project Structure

```
cal-track/
├── cal-track-backend/     # Node.js/Express API
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
└── cal-track-ui/         # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Reusable components
    │   │   ├── pages/       # Page components
    │   │   ├── services/    # Angular services
    │   │   └── guards/      # Route guards
    │   └── ...
    └── ...
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd cal-track-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (see `.env.example` for reference)

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000` by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd cal-track-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200` by default.

## Usage

1. **Sign Up**: Create a new account
2. **Setup**: Set your daily calorie and protein goals
3. **Log Meals**: Add food entries throughout the day
4. **Track Progress**: Monitor your daily intake against goals
5. **Review History**: Check past days' nutritional data

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Food Log
- `GET /api/food-log/today` - Get today's food log
- `POST /api/food-log/create` - Create food log entry
- `DELETE /api/food-log/:id` - Delete food log entry
- `GET /api/food-log/history` - Get historical data

### Macros
- `GET /api/macros` - Get all macros
- `POST /api/macros/create` - Create new macro
- `PUT /api/macros/:id` - Update macro
- `DELETE /api/macros/:id` - Delete macro

### Settings
- `GET /api/settings` - Get user settings
- `POST /api/settings` - Update user settings

## Database

The application uses SQLite for data persistence. The database file (`cal.db`) is automatically created on first run with the following tables:
- `users` - User accounts
- `settings` - User preferences and goals
- `macros` - Food macro definitions
- `food_log` - Daily food entries

## Development

### Backend Development
```bash
cd cal-track-backend
npm start
```

### Frontend Development
```bash
cd cal-track-ui
npm start
```