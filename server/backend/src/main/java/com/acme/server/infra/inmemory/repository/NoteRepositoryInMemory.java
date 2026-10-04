package com.acme.server.infra.inmemory.repository;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.vo.Page;
import com.acme.server.domain.repository.NoteRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

/**
 * In-memory implementation. It hosts the information in a map stored in memory. Useful for local development/tests.
 */
@ConditionalOnProperty(name = "acme.datasource", havingValue = "inmemory", matchIfMissing = true)
@Repository
public class NoteRepositoryInMemory implements NoteRepository {

  private final ConcurrentHashMap<UUID, Note> store = new ConcurrentHashMap<>();

  @Override
  public void deleteAll() {
    this.store.clear();
  }

  @Override
  public void delete(final UUID id) {
    this.store.remove(id);
  }

  @Override
  public Optional<Note> findById(final UUID id) {
    return Optional.ofNullable(this.store.get(id));
  }

  @Override
  public Page<Note> findAll(final int pageNumber, final int pageSize) {
    final List<Note> elements = this.store.values()
        .stream()
        .sorted(Comparator.comparing(Note::getCreatedAt).reversed())
        .skip((long) pageNumber * pageSize)
        .limit(pageSize)
        .toList();
    final int total = this.store.size();
    return new Page<>((total + pageSize - 1) / pageSize, total, elements);
  }

  @Override
  public Note save(final Note note) {
    this.store.put(note.getId(), note);
    return note;
  }
}
