import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const formattedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          color: event.color || '#3788d8',
          extendedProps: {
            description: event.description,
            location: event.location
          }
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    navigate(`/event/edit/${eventId}`);
  };

  const handleDateSelect = (selectInfo) => {
    navigate('/event/new', {
      state: {
        start: selectInfo.startStr,
        end: selectInfo.endStr
      }
    });
  };

  return (
    <Container className="calendar-container mt-4">
      <h2 className="mb-4">My Calendar</h2>
      <Button 
        variant="primary" 
        className="mb-3"
        onClick={() => navigate('/event/new')}
      >
        Create New Event
      </Button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        height="auto"
      />
    </Container>
  );
};

export default Calendar; 