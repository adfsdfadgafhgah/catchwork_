package com.example.demo.member.board.model.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ImageUploadService {

	/** 에디터 이미지 업로드
	 * @author JAEHO
	 * @param image
	 * @return
	 */
	String uploadEditorImage(MultipartFile image) throws IOException;

	/** 에디터 이미지 출력
	 * @author JAEHO
	 * @param filename
	 * @return
	 */
	byte[] printEditorImage(String filename) throws IOException;

	/** 게시글 썸네일 업로드
	 * @author JAEHO
	 * @param imageFile
	 * @param memNo
	 * @return
	 */
	int uploadBoardThumbnail(MultipartFile imageFile, int boardNo);
}
