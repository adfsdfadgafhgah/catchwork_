package com.example.demo.board.model.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(rollbackFor = Exception.class)
public class ImageUploadServiceImpl implements ImageUploadService {
	
//	private final String uploadDir = "/upload/editor"; // 서버 디렉토리 (절대경로 권장)
//
//	@Override
//	public String upload(MultipartFile file) throws IOException {
//		String originalName = file.getOriginalFilename();
//        String uuid = UUID.randomUUID().toString();
//        String saveName = uuid + "_" + originalName;
//
//        Path savePath = Paths.get(uploadDir, saveName);
//        Files.createDirectories(savePath.getParent());
//        file.transferTo(savePath.toFile());
//
//        // 클라이언트에 노출할 URL 경로 반환
//        return "/static/editor/" + saveName;
//	}
	
	
	
}
