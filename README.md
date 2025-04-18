# Calendar Web Application

A web-based calendar application built with React, Spring Boot, and MySQL.

## Project Structure
- `frontend/` - React frontend application
- `backend/` - Spring Boot backend application

## Setup Instructions

### Prerequisites
- Node.js and npm for the frontend
- JDK 17+ and Maven for the backend
- MySQL server with phpMyAdmin

### Frontend Setup
1. Navigate to the `frontend` directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server

### Backend Setup
1. Navigate to the `backend` directory
2. Run `mvn clean install` to build the project
3. Run `mvn spring-boot:run` to start the server

### Database Setup
1. Create a MySQL database named `calendar_db`
2. The application will automatically create the required tables on startup

## Features
- User authentication
- Create, read, update, and delete calendar events
- View events by day, week, or month 