package com.acme.server.api.v1.mapper;

import com.acme.server.api.v1.model.NoteDTO;
import com.acme.server.api.v1.model.NoteRequestDTO;
import com.acme.server.api.v1.model.NotesPageDTO;
import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.vo.NoteDraft;
import com.acme.server.domain.model.vo.Page;

/**
 * Mapper from/to {@link Note} instances.
 */
public final class NoteMapper {

  private NoteMapper() {

  }

  /**
   * Maps a {@link Note} to a {@link NoteDTO} instance.
   */
  public static NoteDTO toDTO(final Note note) {
    return new NoteDTO(note.getId(), note.getTitle(), note.getCreatedAt(), note.getUpdatedAt())
        .content(note.getContent());
  }

  /**
   * Maps a page of {@link Note}s to a {@link NotesPageDTO} instance.
   */
  public static NotesPageDTO toDTO(final Page<Note> page, final int pageNumber) {
    return new NotesPageDTO(
        pageNumber,
        page.totalElements(),
        page.totalPages(),
        page.elements().stream().map(NoteMapper::toDTO).toList());
  }

  /**
   * Maps a {@link NoteRequestDTO} to the {@link NoteDraft} the domain works with.
   */
  public static NoteDraft toDomain(final NoteRequestDTO request) {
    return new NoteDraft(request.getTitle(), request.getContent());
  }
}
