import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUser(user);
    }
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      fetchReminders();
    }
  }, [currentUser]);
  
  const fetchReminders = async () => {
    try {
        const response = await axios.get(`/reminders/user/${currentUser.id}`);

      const formattedEvents = response.data.map(reminder => {
        let start = reminder.date;

        return {
          id: reminder.id,
          title: reminder.title,
          start: start,
          description: reminder.description || '',
          backgroundColor: 'blue',
          borderColor: '#3788d8'
        };
      });
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const formattedDate = clickedDate.toISOString().split('T')[0];
    
    setSelectedDate(formattedDate);
    setFormData({
      ...formData,
      date: formattedDate,
      time: '12:00'
    });
    setShowModal(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be logged in to add reminders');
      return;
    }
    
    try {
      
      const reminder = {
        title: formData.title,
        description: formData.description,
        date: formData.date
      };
      
      const response = await axios.post(`/reminders/add?user=${currentUser.id}`, reminder);
      
      setEvents([
        ...events,
        {
          id: response.data?.id,
          title: formData.title,
          start: `${formData.date}T${formData.time}:00`,
          description: formData.description,
          backgroundColor: '#3788d8',
          borderColor: '#3788d8'
        }
      ]);
      
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: ''
      });
      
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert(`Failed to save reminder: ${error.message}`);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Calendar Reminders</h2>
      {!currentUser && (
        <div className="alert alert-warning">
          Please log in to view and add your reminders
        </div>
      )}
      <div style={{ height: '800px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={events}
          eventContent={(eventInfo) => (
            <div>
              <b>{eventInfo.timeText}</b>
              <p>{eventInfo.event.title}</p>
            </div>
          )}
          headerToolbar={{
            center: 'prev,next',
            left: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="100%"
          firstDay={1}
          weekNumbers={true}
          weekNumberCalculation="ISO"
          weekText="Week "
          weekNumberFormat={{ week: 'numeric' }}
          locale="en-GB"
          timeZone="Europe/London"
        />
      </div>
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Reminder for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
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
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Reminder
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Calendar;
