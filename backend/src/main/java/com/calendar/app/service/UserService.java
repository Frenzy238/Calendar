package com.calendar.app.service;

import com.calendar.app.model.User;
import com.calendar.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    
    public User getUser(Integer id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User saveUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public void deleteUser(Integer id){
        userRepository.deleteById(id);
    }
    
    public void updateUser(User updateUser, Integer id){
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setUsername(updateUser.getUsername());

            if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateUser.getPassword()));
            }
            user.setEmail(updateUser.getEmail());
            userRepository.save(user);
        }
    }

    public User authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }
}
