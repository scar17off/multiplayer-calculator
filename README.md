# Multiplayer Calculator

A real-time multiplayer calculator application built with Node.js, Express, Socket.IO, and React.

## Features

- Real-time collaboration on calculations
- Support for both simple and algebraic calculators
- Chat functionality
- Multiple rooms
- User authentication and roles (admin, moderator, user)

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/scar17off/multiplayer-calculator
   cd multiplayer-calculator
   ```

2. Install dependencies for both backend and frontend:
   ```
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=443
   adminlogin=your_admin_password
   modlogin=your_moderator_password
   ```

### Running the Application

1. Start the backend server:
   ```
   npm start
   ```

2. In a separate terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000/`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
