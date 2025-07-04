package com.example.demo.member.board.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.member.board.model.dto.Board;
import com.example.demo.member.board.model.service.BoardService;
import com.example.demo.member.board.model.service.ImageUploadService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final ImageUploadService imageUploadService;

    /**
     * 게시글 목록 조회 (정렬 + 검색)
     * @param sort 정렬 기준 (latest, oldest, likes, comments)
     * @param query 검색어 (없을 경우 공백)
     */
    @GetMapping("boardList")
    public ResponseEntity<?> selectBoardList(
            @RequestParam(name = "sort") String sort,
            @RequestParam(name = "query", required = false, defaultValue = "") String query,
            @RequestParam(name = "memNo", required = false) String memNo) {
    	System.out.println();
        try {
            List<Board> boards = boardService.selectBoardList(sort, query.trim(), memNo);
            return ResponseEntity.ok(boards);
        } catch (Exception e) {
            e.printStackTrace(); // 이게 콘솔에 뭐라고 찍히는지 확인해줘!
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 목록 조회 중 오류 발생");
        }
    }
    
    /** 게시글 상세
     * @author BAEBAE
     * @param boardNo
     * @param memNo
     * @return
     */
    @GetMapping("detail/{boardNo}")
    public ResponseEntity<?> selectBoardDetail(@PathVariable("boardNo") int boardNo,
    										@RequestParam(name = "memNo", required = false) String memNo) {
    	
    	
    	
    	try {
            Board board = boardService.selectBoardDetail(boardNo, memNo);
            
            
           
            return ResponseEntity.ok(board);
        } catch (Exception e) {
        	
            e.printStackTrace(); // 콘솔에 에러를 반드시 찍게
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 상세 조회 실패");
        }
    }
    
    /** 게시글 수정
     * @author BAEBAE
     * @param boardNo
     * @param board
     * @return
     */
    @PutMapping("edit/{boardNo}")
    public ResponseEntity<?> editBoard(@PathVariable("boardNo")int boardNo,
    								   @RequestBody Board board) {
        try {
            board.setBoardNo(boardNo); // 경로 변수로 넘어온 boardNo를 DTO에 주입
            int result = boardService.editBoard(board);
            if (result > 0) {
                return ResponseEntity.ok().body("게시글이 수정되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시글 수정 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
    
    /** 게시글 좋아요
     * @author BAEBAE
     * @param data
     * @return
     */
    @PostMapping("like")
    public ResponseEntity<Map<String, Object>> toggleLike(@RequestBody Map<String, Object> data) {
    	
    	int boardNo = Integer.parseInt(data.get("boardNo").toString());
    	String memNo = data.get("memNo").toString();
    	
    	boolean liked = boardService.toggleLike(boardNo, memNo);
    	
    	Map<String, Object> result = new HashMap<>();
    	result.put("result", liked ? "liked" : "unliked");
    	return ResponseEntity.ok(result);
		
	}
    
    /** 게시글 작성
     * @author BAEBAE
     * @param board
     * @return
     */
    @PostMapping("write")
    public ResponseEntity<?> writeBoard(@RequestBody Board board) {
        try {
            int result = boardService.writeBoard(board);
            if (result > 0) {
                return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "boardNo", board.getBoardNo()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("등록 실패");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }
    
    /** 게시글 삭제
     * @author BAEBAE
     * @param boardNo
     * @param request
     * @return
     */
    @DeleteMapping("delete/{boardNo}")
    public ResponseEntity<?> deleteBoard(@PathVariable("boardNo")int boardNo, @RequestBody Map<String, Object> request) {
    	
    	String memNo = (String) request.get("memNo");
    	boolean result = boardService.deleteBoard(boardNo, memNo);
    	return ResponseEntity.ok().body(Collections.singletonMap("success", result));
    }
    
    /** 게시글 조회수 증가
     * @author BAEBAE
     * @param boardNo
     * @return
     */
    @GetMapping("readCount/{boardNo}")
    public ResponseEntity<?> readCount(@PathVariable("boardNo") int boardNo) {
        try {
            boardService.readCount(boardNo);
            return ResponseEntity.ok().body("조회수 증가 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회수 증가 실패");
        }
    }
    
    
//    /** 게시글 이미지 업로드
//     * @author BAEBAE
//     * @param imageFile
//     * @return
//     */
//    @PostMapping("image")
//    public ResponseEntity<?> uploadBoardImage(@RequestParam("image") MultipartFile imageFile) {
//    	try {
//    		String url = imageUploadService.upload(imageFile);
//    		return ResponseEntity.ok(Map.of("url", url));
//    	} catch (Exception e) {
//    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 업로드 실패");
//    	}
//    }
}
	
