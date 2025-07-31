# Full-Stack Calculator App

A modern calculator application built with React, Node.js, Express, PostgreSQL, and Docker.

## Features

- 🧮 **Full Calculator Functionality** - Basic arithmetic operations (+, -, ×, ÷)
- 📝 **Calculation History** - View last 20 calculations stored in PostgreSQL
- 🐳 **Docker Containerized** - Easy deployment with Docker Compose
- 🎨 **Responsive Design** - Works on desktop and mobile
- ⚡ **Real-time Updates** - History updates immediately after calculations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** for styling
- **Nginx** for production serving

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for data storage
- **CORS** enabled for cross-origin requests

### Infrastructure
- **Docker & Docker Compose** for containerization
- **PostgreSQL 15** Alpine image
- **Nginx** for serving frontend

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (for cloning)

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/consoledog/calculator-app.git
   cd calculator-app
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Open your browser and go to: http://localhost
   - The calculator will be ready to use!

### Services

The application runs on the following ports:
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## Usage

1. **Basic Calculations:**
   - Click numbers and operators to build expressions
   - Press `=` to calculate the result
   - Press `C` to clear the display

2. **View History:**
   - All calculations are automatically saved
   - History panel shows the last 20 calculations
   - History updates in real-time

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (React)       │◄──►│   (Express)     │◄──►│   (Database)    │
│   Port: 80      │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/history` - Get calculation history
- `POST /api/history` - Save new calculation

## Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Database Schema

```sql
CREATE TABLE history (
  id SERIAL PRIMARY KEY,
  expression TEXT NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Features

- Input validation to prevent SQL injection
- Expression validation (only allows safe mathematical characters)
- PostgreSQL parameterized queries
- No use of dangerous `eval()` function

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as you like!

---

**Created by consoledog** - A full-stack calculator with modern web technologies 🚀
