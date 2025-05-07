# 🔐 Credential Management Dashboard

A full-featured **Credential Management System** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). 
The application features **JWT-based authentication** and dynamically renders role-based dashboards for different types of users:
**Normal Users**, **Division Managers**, and **Admins**.

## 🌐 Live Demo

👉 [Credential Management App](https://credential-management-plum.vercel.app/change-user-role)

- **Frontend**: Hosted on [Vercel](https://vercel.com)
- **Backend**: Hosted on [Render](https://render.com)

---

## 🧠 Features

- 🔐 **JWT Authentication**
- 🧑‍💼 Role-Based Dashboard (`normal_user`, `division_manager`, `admin`)
- 🗂️ Credential creation, viewing, updating
- 🛠️ Admin role & user management
- 🎯 Clean, modular code and CSS separation

---

## 🧱 Tech Stack

| Layer         | Tech                      |
|---------------|---------------------------|
| Frontend      | React, React Router       |
| Backend       | Node.js, Express          |
| Database      | MongoDB (via Mongoose)    |
| Auth          | JSON Web Tokens (JWT)     |
| Hosting       | Vercel (frontend), Render (backend) |

---

## 🧭 Role-Based Views

### 🔹 Normal User
- View their assigned divisions
- View and create credentials

### 🔸 Division Manager
- All features of normal users
- Update existing credentials

### 🔺 Admin
- All features of division managers
- Manage user roles and assignments
- View and manage all divisions and organizational units (OUs)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clonehttps://github.com/ijanvdwesz/Credential-Management.git
cd your-repo-name
```

### 2. Install dependencies (Frontend)

```bash
cd frontend
npm install
```

### 3. Set environment variables

Create a `.env` file in the **frontend** folder:

```REACT_APP_API_URL=https://credential-management.onrender.com
```
### 4. Run frontend

```bash
npm start
```
## 🔄 API Endpoints (Sample)

| Method | Endpoint                     | Description                |
|--------|------------------------------|----------------------------|
| GET    | `/api/users/user-info`       | Fetch logged-in user info |
| POST   | `/api/credentials`           | Create credential          |
| PATCH  | `/api/credentials/:id`       | Update credential          |
| GET    | `/api/divisions`             | Admin fetch all divisions  |
| GET    | `/api/ous`                   | Admin fetch all OUs        |

---

## 🔒 Authentication Flow

1. On login, JWT is stored in `localStorage`.
2. All protected routes use the `Authorization: Bearer <token>` header.
3. `Dashboard` uses this token to fetch user role and render the correct component.

---

## 📦 Deployment

- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Render](https://render.com)

Ensure both frontend and backend use the same `.env` base URLs for communication.

---

## 🙋 Author

**Ijan van der Westhuizen**  
Full-Stack Developer
📫 Email: [ijanvdwestz@gmail.com](mailto:ijanvdwestz@gmail.com)
