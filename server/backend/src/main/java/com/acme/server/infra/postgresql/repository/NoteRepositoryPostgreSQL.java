package com.acme.server.infra.postgresql.repository;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.vo.Page;
import com.acme.server.domain.repository.NoteRepository;
import com.acme.server.infra.postgresql.dao.NoteEntityDAO;
import com.acme.server.infra.postgresql.mapper.NoteMapper;
import com.acme.server.infra.postgresql.model.entity.NoteEntity;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * PostgreSQL's implementation of the repository.
 */
@ConditionalOnProperty(name = "acme.datasource", havingValue = "postgresql")
@Repository
@RequiredArgsConstructor
@Slf4j
public class NoteRepositoryPostgreSQL implements NoteRepository {

  private final NoteEntityDAO dao;

  @Override
  @Transactional
  public void deleteAll() {
    this.dao.deleteAll();
  }

  @Override
  @Transactional
  public void delete(final UUID id) {
    this.dao.deleteById(id);
  }

  @Override
  @Transactional(readOnly = true)
  public Optional<Note> findById(final UUID id) {
    return this.dao.findById(id).map(NoteMapper::toDomain);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<Note> findAll(final int pageNumber, final int pageSize) {
    final org.springframework.data.domain.Page<NoteEntity> page = this.dao.findAll(
        PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")));
    return new Page<>(page.getTotalPages(), page.getTotalElements(), page.map(NoteMapper::toDomain).toList());
  }

  @Override
  @Transactional
  public Note save(final Note note) {
    log.debug("Saving note [noteId={}]", note.getId());
    return NoteMapper.toDomain(this.dao.save(NoteMapper.toInfra(note)));
  }
}
