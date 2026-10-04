package com.acme.server.domain.model.entity;

import com.acme.server.domain.model.vo.NoteDraft;
import jakarta.annotation.Nullable;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

/**
 * A sample aggregate showing where behaviour lives: in the entity, not in the service. Replace it with the first aggregate of your domain.
 */
@EqualsAndHashCode(of = "id")
@Getter
@ToString
public class Note implements Entity {

  private final UUID id;

  private final OffsetDateTime createdAt;

  private String title;

  @Nullable
  private String content;

  private OffsetDateTime updatedAt;

  public Note(final UUID id, final String title, @Nullable final String content, final OffsetDateTime createdAt,
      final OffsetDateTime updatedAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static Note create(final NoteDraft draft, final Clock clock) {
    final OffsetDateTime now = OffsetDateTime.now(clock);
    return new Note(Entity.generateId(), draft.title().strip(), draft.content(), now, now);
  }

  public void update(final NoteDraft draft, final Clock clock) {
    this.title = draft.title().strip();
    this.content = draft.content();
    this.updatedAt = OffsetDateTime.now(clock);
  }
}
