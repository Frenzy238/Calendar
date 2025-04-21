import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.module.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: ''
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
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
      title: '',
      description: '',
      date: formattedDate,
      time: '',
      type: ''
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
        date: `${formData.date}T${formData.time}:00`
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
      
      
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert(`Failed to save reminder: ${error.message}`);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleMoreLinkClick = (info) => {
    return 'popover';
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    
    const eventDate = new Date(info.event.start);
    const formattedDate = eventDate.toISOString().split('T')[0];

    let formattedTime = '12:00';
    
    if (info.event.start) {
      const hours = eventDate.getHours().toString().padStart(2, '0');
      const minutes = eventDate.getMinutes().toString().padStart(2, '0');
      formattedTime = `${hours}:${minutes}`;
    }
    
    setFormData({
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      date: formattedDate,
      time: formattedTime,
      type: info.event.extendedProps.type || ''
    });
    
    setShowEventModal(true);
    setEditMode(false);
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const handleDeleteEvent = async () => {
    if (!currentUser || !selectedEvent) return;
    
    try {
      await axios.delete(`/reminders/${selectedEvent.id}`);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowEventModal(false);
      fetchReminders();
    } catch (error) {
      alert(`Failed to delete reminder: ${error.message}`);
      console.error('Error deleting reminder:', error);
    }
  };
  
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !selectedEvent) return;
    
    try {
      const reminder = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: `${formData.date}T${formData.time}:00`
      };
      
      await axios.put(`/reminders/${selectedEvent.id}`, reminder);
      
      const updatedEvents = events.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            title: formData.title,
            description: formData.description,
            start: `${formData.date}T${formData.time}:00`
          };
        }
        return event;
      });
      
      setEvents(updatedEvents);
      setShowEventModal(false);
      setEditMode(false);
      fetchReminders();
    } catch (error) {
      console.error('Error updating reminder:', error);
      alert(`Failed to update reminder: ${error.message}`);
    }
  };
  
  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setEditMode(false);
  };

  return (
    <div className="container py-5 calendar-container">
      <h2 className="text-center mb-4">Calendar Reminders</h2>
      {!currentUser && (
        <div className="alert alert-warning">
          Please log in to view and add your reminders
        </div>
      )}
      <div style={{ height: '800px'}}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          moreLinkClick={handleMoreLinkClick}
          dayMaxEventRows={3}
          dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}
          eventContent={(eventInfo) => (
            <div class="event" >
              <p>{eventInfo.timeText} {eventInfo.event.title}</p>
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
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
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
      
      <Modal show={showEventModal} onHide={handleCloseEventModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Reminder' : 'Reminder Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <Form onSubmit={handleUpdateEvent}>
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
                <Form.Label>Reminder Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Other">Other</option>
                </Form.Control>
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
                <Button variant="secondary" className="me-2" onClick={handleCloseEventModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Reminder
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <h4>{formData.title}</h4>
              <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              {formData.description && (
                <div className="mt-3">
                  <strong>Description:</strong>
                  <p>{formData.description}</p>
                </div>
              )}
              <div className="d-flex justify-content-end mt-4">
                <Button variant="outline-secondary" className="me-2" onClick={toggleEditMode}>
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDeleteEvent}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Calendar;
