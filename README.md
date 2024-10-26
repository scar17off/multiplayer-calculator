# Multiplayer Calculator

A real-time multiplayer calculator application built with Node.js, Express, Socket.IO, and React.

## Features

- Real-time collaboration on calculations
- Support for both simple and algebraic calculators
- Chat functionality
- Multiple rooms
- User authentication and roles (admin, moderator, user)

## Technologies Used

- Backend:
  - Node.js
  - Express
  - Socket.IO
- Frontend:
  - React
  - Socket.IO Client

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/scar17off/multiplayer-calculator.git
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

3. Open your browser and navigate to `http://localhost:3000`

## Usage

- Join a room or create a new one by appending `?room=roomname` to the URL
- Use the calculator by clicking on the buttons or typing on your keyboard
- Chat with other users in the same room
- Admins and moderators can use special commands (type `/help` in the chat for a list of commands)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.