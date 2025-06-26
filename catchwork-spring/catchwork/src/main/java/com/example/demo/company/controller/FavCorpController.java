package com.example.demo.company.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.company.model.dto.FavCorp;
import com.example.demo.company.model.service.FavCorpService;

@RestController
public class FavCorpController {

	 	@Autowired
	    private FavCorpService service;

	    @PostMapping("/insert")
	    public int insert(@RequestBody FavCorp fav) {
	        return service.insertFav(fav);
	    }

	    @PostMapping("/delete")
	    public int remove(@RequestBody FavCorp fav) {
	        return service.deleteFav(fav);
	    }

	    @PostMapping("/check")
	    public boolean isFav(@RequestBody FavCorp fav) {
	        return service.isFav(fav);
	    }

	    @GetMapping("/total")
	    public int total(@RequestParam int corpNo) {
	        return service.totalFav(corpNo);
	    }
}
