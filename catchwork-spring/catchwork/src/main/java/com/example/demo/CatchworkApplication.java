package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication 
//@SpringBootApplication(exclude={SecurityAutoConfiguration.class}) 
	public class CatchworkApplication {

	public static void main(String[] args) {
		SpringApplication.run(CatchworkApplication.class, args);
	}

}
