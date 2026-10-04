package com.acme.server.domain.model.exception;

/**
 * Generic exception. The API layer maps every subclass to a 404.
 */
public abstract class NotFoundException extends Exception {

  /**
   * Constructor.
   */
  public NotFoundException(final String message) {
    super(message);
  }
}
