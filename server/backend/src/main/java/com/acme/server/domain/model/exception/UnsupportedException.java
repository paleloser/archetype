package com.acme.server.domain.model.exception;

/**
 * A field carries a value the domain does not support. The API layer maps it to a 400 naming the field.
 */
public abstract class UnsupportedException extends Exception {

  public UnsupportedException(final String message) {
    super(message);
  }

  /**
   * Gets the name of the field with a not supported value.
   */
  public abstract String getField();
}
