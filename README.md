# OralVis - Dental Scan Management Web Application

[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://oralvis-five.vercel.app)  
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://oralvis-backend-jfma.onrender.com)  
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

OralVis is a modern web application designed to streamline the management of dental scans. Technicians can upload patient scans, and dentists can securely view and download scan reports.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Default Credentials](#default-credentials-for-testing)
- [License](#license)
- [Author](#author)

---

## Features

- **Technician Role**
  - Upload dental scans (image files)
  - Enter patient details (Name, ID, Scan Type, Region)
  - Responsive and modern UI  

- **Dentist Role**
  - View uploaded scans in grid layout
  - Image thumbnails with clickable popup for full view
  - Download scan reports as PDF
  - Responsive and easy-to-read scan details

- **Authentication & Security**
  - JWT-based login and role-based access control
  - Persistent login with token storage

---

## Technology Stack

- **Frontend:** React, Vite, React Router DOM, Axios, CSS  
- **Backend:** Node.js, Express.js, SQLite, bcrypt, JWT  
- **Deployment:** Frontend on [Vercel](https://oralvis-five.vercel.app/)  
Backend on [Render](https://oralvis-backend-jfma.onrender.com/)  

---

## Screenshots

**Login Page**  
![Login Page](./screenshots/login.png)

**Technician Upload Page**  
![Technician Page](./screenshots/technician.png)

**Dentist Viewer Page**  
![Dentist Page](./screenshots/dentist.png)

---

## Live Demo

- **Frontend:** [https://oralvis-five.vercel.app/](https://oralvis-five.vercel.app/)  
- **Backend API:** [https://oralvis-backend-jfma.onrender.com/](https://oralvis-backend-jfma.onrender.com/)

---

## Project Structure


## Project Structure

oralvis/
├── frontend/ # React application
├── backend/ # Node.js + Express API
└── README.md



---

## Screenshots

**Login Page**  
![Login Page](./screenshots/login.png)

**Technician Upload Page**  
![Technician Page](./screenshots/technician.png)

**Dentist Viewer Page**  
![Dentist Page](./screenshots/dentist.png)

---

## Live Demo

Check out the live deployed frontend here: [https://oralvis-five.vercel.app](https://oralvis-five.vercel.app)  
Backend API hosted at: [https://oralvis-backend-jfma.onrender.com](https://oralvis-backend-jfma.onrender.com)

---

## Running Locally

Follow these steps to run the project on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/raveenkarri/oralvis.git
cd oralvis

Backend Setup
cd backend
npm install

Configure Environment Variables

Create a .env file in the backend folder with the following template:

PORT=4000
JWT_SECRET=your_jwt_secret
DATABASE_URL=./database.db

Start the Backend Server
npm start

Frontend Setup
cd ../frontend
npm install

Configure Environment Variables (Optional)

If you want to use a .env file:

VITE_API_URL=http://localhost:4000

Start the Frontend Server
npm run dev
Default Credentials for Testing

You can use the following default accounts to test the application:

Role	         Email	                 Password
Technician	   technician@test.com     test1234
Dentist	       dentist@test.com         test1234

Note: You can register new users from the registration page as well.

Features

  Technician:
    Upload dental scans (image files)
    Enter patient details (Name, ID, Scan Type, Region)

  Dentist:

    View uploaded scans
    Download scan reports as PDF
    View image thumbnails and enlarge on click
    Sort and filter scans (if implemented)

Authentication:
    Secure login and role-based access
    JWT-based authorization for API requests
