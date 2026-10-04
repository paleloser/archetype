package com.acme.server.domain.model.exception;

import java.util.UUID;

public class NoteNotFoundException extends NotFoundException {

  public NoteNotFoundException(final UUID id) {
    super("Note %s not found!".formatted(id));
  }
}
