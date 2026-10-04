package com.acme.server.domain.service;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.model.exception.NoteNotFoundException;
import com.acme.server.domain.model.vo.NoteDraft;
import com.acme.server.domain.model.vo.Page;
import com.acme.server.domain.repository.NoteRepository;
import java.time.Clock;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use cases on {@link Note}s. It orchestrates repositories and entities; the business rules themselves live in the entities.
 * Framework-free: it is instantiated in <code>boot/configuration/NoteServiceConfiguration</code>.
 */
@RequiredArgsConstructor
@Slf4j
public class NoteService {

  private final NoteRepository noteRepository;

  private final Clock clock;

  public Note create(final NoteDraft draft) {
    final Note note = this.noteRepository.save(Note.create(draft, this.clock));
    log.info("Note created [noteId={}]", note.getId());
    return note;
  }

  public void delete(final UUID id) throws NoteNotFoundException {
    this.find(id);
    this.noteRepository.delete(id);
    log.info("Note deleted [noteId={}]", id);
  }

  public Note find(final UUID id) throws NoteNotFoundException {
    return this.noteRepository.findById(id).orElseThrow(() -> new NoteNotFoundException(id));
  }

  public Page<Note> findAll(final int pageNumber, final int pageSize) {
    return this.noteRepository.findAll(pageNumber, pageSize);
  }

  public Note update(final UUID id, final NoteDraft draft) throws NoteNotFoundException {
    log.debug("Updating note [noteId={}]", id);
    final Note note = this.find(id);
    note.update(draft, this.clock);
    return this.noteRepository.save(note);
  }
}
