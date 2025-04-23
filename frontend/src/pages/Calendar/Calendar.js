import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Calendar.module.css';
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
    reminderType: ''
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
      const credentials = btoa("admin:admin");
      const response = await fetch(`http://localhost:8080/reminders/user/${currentUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      let data = [];
      
      if (contentType && contentType.includes("application/json") && response.headers.get('content-length') !== '0') {
        data = await response.json();
      }

      const formattedEvents = data.map(reminder => {
        let start = reminder.date;

        return {
          id: reminder.id,
          title: reminder.title,
          start: start,
          description: reminder.description || '',
          reminderType: reminder.reminderType || '',
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
      reminderType: ''
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
  
  const handleSubmit = async (values) => {

    if (values && values.preventDefault) {
      values.preventDefault();
      values = formData;
    }
    
    if (!currentUser) {
      alert('You must be logged in to add reminders');
      return;
    }
    
    try {
      
      const reminder = {
        title: values.title,
        description: values.description,
        reminderType: values.reminderType,
        date: `${values.date}T${values.time}:00`
      };
      console.log(reminder);
      
      const credentials = btoa("admin:admin");
      const response = await fetch(`http://localhost:8080/reminders/add?user=${currentUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify(reminder)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      let responseData = {};
      
      if (contentType && contentType.includes("application/json") && response.headers.get('content-length') !== '0') {
        responseData = await response.json();
      } else {
        responseData = { id: Date.now() };
      }
      
      setEvents([
        ...events,
        {
          id: responseData?.id,
          title: values.title,
          start: `${values.date}T${values.time}:00`,
          description: values.description,
          reminderType: values.reminderType || '',
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

  const handleReminderClick = (info) => {
    setSelectedEvent(info.event);
    
    const eventDate = new Date(info.event.start);
    const formattedDate = eventDate.toISOString().split('T')[0];
    const timeString = info.event.start.toISOString().split('T')[1].substring(0, 5);
    
    setFormData({
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      date: formattedDate,
      time: timeString,
      reminderType: info.event.extendedProps.reminderType || ''
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
      const credentials = btoa("admin:admin");
      const response = await fetch(`http://localhost:8080/reminders/${selectedEvent.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowEventModal(false);
      fetchReminders();
    } catch (error) {
      alert(`Failed to delete reminder: ${error.message}`);
      console.error('Error deleting reminder:', error);
    }
  };
  
  const handleUpdateEvent = async (values) => {

    if (values && values.preventDefault) {
      values.preventDefault();
      values = formData;
    }
    
    if (!currentUser || !selectedEvent) return;
    
    try {
      const reminder = {
        title: values.title,
        description: values.description,
        reminderType: values.reminderType,
        date: `${values.date}T${values.time}:00`
      };
      console.log(reminder);
      
      const credentials = btoa("admin:admin");
      const response = await fetch(`http://localhost:8080/reminders/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify(reminder)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedEvents = events.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            title: values.title,
            description: values.description,
            reminderType: values.reminderType,
            start: `${values.date}T${values.time}:00`
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
    <div className={`${styles.calendarBackground} d-flex justify-content-center align-items-center`}>
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
                    eventClick={handleReminderClick}
                    events={events}
                    moreLinkClick={handleMoreLinkClick}
                    dayMaxEventRows={3}
                    dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}
                    eventContent={(eventInfo) => (
                      <div className={styles.eventStyle}>
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
