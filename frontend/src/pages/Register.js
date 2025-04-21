import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setIsError(true);
      return;
    }
    
    try {
        const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email
      };
      console.log(userData);
      
      const credentials = btoa("admin:admin");
      
      fetch("http://localhost:8080/users/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Basic ${credentials}`
            },
            body: JSON.stringify(userData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("registered successfully:", data);
        setMessage("Registration successful!");
        setIsError(false);
      })
      .catch(error => {
        console.error("Registration error:", error);
        setMessage("Registration failed: " + error.message);
        setIsError(true);
      });

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed: ' + (error.response?.data?.message || error.message));
      setIsError(true);
    }
  };

  const bgStyle = {
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    minHeight: '100vh',
  };
  
  return (
    <div style={bgStyle} className="d-flex justify-content-center align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

              <div className="card-decoration-top d-flex">
                <div className="bg-primary flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-info flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-success flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-warning flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-danger flex-grow-1" style={{height: '8px'}}></div>
              </div>
              
              <div className="card-header border-0 bg-transparent text-center pt-5 pb-4">
                <div className="mb-4 d-inline-block p-3 rounded-circle" style={{background: 'linear-gradient(45deg, #6a11cb, #2575fc)'}}>
                  <i className="bi bi-calendar-check text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h1 className="fw-bold display-6 mb-2 text-primary">Join Our Calendar</h1>
                <p className="text-muted">Create your account in just a few steps</p>
              </div>
              
              <div className="card-body px-4 px-lg-5 pt-0 pb-5">
                {message && (
                  <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} d-flex align-items-center border-0 shadow-sm`} 
                       style={{borderLeft: isError ? '5px solid #dc3545' : '5px solid #198754'}} role="alert">
                    <div className="me-3">
                      <i className={`bi ${isError ? 'bi-exclamation-diamond-fill' : 'bi-check-circle-fill'} fs-4 ${isError ? 'text-danger' : 'text-success'}`}></i>
                    </div>
                    <div>{message}</div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control border-0 bg-light"
                      id="username"
                      name="username"
                      placeholder=" "
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="username">
                      <i className="bi bi-person me-2 text-primary"></i>Username
                    </label>
                  </div>
                  
                  <div className="form-floating mb-4">
                    <input
                      type="email"
                      className="form-control border-0 bg-light"
                      id="email"
                      name="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="email">
                      <i className="bi bi-envelope me-2 text-primary"></i>Email Address
                    </label>
                  </div>
                  
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control border-0 bg-light"
                      id="password"
                      name="password"
                      placeholder=" "
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="password">
                      <i className="bi bi-lock me-2 text-primary"></i>Password
                    </label>
                  </div>
                  
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control border-0 bg-light"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder=" "
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="confirmPassword">
                      <i className="bi bi-shield-lock me-2 text-primary"></i>Confirm Password
                    </label>
                  </div>
                  
                  <div className="d-grid mb-4">
                    <button type="submit" className="btn py-3 fw-bold text-white text-uppercase rounded-pill" 
                            style={{background: 'linear-gradient(45deg, #6a11cb, #2575fc)', boxShadow: '0 4px 15px rgba(106, 17, 203, 0.4)'}}>
                      Create Your Account
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <div className="position-relative my-4">
                    <hr className="text-muted" />
                    <span className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">or</span>
                  </div>
                  
                  <p className="text-muted mb-0">
                    Already have an account? <Link to="/login" className="text-decoration-none fw-bold" style={{color: '#6a11cb'}}>Sign In</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 