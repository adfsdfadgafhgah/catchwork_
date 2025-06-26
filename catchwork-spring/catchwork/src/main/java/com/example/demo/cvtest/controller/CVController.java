package com.example.demo.cvtest.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.cvtest.model.service.CVService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("cv")
public class CVController {
	
//	@Autowired
//	private CVService service; 
	
	@PostMapping("add")
	public String CVAdd(@RequestBody Map<String, Object> payload) {
	    try {
	        System.out.println("Payload 수신됨: " + payload);
	        return "success";
	    } catch (Exception e) {
	        e.printStackTrace(); // 콘솔에 에러 전체 출력
	        return "fail";
	    }
	}
}
