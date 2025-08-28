# Solo-Chat-App Backend

This is the backend for the Solo-Chat-App, a real-time chat application with group and direct messaging, built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- User authentication with JWT
- Real-time messaging with Socket.IO
- Group chat and direct messaging (DM)
- Profile picture and group picture uploads (Cloudinary)
- Join codes for chat rooms
- Live member count and room updates
- REST API for user, chat room, and message management

## Folder Structure

```
backend/
  config/           # Database and cloudinary config
  controllers/      # Route controllers (auth, chatRoom, message, upload)
  middleware/       # Express middleware (auth, error handling)
  models/           # Mongoose models (User, ChatRoom, Message, etc.)
  routes/           # Express route definitions
  sockets/          # Socket.IO event handlers
  utils/            # Utility functions (JWT, helpers)
  .env              # Environment variables (not committed)
  server.js         # Main server entry point
  package.json      # Backend dependencies and scripts
```

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
FRONTEND_PORT=your_frontend_port
FRONTEND_URL=your_frontend_url
BACKEND_PORT=your_backend_port
ACCESS_SECRET=your_jwt_access_secret
REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## Running Locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start the backend server:
   ```
   npm start
   ```
3. The backend will run on the port specified in `.env` (default: 5000).

## Deployment

- Serve the frontend's `dist/` folder using Express static middleware.
- Set all environment variables in your deployment platform (e.g., Render, Heroku).
- Make sure MongoDB and Cloudinary credentials are set.

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/chatroom` - Chat room management
- `/api/upload` - Profile and group picture uploads

## Socket.IO Events

- `send-message`, `receive-message`
- `join-room`, `leave-room`
- `update-profile-picture`, `receive-photo-update`
- `update-group-profile-picture`, `receive-group-photo-update`
- `change-room-name`, `update-room-name`
- `update-chat-room`, `update-chat-room-client`

## License

MIT
