import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import EventForm from './components/EventForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/event/new" element={<EventForm />} />
            <Route path="/event/edit/:id" element={<EventForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 