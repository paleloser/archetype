package com.acme.server.infra.postgresql.mapper;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.infra.postgresql.model.entity.NoteEntity;

/**
 * Maps between PostgreSQL and domain entities.
 */
public final class NoteMapper {

  private NoteMapper() {

  }

  /**
   * Generates a domain entity out of a PostgreSQL stored entity.
   */
  public static Note toDomain(final NoteEntity entity) {
    return new Note(
        entity.getId(),
        entity.getTitle(),
        entity.getContent(),
        entity.getCreatedAt(),
        entity.getUpdatedAt());
  }

  /**
   * Generates a storable PostgreSQL entity out of a domain entity.
   */
  public static NoteEntity toInfra(final Note note) {
    final NoteEntity entity = new NoteEntity();
    entity.setId(note.getId());
    entity.setTitle(note.getTitle());
    entity.setContent(note.getContent());
    entity.setCreatedAt(note.getCreatedAt());
    entity.setUpdatedAt(note.getUpdatedAt());
    return entity;
  }
}
