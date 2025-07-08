package com.example.demo.member.board.model.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.common.util.Utility;
import com.example.demo.member.board.model.mapper.BoardMapper;

@Service
@Transactional(rollbackFor = Exception.class)
public class ImageUploadServiceImpl implements ImageUploadService {
	
	// 파일을 업로드할 디렉터리 경로
	@Value("${file.upload.board-img-path}")
	private String uploadPath;

  @Autowired
  private BoardMapper mapper;
	
	/**
	 * 이미지 업로드
	 * 
	 * @author JAEHO
	 */
	@Override
	public String uploadEditorImage(MultipartFile image) throws IOException {

		String orgFilename = image.getOriginalFilename(); // 원본 파일명
		String saveFilename = Utility.fileRename(orgFilename); // 이미지 저장명
		String fileFullPath = Paths.get(uploadPath, saveFilename).toString(); // 디스크에 저장할 파일의 전체 경로

		// uploadDir에 해당되는 디렉터리가 없으면, uploadDir에 포함되는 전체 디렉터리 생성
		File dir = new File(uploadPath);
		if (dir.exists() == false) {
			dir.mkdirs();
		}

		// 파일 저장 (write to disk)
		File uploadFile = new File(fileFullPath);
		image.transferTo(uploadFile);
		return saveFilename;
	}

	/**
	 * 에디터 이미지 출력
	 * 
	 * @author JAEHO
	 */
	@Override
	public byte[] printEditorImage(String filename) throws IOException {
		// 업로드된 파일의 전체 경로
		String fileFullPath = Paths.get(uploadPath, filename).toString();

    System.out.println("fileFullPath: " + fileFullPath);

		// 파일이 없는 경우 예외 throw
		File uploadedFile = new File(fileFullPath);
		if (uploadedFile.exists() == false) {
			throw new RuntimeException();
		}

		// 이미지 파일을 byte[]로 변환 후 반환
		byte[] imageBytes = Files.readAllBytes(uploadedFile.toPath());
		return imageBytes;
	}
	
  /** 게시글 썸네일 업로드
   * @author JAEHO
   * @param imageFile
   * @param memNo
   * @return
   */
  @Override
  public int uploadBoardThumbnail(MultipartFile imageFile, int boardNo) {
    
    String orgFilename = imageFile.getOriginalFilename(); // 원본 파일명
    String saveFilename = Utility.fileRename(orgFilename); // 이미지 저장명
    String fileFullPath = Paths.get(uploadPath, saveFilename).toString(); // 디스크에 저장할 파일의 전체 경로

    System.out.println("saveFilename: " + saveFilename);
    System.out.println("fileFullPath: " + fileFullPath);

    int result = 0;

    try {
      File dir = new File(uploadPath);
      if (dir.exists() == false) {
        dir.mkdirs();
      }

      System.out.println("fileFullPath: " + fileFullPath);

      File uploadFile = Paths.get(fileFullPath).toFile();
      imageFile.transferTo(uploadFile);

      System.out.println("uploadFile: " + uploadFile);

      Map<String, Object> map = new HashMap<>();
      map.put("thumbnailUrl", saveFilename);
      map.put("boardNo", boardNo);

      System.out.println("map: " + map);
      System.out.println("boardNo: " + boardNo);
      System.out.println("saveFilename: " + saveFilename);

      result = mapper.uploadBoardThumbnail(map);
      System.out.println("result: " + result);
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("썸네일 이미지 업로드 실패");
    }

    return result;
  }
}
