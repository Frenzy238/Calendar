package com.calendar.app.model;

import com.calendar.app.Enum.ReminderType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Reminder{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String description;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date date;

    @Enumerated(EnumType.STRING)
    private ReminderType reminderType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Reminder() {

    }

    public ReminderType getReminderType() {
        return reminderType;
    }

    public void setReminderType(ReminderType reminderType) {
        this.reminderType = reminderType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}