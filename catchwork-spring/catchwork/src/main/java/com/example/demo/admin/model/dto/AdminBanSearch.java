package com.example.demo.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBanSearch {

    private String banTargetType;
    private String keyword;
    private int page = 1;
    private int amount = 10;
    private int offset;

}
