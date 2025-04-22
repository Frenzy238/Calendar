import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './ReminderModal.module.css';

// Validacija
const ReminderSchema = Yup.object().shape({
  title: Yup.string()
    .min(4, 'Title is too short')
    .max(30, 'Title is too long')
    .required('Title is required field'),
  description: Yup.string()
    .max(150, 'Description must be less than 150 characters'),
  date: Yup.date()
    .required('Date is required field'),
  time: Yup.string()
    .required('Time is required field'),
  reminderType: Yup.string().required('Type is required')
});

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

  const viewMode = !editMode && onToggleEdit;
  
  const reminderTypes = [
    { value: '', label: 'Select a type' },
    { value: 'Event', label: 'Event' },
    { value: 'Holiday', label: 'Holiday' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Birthday', label: 'Birthday' },
    { value: 'Exercise', label: 'Exercise' },
    { value: 'Other', label: 'Other' }
  ];
  
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
        {viewMode && !editMode ? (
          <div className="reminder-details">
            <div className="form-floating mb-3">
              <div className="form-control border-0 bg-light">
                {formData.title}
              </div>
              <label>
                <i className="bi bi-bookmark me-2 text-primary"></i>
                Title
              </label>
            </div>
            
            {formData.description && (
              <div className="form-floating mb-3">
                <div className="form-control border-0 bg-light text-area-floating" style={{ height: '100px' }}>
                  {formData.description}
                </div>
                <label>
                  <i className="bi bi-text-paragraph me-2 text-primary"></i>
                  Description
                </label>
              </div>
            )}
            
            <div className="form-floating mb-3">
              <div className="form-control border-0 bg-light">
                {new Date(formData.date).toLocaleDateString()}
              </div>
              <label>
                <i className="bi bi-calendar me-2 text-primary"></i>
                Date
              </label>
            </div>
            
            <div className="form-floating mb-3">
              <div className="form-control border-0 bg-light">
                {formData.time}
              </div>
              <label>
                <i className="bi bi-clock me-2 text-primary"></i>
                Time
              </label>
            </div>
            
            {formData.reminderType && (
              <div className="form-floating mb-3">
                <div className="form-control border-0 bg-light">
                  {formData.reminderType}
                </div>
                <label>
                  <i className="bi bi-tag me-2 text-primary"></i>
                  Reminder Type
                </label>
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
          <Formik
            initialValues={formData}
            validationSchema={ReminderSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
              <FormikForm onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <Field
                    type="text"
                    name="title"
                    id="title"
                    className={`form-control border-0 bg-light ${touched.title && errors.title ? 'is-invalid' : ''}`}
                    placeholder=" "
                    value={values.title}
                    onChange={(e) => {
                      handleChange(e);
                      onChange(e);
                    }}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="title">
                    <i className="bi bi-bookmark me-2 text-primary"></i>
                    Title
                  </label>
                  <ErrorMessage name="title" component="div" className="invalid-feedback" />
                </div>
                
                <div className="form-floating mb-3">
                  <Field
                    as="textarea"
                    rows={3}
                    name="description"
                    id="description"
                    className={`form-control border-0 bg-light text-area-floating ${touched.description && errors.description ? 'is-invalid' : ''}`}
                    placeholder=" "
                    value={values.description}
                    onChange={(e) => {
                      handleChange(e);
                      onChange(e);
                    }}
                    onBlur={handleBlur}
                    style={{ height: '100px' }}
                  />
                  <label htmlFor="description">
                    <i className="bi bi-text-paragraph me-2 text-primary"></i>
                    Description
                  </label>
                  <ErrorMessage name="description" component="div" className="invalid-feedback" />
                </div>
                
                <div className="form-floating mb-3">
                  <Field
                    type="date"
                    name="date"
                    id="date"
                    className={`form-control border-0 bg-light ${touched.date && errors.date ? 'is-invalid' : ''}`}
                    placeholder=" "
                    value={values.date}
                    onChange={(e) => {
                      handleChange(e);
                      onChange(e);
                    }}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="date">
                    <i className="bi bi-calendar me-2 text-primary"></i>
                    Date
                  </label>
                  <ErrorMessage name="date" component="div" className="invalid-feedback" />
                </div>
                
                <div className="form-floating mb-3">
                  <Field
                    type="time"
                    name="time"
                    id="time"
                    className={`form-control border-0 bg-light ${touched.time && errors.time ? 'is-invalid' : ''}`}
                    placeholder=" "
                    value={values.time}
                    onChange={(e) => {
                      handleChange(e);
                      onChange(e);
                    }}
                    onBlur={handleBlur}
                    step="60"
                  />
                  <label htmlFor="time">
                    <i className="bi bi-clock me-2 text-primary"></i>
                    Time 
                  </label>
                  <ErrorMessage name="time" component="div" className="invalid-feedback" />
                </div>
                
                <div className="form-floating mb-3">
                  <Field
                    as="select"
                    name="reminderType"
                    id="reminderType"
                    className={`form-control border-0 bg-light ${touched.reminderType && errors.reminderType ? 'is-invalid' : ''}`}
                    value={values.reminderType}
                    onChange={(e) => {
                      handleChange(e);
                      onChange(e);
                    }}
                    onBlur={handleBlur}
                  >
                    {reminderTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <label htmlFor="reminderType">
                    <i className="bi bi-tag me-2 text-primary"></i>
                    Reminder Type <i className="bi bi-caret-down-fill ms-1 small"></i>
                  </label>
                  <ErrorMessage name="reminderType" component="div" className="invalid-feedback" />
                </div>
                
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
              </FormikForm>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReminderModal; 