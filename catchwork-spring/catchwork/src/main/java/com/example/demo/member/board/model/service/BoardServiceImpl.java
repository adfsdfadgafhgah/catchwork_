package com.example.demo.member.board.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.member.board.model.dto.Board;
import com.example.demo.member.board.model.mapper.BoardMapper;

@Service
@Transactional(value = "myBatisTransactionManager", rollbackFor = Exception.class)
public class BoardServiceImpl implements BoardService {

	@Autowired
	private BoardMapper boardMapper;

	@Autowired
	private ImageUploadService imageUploadService;

	@Value("${file.upload.board-img-path}")
	private String uploadPath;
	
	/**
	 * 게시판 목록 조회
	 * 
	 * @author BAEBAE
	 */
	@Override
	public List<Board> selectBoardList(String sort, String query, String memNo,Integer page,Integer size, Integer limit) {
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("sort", sort);
		paramMap.put("query", query);
		paramMap.put("memNo", memNo);
		
		// [추가] limit 파라미터가 있으면 limit을, 없으면 page/size를 이용한 페이지네이션을 사용합니다.
		if (limit != null && limit > 0) {
			// 메인 페이지 등에서 사용: limit으로 상위 N개만 조회
			paramMap.put("limit", limit);
		} else {
			// 게시판 목록 페이지에서 사용: 페이지네이션
			// page나 size가 null일 경우 기본값을 설정하여 NullPointerException 방지
			int currentPage = (page == null || page < 1) ? 1 : page;
			int currentSize = (size == null || size < 1) ? 10 : size;
			int offset = (currentPage - 1) * currentSize;
			
			paramMap.put("offset", offset);
			paramMap.put("size", currentSize);
		}
		
		return boardMapper.selectBoardList(paramMap);
	}

	/**
	 * 게시글 상세
	 * 
	 * @author BAEBAE
	 */
	@Override
	@Transactional(readOnly = true)
	public Board selectBoardDetail(int boardNo, String memNo) {

		Board board = boardMapper.selectBoardDetail(boardNo);
		if (board == null)
			return null;

		// 좋아요 개수
		int likeCount = boardMapper.selectLikeCount(boardNo);
		board.setLikeCount(likeCount);

		// 댓글 개수
		int commentCount = boardMapper.selectCommentCount(boardNo);
		board.setCommentCount(commentCount);

		// 로그인 유저가 좋아요 눌렀는지 확인
		if (memNo != null && !memNo.trim().isEmpty()) {
			boolean liked = boardMapper.checkUserLiked(boardNo, memNo) > 0;
			board.setLikedByCurrentUser(liked);
		}

		return board;
	}

	/**
	 * 게시글 수정
	 * 
	 * @author BAEBAE
	 */
	@Override
	public int editBoard(Board board, MultipartFile thumbnailFile, Boolean isDelete) {

		if (thumbnailFile != null) {
			System.out.println("이미지 있음 thumbnailFile: " + thumbnailFile);
			System.out.println("board.getBoardNo(): " + board.getBoardNo());
			int result = imageUploadService.uploadBoardThumbnail(thumbnailFile, board.getBoardNo());
			if (result <= 0) { // 썸네일 이미지 업로드 실패
				throw new RuntimeException("썸네일 이미지 업로드 실패");
			}
			System.out.println("이미지 업로드 성공 result: " + result);
		}

		if (isDelete) {
			boardMapper.deleteBoardThumbnail(board.getBoardNo());
		}

		int result = boardMapper.editBoard(board);
		if (result <= 0) { // 게시글 수정 실패
			throw new RuntimeException("게시글 수정 실패");
		}
		return result;
	}

	/**
	 * 게시글 좋아요
	 * 
	 * @author BAEBAE
	 */
	@Override
	public boolean toggleLike(int boardNo, String memNo) {
		boolean alreadyLiked = boardMapper.selectBoardLike(boardNo, memNo) > 0;
		if (alreadyLiked) {
			boardMapper.deleteBoardLike(boardNo, memNo);
			return false;
		} else {
			boardMapper.insertBoardLike(boardNo, memNo);
			return true;
		}
	}

	/**
	 * 게시글 작성
	 * 
	 * @author BAEBAE
	 */
	@Override
	public int writeBoard(Board board, MultipartFile thumbnailFile) {

		int result = boardMapper.writeBoard(board);

		if (result > 0) {
			int newBoardNo = board.getBoardNo();
			if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
				result = imageUploadService.uploadBoardThumbnail(thumbnailFile, newBoardNo);	
				if (result > 0) {
					return newBoardNo;
				}
				// throw new RuntimeException("썸네일 이미지 업로드 실패");
			}
			return newBoardNo;
		}
		return result;
	}

	/**
	 * 게시글 삭제
	 * 
	 * @author BAEBAE
	 */
	@Override
	public boolean deleteBoard(int boardNo, String memNo) {

		String writerNo = boardMapper.findWriterByBoardNo(boardNo);

		if (writerNo == null || !writerNo.equals(memNo)) {
			return false; // 작성자 아니면 삭제 불가
		}
		int rows = boardMapper.deleteBoard(boardNo, memNo);
		return rows > 0;
	}

	/**
	 * 게시글 조회수 증가
	 * 
	 * @author BAEBAE
	 */
	@Override
	public void readCount(int boardNo) {
		boardMapper.readCount(boardNo);
	}

	/**
	 * 이미지 처리(스케줄러)
	 * 
	 * @author JAEHO
	 */
	@Override
	public int deleteUnusedImage() {

		// 파일시스템의 이미지 목록 조회
		File dir = new File(uploadPath);
		File[] files = dir.listFiles((d, name) -> name.endsWith(".jpg") || name.endsWith(".png"));

		if (files == null) return 0;

		List<String> fileSystemImageList = Arrays.stream(files)
			.map(File::getName)
			.collect(Collectors.toList());


		// DB에서 사용 중인 이미지 목록 조회
		List<String> usedImageList = boardMapper.selectUsedImage();

		// 비교하여 사용되지 않는 이미지 식별
		List<String> unusedImageList = new ArrayList<>();
		for (String image : fileSystemImageList) {
			if (!usedImageList.contains(image)) {
				unusedImageList.add(image);
			}
		}

		// 파일 시스템에서 해당 이미지 삭제
		int deleteCount = 0;
		for (String image : unusedImageList) {
			File file = new File(uploadPath, image);
			if (file.exists()) {
				file.delete();
				deleteCount++;
			}
		}

		return deleteCount;
	}

	/**
	 * 게시글 삭제(스케줄러)
	 * 
	 * @author JAEHO
	 */
	@Override
	public int removeTargetBoard(int deleteTargetPeriod) {
		return boardMapper.removeTargetBoard(deleteTargetPeriod);
	}
}
