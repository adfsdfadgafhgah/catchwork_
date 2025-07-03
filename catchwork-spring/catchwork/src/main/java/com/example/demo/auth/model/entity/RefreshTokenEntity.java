package com.example.demo.auth.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "REFRESH_TOKEN")
public class RefreshTokenEntity {

    @Id
    @Column(name = "MEM_NO", nullable = false)
    private String memNo;

    @Lob
    @Column(name = "REFRESH_TOKEN", nullable = false)
    private String refreshToken;

    @Column(name = "EXPIRY", nullable = false)
    private LocalDateTime expiry;
    
    public RefreshTokenEntity() {
    }
    
    public RefreshTokenEntity(String memNo, String refreshToken, LocalDateTime expiry) {
        this.memNo = memNo;
        this.refreshToken = refreshToken;
        this.expiry = expiry;
    }
}