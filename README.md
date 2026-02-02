# RequirementsHub - Client Requirements Management System

A centralized web-based system to collect and manage all client requirements and project assets efficiently, enabling smoother and faster project execution.

**8th Semester Project**

## 🌐 Running URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React application with 3D UI |
| **Backend API** | http://localhost:5000 | Node.js REST API |
| **API Health Check** | http://localhost:5000/api/health | Check if backend is running |

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Three.js** (@react-three/fiber, @react-three/drei) - 3D backgrounds
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API calls
- **React Hook Form** - Form handling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Multer** - File uploads
- **Helmet** - Security

## 📁 Project Structure

```
user_requirements/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   └── package.json
├── backend/                  # Node.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   └── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
cp .env.example .env    # Configure your environment variables
npm install
npm run dev             # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start               # Starts on http://localhost:3000
```

### 3. MongoDB
Make sure MongoDB is running locally or update the `MONGODB_URI` in `backend/.env`

## 🔑 Features

- ✅ **User Authentication** - Register, Login, JWT-based auth
- ✅ **Project Management** - Create, view, update projects
- ✅ **Requirements Tracking** - Add, categorize, and track requirements
- ✅ **Asset Management** - Upload and version control project assets
- ✅ **Role-Based Access** - Admin, Manager, Client, Team Member roles
- ✅ **3D Animated UI** - Three.js background effects
- ✅ **Responsive Design** - Works on all devices

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Homepage with 3D background |
| Login | `/login` | User login |
| Register | `/register` | User registration |
| Dashboard | `/dashboard` | Overview with stats |
| Projects | `/projects` | Project list & management |
| Requirements | `/requirements` | Requirements tracking |
| Assets | `/assets` | File upload & management |
| Settings | `/settings` | User settings |

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Requirements
- `GET /api/requirements` - Get all requirements
- `POST /api/requirements` - Create requirement
- `PUT /api/requirements/:id` - Update requirement
- `POST /api/requirements/:id/comments` - Add comment

### Assets
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Upload asset
- `PUT /api/assets/:id` - Update asset (new version)
- `DELETE /api/assets/:id` - Delete asset

## 👩‍💻 Author

Aaryan - 8th Semester Project 2026