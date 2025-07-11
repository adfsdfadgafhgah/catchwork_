package com.example.demo.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@PropertySource("classpath:/config.properties")
public class WebClientConfig {

	@Bean
	public WebClient webClient(WebClient.Builder builder) {
	    return builder
	            .baseUrl("https://api.odcloud.kr")
	            .build();
	}

}