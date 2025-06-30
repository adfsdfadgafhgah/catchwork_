package com.example.demo.board.controller;

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

import com.example.demo.board.model.dto.Comment;
import com.example.demo.board.model.service.CommentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("comment")
@RequiredArgsConstructor
public class CommentController {
	
    private final CommentService commentService;

    /** 댓글 목록 조회
     * @author BAEBAE
     * @param boardNo
     * @return
     */
    @GetMapping("/list")
    public List<Comment> getCommentList(@RequestParam("boardNo") int boardNo) {
        return commentService.getCommentList(boardNo);
    }
    
    
    /** 댓글 작성
     * @author BAEBAE
     * @param comment
     * @param user
     * @return
     */
    @PostMapping("/write")
    public ResponseEntity<?> writeComment(@RequestBody Comment comment) {
        int result = commentService.writeComment(comment);

        return result > 0
            ? ResponseEntity.ok().build()
            : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 작성 실패");
    }
    
    /** 댓글 수정
     * @author BAEBAE
     * @param commentNo
     * @param body
     * @return
     */
    @PutMapping("edit/{commentNo}")
    public ResponseEntity<String> editComment(
            @PathVariable("commentNo") int commentNo,
            @RequestBody Map<String, String> body
    ) {
        String newContent = body.get("commentContent");

        if (newContent == null || newContent.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("내용이 비어있습니다.");
        }

        Comment comment = new Comment();
        comment.setCommentNo(commentNo);
        comment.setCommentContent(newContent);

        int result = commentService.editComment(comment);

        if (result > 0) {
            return ResponseEntity.ok("수정 완료");
        } else {
            return ResponseEntity.internalServerError().body("수정 실패");
        }
    }
    
    
    /** 댓글 삭제
     * @author BAEBAE
     * @param commentNo
     * @return
     */
    @DeleteMapping("delete/{commentNo}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentNo") int commentNo) {
        try {
            commentService.deleteComment(commentNo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제 실패");
        }
    }
}
