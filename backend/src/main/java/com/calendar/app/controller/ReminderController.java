package com.calendar.app.controller;

import com.calendar.app.model.Reminder;
import com.calendar.app.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @GetMapping
    public List<Reminder> getAllReminder() {
        return reminderService.getAllReminder();
    }

    //REMINDER CRUD
    @GetMapping("{id}")
    public Reminder getReminderById(@PathVariable int id) {
        return reminderService.getReminder(id);
    }
    @PostMapping("/{id}")
    public void addReminder(@RequestBody Reminder reminder) {
        reminderService.saveReminder(reminder);
    }
    @DeleteMapping("/{id}")
    public void deleteReminder(@PathVariable int id) {
        reminderService.deleteReminder(id);
    }
    @PutMapping("/{id}")
    public void updateReminder(@RequestBody Reminder reminder, @PathVariable int id) {
        reminderService.updateReminder(reminder, id);
    }




}
