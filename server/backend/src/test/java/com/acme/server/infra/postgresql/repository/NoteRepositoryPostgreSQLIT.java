package com.acme.server.infra.postgresql.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.entity.NoteMother;
import com.acme.server.domain.model.vo.Page;
import com.acme.server.infra.postgresql.AbstractPostgreSQLIT;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class NoteRepositoryPostgreSQLIT extends AbstractPostgreSQLIT {

  @Autowired
  private NoteRepositoryPostgreSQL repository;

  @BeforeEach
  void setUp() {
    repository.deleteAll();
  }

  @Test
  @DisplayName("stores a Note and reads every field back")
  void savesANote() {
    // Given a Note
    final Note note = NoteMother.newNote().build();

    // When storing it
    repository.save(note);

    // Then every field is read back
    assertThat(repository.findById(note.getId())).hasValueSatisfying(found ->
        assertThat(found).usingRecursiveComparison().isEqualTo(note));
  }

  @Test
  @DisplayName("pages Notes newest first")
  void pagesNotesNewestFirst() {
    // Given two Notes created a day apart
    final Note older = NoteMother.newNote().build();
    final Note newer = NoteMother.newNote().createdAt(older.getCreatedAt().plus(1, ChronoUnit.DAYS)).build();
    repository.save(older);
    repository.save(newer);

    // When asking for the first page
    final Page<Note> page = repository.findAll(0, 10);

    // Then the newest comes first
    assertThat(page.elements()).extracting(Note::getId).containsExactly(newer.getId(), older.getId());
    assertThat(page.totalElements()).isEqualTo(2);
  }
}
