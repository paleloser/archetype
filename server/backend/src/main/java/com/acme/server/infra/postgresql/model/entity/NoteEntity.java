package com.acme.server.infra.postgresql.model.entity;

import com.acme.server.domain.model.entity.Note;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * PostgreSQL's representation of a domain {@link Note}.
 */
@Entity
@Getter
@NoArgsConstructor
@Setter
@Table(name = "note")
public class NoteEntity extends PostgreSQLEntity {

  @Id
  private UUID id;

  private String title;

  private String content;

  private OffsetDateTime createdAt;

  private OffsetDateTime updatedAt;
}
