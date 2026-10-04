package com.acme.server.domain.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.entity.NoteMother;
import com.acme.server.domain.model.exception.NoteNotFoundException;
import com.acme.server.domain.model.vo.NoteDraft;
import com.acme.server.domain.repository.NoteRepository;
import java.time.Clock;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class NoteServiceTest {

  private NoteRepository noteRepository;

  private NoteService noteService;

  @BeforeEach
  void setUp() {
    noteRepository = mock(NoteRepository.class);
    noteService = new NoteService(noteRepository, Clock.systemUTC());
  }

  @Test
  @DisplayName("updating a Note persists the updated Note")
  void updatesANote() throws Exception {
    // Given an existing Note
    final Note note = NoteMother.newNote().build();
    when(noteRepository.findById(note.getId())).thenReturn(Optional.of(note));
    when(noteRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    // When it is updated
    final Note updated = noteService.update(note.getId(), new NoteDraft("Chores", "Laundry"));

    // Then the update is persisted
    assertThat(updated.getTitle()).isEqualTo("Chores");
    verify(noteRepository).save(note);
  }

  @Test
  @DisplayName("deleting a Note that does not exist fails without touching the repository")
  void deletingAMissingNoteFails() {
    // Given no Note
    final UUID id = UUID.randomUUID();
    when(noteRepository.findById(id)).thenReturn(Optional.empty());

    // When deleting it, then it fails
    assertThatThrownBy(() -> noteService.delete(id)).isInstanceOf(NoteNotFoundException.class);
    verify(noteRepository, never()).delete(any());
  }
}
