package com.acme.server.api.v1.delegate;

import com.acme.server.api.v1.NotesApiDelegate;
import com.acme.server.api.v1.mapper.NoteMapper;
import com.acme.server.api.v1.model.NoteDTO;
import com.acme.server.api.v1.model.NoteRequestDTO;
import com.acme.server.api.v1.model.NotesPageDTO;
import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.exception.NoteNotFoundException;
import com.acme.server.domain.service.NoteService;
import java.net.URI;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

/**
 * Hosts the REST API endpoints to work with {@link Note} entities. Delegates are thin: map the request, call the domain service, map the
 * response. Errors are thrown as domain exceptions and mapped by {@link com.acme.server.api.v1.configuration.ErrorHandler}.
 */
@Component
@RequiredArgsConstructor
public class NotesApiDelegateImpl implements NotesApiDelegate {

  private final NoteService noteService;

  @Override
  public ResponseEntity<NoteDTO> createNote(final NoteRequestDTO request) {
    final Note note = this.noteService.create(NoteMapper.toDomain(request));
    return ResponseEntity.created(URI.create("/v1/notes/" + note.getId())).body(NoteMapper.toDTO(note));
  }

  @Override
  public ResponseEntity<Void> deleteNote(final UUID noteId) throws NoteNotFoundException {
    this.noteService.delete(noteId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<NoteDTO> findNote(final UUID noteId) throws NoteNotFoundException {
    return ResponseEntity.ok(NoteMapper.toDTO(this.noteService.find(noteId)));
  }

  @Override
  public ResponseEntity<NotesPageDTO> findNotes(final Integer pageNumber, final Integer pageSize) {
    return ResponseEntity.ok(NoteMapper.toDTO(this.noteService.findAll(pageNumber, pageSize), pageNumber));
  }

  @Override
  public ResponseEntity<NoteDTO> updateNote(final UUID noteId, final NoteRequestDTO request) throws NoteNotFoundException {
    return ResponseEntity.ok(NoteMapper.toDTO(this.noteService.update(noteId, NoteMapper.toDomain(request))));
  }
}
