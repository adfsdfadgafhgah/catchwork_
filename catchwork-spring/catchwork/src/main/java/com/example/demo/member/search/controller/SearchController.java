package com.example.demo.member.search.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.member.company.model.dto.CompanyInfo;
import com.example.demo.member.recruit.model.dto.MemRecruit;
import com.example.demo.member.search.model.service.SearchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("search")
@RequiredArgsConstructor
public class SearchController {

	@Autowired
    private SearchService searchService;

    /**search) recruit
     * @author JIN
     * @param 
     * @return
     */
	@GetMapping("/recruit")
	public List<MemRecruit> searchRecruit(@RequestParam Map<String, Object> params) {
	    return searchService.searchRecruit(params);
	}

    
    /** search) company
     * @author JIN
     * @param query
     * @param memNo
     * @return
     */
    @GetMapping("/company")
    public List<CompanyInfo> searchCompany(
    		  @RequestParam("query") String query, 
    		  @RequestParam(value = "memNo", required = false) String memNo
    		) {
        return searchService.searchCompany(query,memNo);
    }
}
