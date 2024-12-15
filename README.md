# **Example Chat App**

## **Description**

The Example Chat App is a real-time chat application built with websockets. It allows users to create chat rooms, join existing rooms, and send messages in real-time. This project demonstrates the use of modern web technologies to build a responsive and interactive chat application. To mitigate the boilerplate code for websockets, Socket.IO is used. The application uses a WebSocket-only architecture for real-time communication. However, in a production environment, a hybrid networking solution (WebSocket + HTTP) is often more robust and scalable.

## **Features**

### **Server App**
- **In-memory SQLite Database:** Runs a simple in-memory SQLite database.
- **User Management:** Can connect users and manage user sessions.
- **Chat Management:** Can create chat rooms and join users in chats.
- **Real-time Messaging:** Can receive and broadcast messages in chats using Socket.IO.
- **Message Persistence:** Can persist chat history.
- **WebSocket Communication:** Uses Socket.IO for real-time communication.

### **Client App**
- **Vue.js with Vite:** Built with Vue.js and Vite for fast development and hot module replacement.
- **Routing:** Uses Vue Router for navigation between pages.
- **Pages:** Includes three main pages: Login, Home, and Chat.
- **Nested Views:** Home page has nested views for individual chats.
- **BootstrapVue:** Uses BootstrapVue for quick scaffolding and responsive design.

## **Technologies Used**

- **Frontend:**
  - Vue.js: Framework for building the user interface.
  - BootstrapVue: Provides responsive UI components.
  - Socket.IO Client: Manages real-time communication with the server.

- **Backend:**
  - Node.js
  - Socket.IO: Handles real-time communication between the server and clients.
  - SQLite: In-memory database for storing chat history and user data.
  - Express: Serves the client application and provides RESTful endpoints (if needed).

## **Installation**

### **Prerequisites**

- Node.js (v14 or higher)
- npm (v6 or higher)

### **Steps**

1. Clone the repository
2. Install dependencies:

```sh
npm install
```

## **Usage**

1. Start the application:

```sh
# start the chat service
node src/backend/server.js

# start the client app
cd src/client
npm run dev
```

2. Browse `http://localhost:5173/`, the default vite development server.
3. Create user
4. Create a room (or join existing ones)
5. Send messages to other participants

### **Notes**

> Every chat is available to every user, as well as entire history of it

> Sessions are kept local, so just open multiple browser tabs to and chat between them

> The chat (backend) service runs on preconfigured port 3000, change that if already taken

## **Improvements**

- Error Handling: Improve error handling on both the server and client sides.
- Model Validation: Introduce robust model validation to ensure data integrity.
- Hybrid Networking Solution: Implement a hybrid networking solution (WebSocket + HTTP) for better scalability and reliability.

## **Acknowledgements**
Vue.js
BootstrapVue
Socket.IO
Vite
