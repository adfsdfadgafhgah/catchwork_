package com.example.demo.myPage.payment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillingKey {
    private String billingKey;
    private String mId;
    private String billingMethod;
    private String cardCompany;
    private String cardNumber;
    private String cardType;
    private String ownerType;
    private String issuerCode;
    private String acquirerCode;
    private String authenticatedAt;
    private String memNo;
}
