import React, { useState, useEffect } from 'react';

import { Modal, Button, Form } from 'react-bootstrap';
import styles from './ReminderModal.module.css';


const ReminderModal = ({ 
  show, 
  onHide, 
  title, 
  formData, 
  onChange, 
  onSubmit, 
  editMode = false, 
  onToggleEdit = null, 
  onDelete = null 
}) => {
  // Determine if we're showing the add, edit, or view mode
  const isAddMode = !editMode && !onToggleEdit;
  const isViewMode = !editMode && onToggleEdit;
  
 

  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      className={styles["reminder-modal"]}
    >
      <div className="card-decoration-top d-flex">
        <div className="bg-primary flex-grow-1"></div>
        <div className="bg-info flex-grow-1"></div>
        <div className="bg-success flex-grow-1"></div>
        <div className="bg-warning flex-grow-1"></div>
        <div className="bg-danger flex-grow-1"></div>
      </div>

      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-primary">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pt-3">
        {isViewMode && !editMode ? (
          <div className="reminder-details">
            <h4 className="mb-3">{formData.title}</h4>
            <p className="reminder-info">
              <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
            </p>
            <p className="reminder-info">
              <strong>Time:</strong> {formData.time}
            </p>
            {formData.type && (
              <p className="reminder-info">
                <strong>Type:</strong> {formData.type}
              </p>
            )}
            {formData.description && (
              <div className="mt-3">
                <strong>Description:</strong>
                <p className="reminder-description">{formData.description}</p>
              </div>
            )}
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-primary" 
                className="me-2 btn-action" 
                onClick={onToggleEdit}
              >
                <i className="bi bi-pencil me-1"></i> Edit
              </Button>
              <Button 
                variant="danger" 
                className="btn-action" 
                onClick={onDelete}
              >
                <i className="bi bi-trash me-1"></i> Delete
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={onSubmit}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="text"
                name="title"
                id="title"
                className="form-control border-0 bg-light"
                placeholder=" "
                value={formData.title}
                onChange={onChange}
                required
              />
              <Form.Label htmlFor="title">
                <i className="bi bi-bookmark me-2 text-primary"></i>
                Title
              </Form.Label>
            </Form.Group>
            
           

            <Form.Group className="form-floating mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                id="description"
                className="form-control border-0 bg-light text-area-floating"
                placeholder=" "
                value={formData.description}
                onChange={onChange}
                style={{ height: '100px' }}
              />
              <Form.Label htmlFor="description">
                <i className="bi bi-text-paragraph me-2 text-primary"></i>
                Description
              </Form.Label>
            </Form.Group>
            
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="date"
                name="date"
                id="date"
                className="form-control border-0 bg-light"
                placeholder=" "
                value={formData.date}
                onChange={onChange}
                required
              />
              <Form.Label htmlFor="date">
                <i className="bi bi-calendar me-2 text-primary"></i>
                Date
              </Form.Label>
            </Form.Group>
            
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="time"
                name="time"
                id="time"
                className="form-control border-0 bg-light"
                placeholder=" "
                value={formData.time}
                onChange={onChange}
                required
                step="60"
              />
              <Form.Label htmlFor="time">
                <i className="bi bi-clock me-2 text-primary"></i>
                Time (24-hour format)
              </Form.Label>
            </Form.Group>
            
            {editMode && (
              <Form.Group className="form-floating mb-3">
                <Form.Select
                  name="type"
                  id="type"
                  className="form-control border-0 bg-light"
                  value={formData.type}
                  onChange={onChange}
                >
                  <option value="">Select a type</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Other">Other</option>
                </Form.Select>
                <Form.Label htmlFor="type">
                  <i className="bi bi-tag me-2 text-primary"></i>
                  Reminder Type
                </Form.Label>
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-secondary" 
                className="me-2 btn-action" 
                onClick={onHide}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                className="btn-gradient"
              >
                {editMode ? 'Update Reminder' : 'Save Reminder'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReminderModal; 