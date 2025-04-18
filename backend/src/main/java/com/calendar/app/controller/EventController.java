package com.calendar.app.controller;


import com.calendar.app.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/store-events")
    public String storeEvents() {
        eventService.getAllEventsAndStore();
        return "Prasau veik";
    }
}
