package com.acme.server.domain.model.exception;

/**
 * The user is not known. The API layer maps it to a 401.
 */
public class UnauthorizedException extends Exception {

  public UnauthorizedException(final String message) {
    super(message);
  }
}
