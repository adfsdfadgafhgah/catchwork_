package com.example.demo.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBan {

    private int banNo;
    private String banContent;
    private String banTargetNo;
    private String banTargetType;
    private int adminNo;

    private String target;

}
