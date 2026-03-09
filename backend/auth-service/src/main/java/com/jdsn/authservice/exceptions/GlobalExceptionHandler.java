package com.jdsn.authservice.exceptions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PasswordExpiredException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordExpired(
            PasswordExpiredException ex, WebRequest request) {

        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage(), "PASSWORD_EXPIRED", request);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<Map<String, Object>> handleLocked(
            LockedException ex, WebRequest request) {

        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage(), "ACCOUNT_LOCKED", request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {

        return buildResponse(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos",
                "BAD_CREDENTIALS", request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {

        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("error", "Error de validación");
        body.put("details", errors);
        body.put("code", "VALIDATION_ERROR");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("timestamp", LocalDateTime.now());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {

        List<String> violations = ex.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("error", "Error de validación");
        body.put("details", violations);
        body.put("code", "CONSTRAINT_VIOLATION");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("timestamp", LocalDateTime.now());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(
            RuntimeException ex, WebRequest request) {

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), "GENERIC_ERROR", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(
            Exception ex, WebRequest request) {

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor",
                "INTERNAL_ERROR", request, ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status, String message, String code, WebRequest request) {
        return buildResponse(status, message, code, request, null);
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status, String message, String code, WebRequest request, String details) {

        Map<String, Object> body = new HashMap<>();
        body.put("error", message);
        body.put("code", code);
        body.put("status", status.value());
        body.put("timestamp", LocalDateTime.now());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        if (details != null) {
            body.put("details", details);
        }

        return ResponseEntity.status(status).body(body);
    }
}
