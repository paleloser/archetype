package com.acme.server.domain.model.exception;

/**
 * The user is known, but not allowed to perform the operation. The API layer maps it to a 403.
 */
public class ForbiddenException extends Exception {

  public ForbiddenException(final String message) {
    super(message);
  }
}
