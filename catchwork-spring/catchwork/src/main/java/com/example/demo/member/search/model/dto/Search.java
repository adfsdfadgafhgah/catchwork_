package com.example.demo.member.search.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Search {

		private String query;
		private String memNo;
	    private String status;
	    private String sort;
	    private String recruitJobName;
	    private String recruitJobArea;
	    private String recruitCareer;
	    private String recruitEdu;
	    private String corpType;
	    private String recruitType;
}
