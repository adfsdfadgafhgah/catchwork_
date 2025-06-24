package com.example.demo.test.user.controller;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequestMapping("/")
public class MainController {
	
	@GetMapping("/")
	public String main() {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
	    String memId = "anonymous";
	    String role = "ROLE_ANONYMOUS";
	    
	    memId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        role = auth.getAuthority();
        
		return "main "+ memId + " " + role;
	}

}
