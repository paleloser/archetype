package com.acme.server.api.v1.configuration;

import com.acme.server.api.v1.model.ConstraintsViolationDTO;
import com.acme.server.api.v1.model.ConstraintsViolationsErrorDTO;
import com.acme.server.api.v1.model.ErrorDTO;
import com.acme.server.domain.model.exception.ForbiddenException;
import com.acme.server.domain.model.exception.NotFoundException;
import com.acme.server.domain.model.exception.UnauthorizedException;
import com.acme.server.domain.model.exception.UnsupportedException;
import jakarta.annotation.Nullable;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Global error handling. Every error leaves the API as an RFC 9457 problem (<code>application/problem+json</code>), built from the
 * <code>Error</code> schemas in <code>v1.yml</code>. Domain exceptions are mapped here by their base class, so the domain never knows
 * about HTTP.
 */
@RestControllerAdvice(basePackages = "com.acme.server.api")
@Slf4j
public class ErrorHandler extends ResponseEntityExceptionHandler {

  private static final String BASE_TYPE = "https://api.acme.example/errors/";

  private static final URI BAD_REQUEST_TYPE = URI.create(BASE_TYPE + "BAD_REQUEST");

  private static final String BAD_REQUEST_TITLE = "Bad Request";

  private static final URI FORBIDDEN_TYPE = URI.create(BASE_TYPE + "FORBIDDEN");

  private static final String FORBIDDEN_TITLE = "Forbidden";

  private static final URI NOT_FOUND_TYPE = URI.create(BASE_TYPE + "NOT_FOUND");

  private static final String NOT_FOUND_TITLE = "Not Found";

  private static final URI UNAUTHORIZED_TYPE = URI.create(BASE_TYPE + "UNAUTHORIZED");

  private static final String UNAUTHORIZED_TITLE = "Unauthorized";

  private static final URI CONFLICT_TYPE = URI.create(BASE_TYPE + "CONFLICT");

  private static final String CONFLICT_TITLE = "Conflict";

  private static final URI INTERNAL_SERVER_ERROR_TYPE = URI.create(BASE_TYPE + "INTERNAL_SERVER_ERROR");

  private static final String INTERNAL_SERVER_ERROR_TITLE = "Internal Server Error";

  private static final URI ARGUMENT_NOT_VALID_TYPE = URI.create(BASE_TYPE + "ARGUMENT_NOT_VALID");

  private static final String ARGUMENT_NOT_VALID_TITLE = "Validation error";

  private static final String ARGUMENT_NOT_VALID_DETAIL = "Some fields of the request are not valid.";

  private static final String NOT_FOUND_DETAIL_PATTERN = "The requested path \"%s\" cannot be found on the server.";

  private static final String EXCEPTION_WORD = "Exception";

  private static final String CAMEL_CASE_SEPARATOR = "(?=[A-Z])";

  /**
   * Handles a {@link UnsupportedException} exception.
   */
  @ExceptionHandler(UnsupportedException.class)
  public final ResponseEntity<Object> handleGenericNotSupportedException(final UnsupportedException e) {
    final HttpHeaders headers = new HttpHeaders();
    setHeaderProblemContentType(headers);

    final ConstraintsViolationDTO violation = new ConstraintsViolationDTO(e.getField(), e.getMessage());

    final ConstraintsViolationsErrorDTO error = new ConstraintsViolationsErrorDTO(
        ARGUMENT_NOT_VALID_TYPE,
        ARGUMENT_NOT_VALID_TITLE,
        List.of(violation));
    error.setStatus(HttpStatus.BAD_REQUEST.value());
    error.setDetail(ARGUMENT_NOT_VALID_DETAIL);

    return new ResponseEntity<>(error, headers, HttpStatus.BAD_REQUEST.value());
  }

  /**
   * Handles a {@link NotFoundException} exception.
   */
  @ExceptionHandler(NotFoundException.class)
  public final ResponseEntity<Object> handleNotFoundException(final NotFoundException e) {
    final HttpHeaders headers = new HttpHeaders();
    setHeaderProblemContentType(headers);

    final ErrorDTO error = new ErrorDTO(NOT_FOUND_TYPE, NOT_FOUND_TITLE);
    error.setStatus(HttpStatus.NOT_FOUND.value());
    error.setDetail(e.getMessage());

    return new ResponseEntity<>(error, headers, HttpStatus.NOT_FOUND.value());
  }

  /**
   * Handles a {@link UnauthorizedException} exception.
   */
  @ExceptionHandler(UnauthorizedException.class)
  public final ResponseEntity<Object> handleUnauthorizedException(final UnauthorizedException e) {
    final HttpHeaders headers = new HttpHeaders();
    setHeaderProblemContentType(headers);

    final ErrorDTO error = new ErrorDTO(UNAUTHORIZED_TYPE, UNAUTHORIZED_TITLE);
    error.setStatus(HttpStatus.UNAUTHORIZED.value());
    error.setDetail(e.getMessage());

    return new ResponseEntity<>(error, headers, HttpStatus.UNAUTHORIZED.value());
  }

  /**
   * Handles a {@link ForbiddenException} exception.
   */
  @ExceptionHandler(ForbiddenException.class)
  public final ResponseEntity<Object> handleForbiddenException(final ForbiddenException e) {
    final HttpHeaders headers = new HttpHeaders();
    setHeaderProblemContentType(headers);

    final ErrorDTO error = new ErrorDTO(FORBIDDEN_TYPE, FORBIDDEN_TITLE);
    error.setStatus(HttpStatus.FORBIDDEN.value());
    error.setDetail(e.getMessage());

    return new ResponseEntity<>(error, headers, HttpStatus.FORBIDDEN.value());
  }

  /**
   * Generic handler for {@link ResponseStatusException}.
   */
  @ExceptionHandler(ResponseStatusException.class)
  public final ResponseEntity<Object> handleResponseStatusException(final ResponseStatusException e) {
    final ErrorDTO error = getErrorFromResponseStatusException(e);

    final HttpHeaders headers = new HttpHeaders();
    setHeaderProblemContentType(headers);

    return new ResponseEntity<>(error, headers, e.getStatusCode().value());
  }

  @Override
  protected ResponseEntity<Object> handleMaxUploadSizeExceededException(final MaxUploadSizeExceededException ex, final HttpHeaders headers,
      final HttpStatusCode status, final WebRequest request) {
    final ErrorDTO error = new ErrorDTO(BAD_REQUEST_TYPE, BAD_REQUEST_TITLE);
    error.setStatus(HttpStatus.BAD_REQUEST.value());

    if (ex.getMostSpecificCause() instanceof FileSizeLimitExceededException fileSizeLimitExceededException) {
      error.setDetail(fileSizeLimitExceededException.getMessage());
    }

    setHeaderProblemContentType(headers);

    return new ResponseEntity<>(error, headers, HttpStatus.BAD_REQUEST.value());
  }

  /**
   * Handles a {@link MethodArgumentTypeMismatchException}.
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public final ResponseEntity<Object> handleMethodArgumentTypeMismatchException(final MethodArgumentTypeMismatchException ex) {
    final HttpHeaders headers = new HttpHeaders();
    setHeaderProblemContentType(headers);

    final Class<?> requiredType = ex.getRequiredType();
    String violationMessage = "Value %s does not match expected type".formatted(ex.getValue());

    if (requiredType != null) {
      if (Enum.class.isAssignableFrom(requiredType)) {
        violationMessage = "%s is not a valid enum value %s".formatted(ex.getValue(), Arrays.toString(requiredType.getEnumConstants()));
      } else {
        violationMessage = "Value %s does not match expected type %s".formatted(ex.getValue(), requiredType.getSimpleName());
      }
    }

    final ConstraintsViolationDTO violation = new ConstraintsViolationDTO(ex.getName(), violationMessage);

    final ConstraintsViolationsErrorDTO error = new ConstraintsViolationsErrorDTO(
        ARGUMENT_NOT_VALID_TYPE,
        ARGUMENT_NOT_VALID_TITLE,
        List.of(violation));
    error.setStatus(HttpStatus.BAD_REQUEST.value());
    error.setDetail(ARGUMENT_NOT_VALID_DETAIL);

    return new ResponseEntity<>(error, headers, HttpStatus.BAD_REQUEST.value());
  }

  /**
   * Generic exception handler for {@link Exception} types.
   */
  @ExceptionHandler(Exception.class)
  public final ResponseEntity<Object> handleOtherExceptions(final Exception e, final WebRequest request) {
    log.error("Unexpected exception! [path={}]", request.getContextPath(), e);
    return handleExceptionInternal(
        new HttpHeaders(),
        INTERNAL_SERVER_ERROR_TYPE,
        INTERNAL_SERVER_ERROR_TITLE,
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        null);
  }

  @Override
  protected ResponseEntity<Object> handleMissingServletRequestParameter(final MissingServletRequestParameterException ex,
      final HttpHeaders headers, final HttpStatusCode status, final WebRequest request) {
    return this.handleExceptionInternal(
        headers,
        BAD_REQUEST_TYPE,
        BAD_REQUEST_TITLE,
        HttpStatus.BAD_REQUEST.value(),
        ex.getMessage()
    );
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex, final HttpHeaders headers,
      final HttpStatusCode status, WebRequest request) {
    final List<ConstraintsViolationDTO> violations = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(x -> new ConstraintsViolationDTO(x.getField(), x.getDefaultMessage()))
        .toList();

    final ConstraintsViolationsErrorDTO error = new ConstraintsViolationsErrorDTO(
        ARGUMENT_NOT_VALID_TYPE,
        ARGUMENT_NOT_VALID_TITLE,
        violations);
    error.setStatus(status.value());
    error.setDetail(ARGUMENT_NOT_VALID_DETAIL);

    final HttpHeaders problemHeaders = new HttpHeaders(headers);
    setHeaderProblemContentType(problemHeaders);

    return new ResponseEntity<>(error, problemHeaders, status);
  }

  @Override
  protected final ResponseEntity<Object> handleNoHandlerFoundException(final NoHandlerFoundException ex, final HttpHeaders headers,
      final HttpStatusCode status, final WebRequest request) {
    return this.handleExceptionInternal(
        headers,
        NOT_FOUND_TYPE,
        NOT_FOUND_TITLE,
        HttpStatus.NOT_FOUND.value(),
        NOT_FOUND_DETAIL_PATTERN.formatted(ex.getRequestURL())
    );
  }

  @Override
  protected ResponseEntity<Object> handleExceptionInternal(final Exception ex, final @Nullable Object body, final HttpHeaders headers,
      final HttpStatusCode statusCode, final WebRequest request) {
    final String errorName = getErrorNameFromExceptionClass(ex.getClass().getSimpleName());
    final URI type = URI.create(BASE_TYPE + camelCaseToUpperUnderscore(errorName));
    final String title = camelCaseToTitleCase(errorName);

    return this.handleExceptionInternal(headers, type, title, statusCode.value(), ex.getMessage());
  }

  private ResponseEntity<Object> handleExceptionInternal(final HttpHeaders headers, final URI type, final String title,
      final Integer status, @Nullable final String detail) {
    final ErrorDTO error = new ErrorDTO(type, title);
    error.setStatus(status);
    error.setDetail(detail);

    setHeaderProblemContentType(headers);

    return new ResponseEntity<>(error, headers, status);
  }

  private void setHeaderProblemContentType(final HttpHeaders headers) {
    headers.setContentType(MediaType.APPLICATION_PROBLEM_JSON);
  }

  private String getErrorNameFromExceptionClass(final String exceptionClass) {
    return exceptionClass.endsWith(EXCEPTION_WORD) ? exceptionClass.substring(0, exceptionClass.length() - EXCEPTION_WORD.length())
        : exceptionClass;
  }

  /**
   * Transforms a camel case string to upper underscore string. From helloWorld to HELLO_WORLD.
   */
  private String camelCaseToUpperUnderscore(final String text) {
    final StringBuilder result = new StringBuilder();
    if (text != null && !text.isEmpty()) {
      result.append(text.substring(0, 1).toUpperCase());
      for (int i = 1; i < text.length(); i++) {
        final String s = text.substring(i, i + 1);
        if (s.equals(s.toUpperCase()) && !Character.isDigit(s.charAt(0))) {
          result.append("_");
        }
        result.append(s.toUpperCase());
      }
    }
    return result.toString();
  }

  /**
   * Converts a camel case string to normal text. From 'helloWorld' to 'hello World'.
   */
  private String camelCaseToTitleCase(final String text) {
    return String.join(" ", text.split(CAMEL_CASE_SEPARATOR));
  }

  private ErrorDTO getErrorFromResponseStatusException(ResponseStatusException e) {
    final ErrorDTO error = new ErrorDTO(INTERNAL_SERVER_ERROR_TYPE, INTERNAL_SERVER_ERROR_TITLE);
    error.setStatus(e.getStatusCode().value());
    error.setDetail(e.getReason());

    switch (e.getStatusCode().value()) {
      case 400:
        error.setType(BAD_REQUEST_TYPE);
        error.setTitle(BAD_REQUEST_TITLE);
        break;
      case 401:
        error.setType(UNAUTHORIZED_TYPE);
        error.setTitle(UNAUTHORIZED_TITLE);
        break;
      case 403:
        error.setType(FORBIDDEN_TYPE);
        error.setTitle(FORBIDDEN_TITLE);
        break;
      case 404:
        error.setType(NOT_FOUND_TYPE);
        error.setTitle(NOT_FOUND_TITLE);
        break;
      case 409:
        error.setType(CONFLICT_TYPE);
        error.setTitle(CONFLICT_TITLE);
        break;
      default:
        break;
    }

    return error;
  }
}

