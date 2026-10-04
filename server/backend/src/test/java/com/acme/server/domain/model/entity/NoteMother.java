package com.acme.server.domain.model.entity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import lombok.Builder;

/**
 * Object Mother for {@link Note}: sensible defaults, overridable one field at a time through the builder.
 */
public final class NoteMother {

  private NoteMother() {

  }

  public static NoteMother.NoteBuilder newNote() {
    final OffsetDateTime createdAt = OffsetDateTime.of(2026, 1, 1, 10, 0, 0, 0, ZoneOffset.UTC);
    return new NoteBuilder()
        .id(UUID.randomUUID())
        .title("Groceries")
        .content("Milk, eggs and bread")
        .createdAt(createdAt)
        .updatedAt(createdAt);
  }

  @Builder
  private static Note builder(final UUID id, final String title, final String content, final OffsetDateTime createdAt,
      final OffsetDateTime updatedAt) {
    return new Note(id, title, content, createdAt, updatedAt);
  }
}
