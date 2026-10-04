package com.acme.server.infra.inmemory.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.entity.NoteMother;
import com.acme.server.domain.model.vo.Page;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class NoteRepositoryInMemoryTest {

  private final NoteRepositoryInMemory repository = new NoteRepositoryInMemory();

  @Test
  @DisplayName("pages Notes newest first")
  void pagesNotesNewestFirst() {
    // Given three Notes created a day apart
    final Note oldest = NoteMother.newNote().build();
    final Note middle = NoteMother.newNote().createdAt(oldest.getCreatedAt().plusDays(1)).build();
    final Note newest = NoteMother.newNote().createdAt(oldest.getCreatedAt().plusDays(2)).build();
    repository.save(oldest);
    repository.save(newest);
    repository.save(middle);

    // When asking for the second page of two
    final Page<Note> page = repository.findAll(1, 2);

    // Then it holds the oldest one, and counts all of them
    assertThat(page.elements()).containsExactly(oldest);
    assertThat(page.totalElements()).isEqualTo(3);
    assertThat(page.totalPages()).isEqualTo(2);
  }
}
