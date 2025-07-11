package com.example.demo.admin.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/main")
    public String adminMain() {
        return "Welcome Admin!";
    }
}
