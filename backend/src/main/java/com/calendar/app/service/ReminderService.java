package com.calendar.app.service;

import com.calendar.app.Enum.ReminderType;
import com.calendar.app.model.Reminder;
import com.calendar.app.model.User;
import com.calendar.app.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Calendar;

@Service
public class ReminderService {

    private static final String API_URL = "https://date.nager.at/api/v3/PublicHolidays/2025/LT";
    ReminderType reminderType = ReminderType.Other;
    
    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private RestTemplate restTemplate;


    public List<Reminder> getAllReminder(){
        return reminderRepository.findAll();
    }
    
    public List<Reminder> getRemindersForUser(int userId) {
        return reminderRepository.findAll().stream()
                .filter(reminder -> reminder.getUser() != null && reminder.getUser().getId() == userId)
                .collect(Collectors.toList());
    }
    
    public Reminder getReminder(Integer id) {
        return reminderRepository.findById(id).orElse(null);
    }
    public Reminder saveReminder(Reminder reminder, User user){
        reminder.setUser(user);
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
            reminder.setReminderType(updateReminder.getReminderType());
            reminderRepository.save(reminder);
            return ;

        }

    }

    public void getAllRemindersAndStore(User user){

        List<Object> reminders = restTemplate.getForObject(API_URL, List.class);

        for (Object reminderObject : reminders) {

            var reminderData = (Map<String, Object>) reminderObject;
            String title = (String) reminderData.get("name");
            String dateString = (String) reminderData.get("date");

            try {
                String[] dateParts = dateString.split("-");
                int year = Integer.parseInt(dateParts[0]);
                int month = Integer.parseInt(dateParts[1]) - 1;
                int day = Integer.parseInt(dateParts[2]);
                
                Calendar cal = Calendar.getInstance();
                cal.clear(); 
                cal.set(year, month, day, 9, 0, 0);
                cal.set(Calendar.MILLISECOND, 0);
                
                Date date = cal.getTime();

                Reminder reminder = new Reminder();
                reminder.setTitle(title);
                reminder.setDate(date);
                reminder.setReminderType(ReminderType.Holiday);
                reminder.setUser(user);
                reminderRepository.save(reminder);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }

    }


}
