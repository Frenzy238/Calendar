import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App; 