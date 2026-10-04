package com.acme.server.domain.model.entity;

import static org.assertj.core.api.Assertions.assertThat;

import com.acme.server.domain.model.vo.NoteDraft;
import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class NoteTest {

  private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-05-01T08:00:00Z"), ZoneOffset.UTC);

  @Test
  @DisplayName("a new Note gets an id, a trimmed title and the current time")
  void createsANote() {
    // When a Note is created
    final Note note = Note.create(new NoteDraft("  Groceries  ", "Milk"), CLOCK);

    // Then it is complete before being persisted
    assertThat(note.getId()).isNotNull();
    assertThat(note.getTitle()).isEqualTo("Groceries");
    assertThat(note.getCreatedAt()).isEqualTo(OffsetDateTime.now(CLOCK));
    assertThat(note.getUpdatedAt()).isEqualTo(note.getCreatedAt());
  }

  @Test
  @DisplayName("updating a Note keeps its creation date")
  void updatesANote() {
    // Given an existing Note
    final Note note = NoteMother.newNote().build();
    final OffsetDateTime createdAt = note.getCreatedAt();

    // When it is updated
    note.update(new NoteDraft("Chores", null), CLOCK);

    // Then only the content and the update date change
    assertThat(note.getTitle()).isEqualTo("Chores");
    assertThat(note.getContent()).isNull();
    assertThat(note.getCreatedAt()).isEqualTo(createdAt);
    assertThat(note.getUpdatedAt()).isEqualTo(OffsetDateTime.now(CLOCK));
  }
}
