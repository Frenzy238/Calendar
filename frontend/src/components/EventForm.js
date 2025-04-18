import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;

  const [event, setEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    color: '#3788d8'
  });

  useEffect(() => {
    // If we're editing an existing event, fetch its data
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`/api/events/${id}`);
          const eventData = response.data;
          
          // Format the date strings to fit the datetime-local input
          const formatDateTime = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().substring(0, 16);
          };
          
          setEvent({
            ...eventData,
            startTime: formatDateTime(eventData.startTime),
            endTime: formatDateTime(eventData.endTime)
          });
        } catch (error) {
          console.error('Error fetching event:', error);
        }
      };
      
      fetchEvent();
    } else if (location.state?.start) {
      // If we're creating a new event with pre-selected dates
      setEvent({
        ...event,
        startTime: location.state.start.substring(0, 16),
        endTime: location.state.end.substring(0, 16)
      });
    }
  }, [id, isEditing, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await axios.put(`/api/events/${id}`, event);
      } else {
        await axios.post('/api/events', event);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <Container className="form-container mt-4">
      <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={event.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startTime"
                value={event.startTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endTime"
                value={event.endTime}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={event.location}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Color</Form.Label>
          <Form.Control
            type="color"
            name="color"
            value={event.color}
            onChange={handleInputChange}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            {isEditing ? 'Update' : 'Create'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
          {isEditing && (
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await axios.delete(`/api/events/${id}`);
                  navigate('/');
                } catch (error) {
                  console.error('Error deleting event:', error);
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default EventForm; 