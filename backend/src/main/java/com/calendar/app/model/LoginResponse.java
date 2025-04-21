package com.calendar.app.model;

public class LoginResponse {
    private int id;
    private String username;
    private String email;
    private String message;
    private boolean success;

    public LoginResponse() {
    }

    public LoginResponse(int id, String username, String email, String message, boolean success) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.message = message;
        this.success = success;
    }

    public static LoginResponse success(User user) {
        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                "Login successful",
                true
        );
    }

    public static LoginResponse failure(String message) {
        return new LoginResponse(
                0,
                null,
                null,
                message,
                false
        );
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
} 