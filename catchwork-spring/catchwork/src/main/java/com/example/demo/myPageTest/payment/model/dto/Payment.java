package com.example.demo.myPageTest.payment.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Payment {
	
    private String orderId;
    private String orderName;
    private String paymentKey;
    private String memNo;
    private long totalAmount;
    private long balanceAmount;
    private String currency;
    private String country;
    private String payType;
    private String status;
    private String requestedAt;
    private String approvedAt;
    private String updatedAt;
    private String cancels;
    private String failure;

}
