package com.acme.server.domain.repository;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.vo.Page;
import java.util.Optional;
import java.util.UUID;

/**
 * Port to store {@link Note}s. Adapters live in <code>infra</code>, one per storage, selected by configuration.
 */
public interface NoteRepository {

  /**
   * For testing purposes.
   */
  void deleteAll();

  void delete(UUID id);

  Optional<Note> findById(UUID id);

  /**
   * Finds a page of Notes, newest first.
   */
  Page<Note> findAll(int pageNumber, int pageSize);

  Note save(Note note);
}
