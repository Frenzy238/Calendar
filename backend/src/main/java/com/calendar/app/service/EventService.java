package com.calendar.app.service;

import com.calendar.app.model.Event;
import com.calendar.app.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private static final String API_URL = "https://date.nager.at/api/v3/PublicHolidays/2025/LT";

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestTemplate restTemplate;

    public void getAllEventsAndStore(){

        List<Object> events = restTemplate.getForObject(API_URL, List.class);

        for (Object eventObject : events) {

            var eventData = (Map<String, Object>) eventObject;
            String name = (String) eventData.get("name");
            String dateString = (String) eventData.get("date");

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            try{
                Date date = dateFormat.parse(dateString);

                Event event = new Event();
                event.setName(name);
                event.setDate(date);

                eventRepository.save(event);

            }catch (Exception e){
                e.printStackTrace();
            }

        }

    }
    public Event getEvent(Integer id) {
        return eventRepository.findById(id).orElse(null);
    }

    public void deleteEvent(Integer id){
        eventRepository.deleteById(id);
    }
    public void updateEvent(Event updateEvent, Integer id){
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            event.setName(updateEvent.getName());
            event.setDate(updateEvent.getDate());
            eventRepository.save(event);
            return ;

        }

    }


}
