package com.calendar.app.controller;

import com.calendar.app.model.LoginRequest;
import com.calendar.app.model.LoginResponse;
import com.calendar.app.model.User;
import com.calendar.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        User authenticatedUser = userService.authenticateUser(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
        );
        
        if (authenticatedUser != null) {
            return ResponseEntity.ok(LoginResponse.success(authenticatedUser));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.failure("Invalid username or password"));
        }
    }
} 