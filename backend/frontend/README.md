
# ChatApp Frontend

This is the frontend for **ChatApp**, a real-time chat application built with React and Vite. It supports multi-user chat rooms, authentication, and live messaging using Socket.IO.

## Features

- **Modern React**: Built with React functional components and hooks
- **Real-time Messaging**: Uses Socket.IO for instant message delivery and chat room updates
- **Authentication**: Secure login, signup, and session management with JWT and cookies
- **Chat Rooms**: Create, join, leave, and rename chat rooms (group and private)
- **Responsive UI**: Clean, user-friendly interface with modular CSS
- **State Management**: Uses React Context for authentication and chat room state

## Project Structure

```
frontend/
  src/
    components/         # UI components (chat, login, general)
    contexts/           # React Context providers (auth, chatRoom, socket)
    pages/              # Page-level components (Home, Register, ChatRoom)
    routes/             # Route protection and navigation
    styles/             # Global and variables CSS
    utils/              # API utilities (axios setup, interceptors)
  vite.config.js        # Vite configuration
  eslint.config.js      # ESLint configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Backend server (see `/backend` folder)

### Installation
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the `frontend` directory with:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
   (Adjust the URL if your backend runs elsewhere)

### Running the App
Start the development server:
```sh
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Usage

1. Register a new account or log in.
2. Create or join chat rooms using join codes.
3. Send and receive messages in real time.
4. Rename or leave chat rooms as needed.

## Technologies Used
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Socket.IO Client](https://socket.io/)
- [Axios](https://axios-http.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)


