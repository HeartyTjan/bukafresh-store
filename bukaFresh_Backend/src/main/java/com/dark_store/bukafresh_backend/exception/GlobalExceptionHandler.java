//package com.dark_store.bukafresh_backend.exception;
//
//
//
//import com.ajo.ajo_app.shared.dto.ErrorResponse;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.time.LocalDateTime;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(UserAlreadyExistsException.class)
//    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
//        ErrorResponse error = ErrorResponse.builder()
//                .status(HttpStatus.CONFLICT.value())
//                .message(ex.getMessage())
//                .timestamp(LocalDateTime.now())
//                .build();
//
//        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
//    }
//
//    @ExceptionHandler(BusinessException.class)
//    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
//        ErrorResponse error = ErrorResponse.builder()
//                .status(HttpStatus.CONFLICT.value())
//                .message(ex.getMessage())
//                .timestamp(LocalDateTime.now())
//                .build();
//
//        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
//    }
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    @ResponseStatus(HttpStatus.NOT_FOUND)
//    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
//        ErrorResponse error = ErrorResponse.builder()
//                .status(HttpStatus.NOT_FOUND.value())
//                .message(ex.getMessage())
//                .timestamp(LocalDateTime.now())
//                .build();
//
//        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
//    }
//
//    @ExceptionHandler(ResourceAlreadyExistsException.class)
//    @ResponseStatus(HttpStatus.CONFLICT)
//    public ResponseEntity<ErrorResponse> handleResourceAlreadyExistException(ResourceAlreadyExistsException ex) {
//        ErrorResponse error = ErrorResponse.builder()
//                .status(HttpStatus.CONFLICT.value())
//                .message(ex.getMessage())
//                .timestamp(LocalDateTime.now())
//                .build();
//
//        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
//    }
//
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
//        ErrorResponse error = ErrorResponse.builder()
//                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
//                .message(ex.getMessage())
//                .timestamp(LocalDateTime.now())
//                .build();
//
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
//        Map<String, String> errors = new HashMap<>();
//        ex.getBindingResult().getAllErrors().forEach(error -> {
//            String fieldName = ((FieldError) error).getField();
//            String errorMessage = error.getDefaultMessage();
//            errors.put(fieldName, errorMessage);
//        });
//
//        ErrorResponse errorResponse = ErrorResponse.builder()
//                .status(HttpStatus.BAD_REQUEST.value())
//                .message("Validation failed")
//                .details(errors)
//                .timestamp(LocalDateTime.now())
//                .build();
//
//        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
//    }
//}
