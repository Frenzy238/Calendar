package com.calendar.app.controller;

import com.calendar.app.model.User;
import com.calendar.app.service.ReminderService;
import com.calendar.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getUser(id);
    }

    @PostMapping("add")
    public User addUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        reminderService.getAllRemindersAndStore(user);
        return savedUser;
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public void updateUser(@RequestBody User user, @PathVariable Integer id) {
        userService.updateUser(user, id);
    }
}