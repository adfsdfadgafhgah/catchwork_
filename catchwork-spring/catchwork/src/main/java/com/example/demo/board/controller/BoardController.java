package com.example.demo.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.board.model.dto.Board;
import com.example.demo.board.model.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    /**
     * 게시글 목록 조회 (정렬 + 검색)
     * @param sort 정렬 기준 (latest, oldest, likes, comments)
     * @param query 검색어 (없을 경우 공백)
     */
    @GetMapping("boardList")
    public ResponseEntity<?> getBoardList(
            @RequestParam(name = "sort") String sort,
            @RequestParam(name = "query", required = false, defaultValue = "") String query) {
    	System.out.println();
        try {
            List<Board> boards = boardService.selectBoardList(sort, query.trim());
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
    public ResponseEntity<?> getBoardDetail(@PathVariable("boardNo") int boardNo,
    										@RequestParam(name = "memNo", required = false) String memNo) {
    	
    	
    	
    	try {
            Board board = boardService.selectBoardDetail(boardNo, memNo);
            System.out.println("작성자 memNo = " + board.getMember().getMemNo()); // ← null이 아니어야 함
            return ResponseEntity.ok(board);
        } catch (Exception e) {
        	System.out.println("🔥 게시글 상세 오류 발생!");
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
    @PutMapping("/edit/{boardNo}")
    public ResponseEntity<?> editBoard(@PathVariable int boardNo,
    								   @RequestBody Board board) {
        try {
            board.setBoardNo(boardNo);
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
}
	
