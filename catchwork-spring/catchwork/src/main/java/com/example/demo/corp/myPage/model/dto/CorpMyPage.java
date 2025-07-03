package com.example.demo.corp.myPage.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CorpMyPage {
	
    private String company;
    private String corpid;
    private String corpemail;
    private String corpphone;
    private String corpname;
    private String corpdepartment;
	
}
