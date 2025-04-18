package com.calendar.app.service;

import com.calendar.app.model.Reminder;
import com.calendar.app.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public List<Reminder> getAllReminder(){
        return reminderRepository.findAll();
    }
    public Reminder getReminder(Integer id) {
        return reminderRepository.findById(id).orElse(null);
    }
    public Reminder saveReminder(Reminder reminder){
        return reminderRepository.save(reminder);
    }
    public void deleteReminder(Integer id){
        reminderRepository.deleteById(id);
    }
    public void updateReminder(Reminder updateReminder, Integer id){
        Reminder reminder = reminderRepository.findById(id).orElse(null);
        if (reminder != null) {
            reminder.setTitle(updateReminder.getTitle());
            reminder.setDescription(updateReminder.getDescription());
            reminder.setDate(updateReminder.getDate());
            reminderRepository.save(reminder);
            return ;

        }

    }


}
