import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.module.css';
import ReminderModal from '../../components/Reminder/ReminderModal';

const Calendar = () => {
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
  
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);
  
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
          backgroundColor: '#6a11cb',
          borderColor: '#2575fc'
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
          backgroundColor: '#6a11cb',
          borderColor: '#2575fc'
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

  const backgroundStyle = {
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  };

  return (
    <div style={backgroundStyle} className="d-flex justify-content-center align-items-center">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              
              <div className="card-decoration-top d-flex">
                <div className="bg-primary flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-info flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-success flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-warning flex-grow-1" style={{height: '8px'}}></div>
                <div className="bg-danger flex-grow-1" style={{height: '8px'}}></div>
              </div>
              
              <div className="card-header border-0 bg-transparent text-center pt-4 pb-0">
                <div className="mb-3 d-inline-block p-3 rounded-circle" style={{background: 'linear-gradient(45deg, #6a11cb, #2575fc)'}}>
                  <i className="bi bi-calendar-event text-white" style={{fontSize: '2rem'}}></i>
                </div>
                <h1 className="fw-bold display-6 mb-2 text-primary">Calendar Reminders</h1>
                {!currentUser && (
                  <div className="alert alert-warning mx-4 mb-3">
                    Please log in to view and add your reminders
                  </div>
                )}
              </div>
              
              <div className="card-body px-4 pt-0 pb-4">
                <div style={{ height: '700px'}} className="mt-3">
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
                      <div className="event" style={{
                        background: 'linear-gradient(45deg, #6a11cb, #2575fc)', 
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontSize: '0.85em',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <p className="mb-0">{eventInfo.timeText} {eventInfo.event.title}</p>
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
                    validRange={{
                      start: today.toISOString().split('T')[0],
                      end: nextYear.toISOString().split('T')[0]
                    }}
                    dateIncrement={{ months: 1 }}
                    navLinks={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ReminderModal 
        show={showModal}
        onHide={handleCloseModal}
        title={`Add Reminder for ${selectedDate}`}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      
      <ReminderModal 
        show={showEventModal}
        onHide={handleCloseEventModal}
        title={editMode ? 'Edit Reminder' : 'Reminder Details'}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleUpdateEvent}
        editMode={editMode}
        onToggleEdit={toggleEditMode}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default Calendar;
