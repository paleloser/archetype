package com.acme.server.boot.configuration;

import com.acme.server.domain.model.entity.Note;
import com.acme.server.domain.repository.NoteRepository;
import com.acme.server.domain.service.NoteService;
import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Instantiates the necessary beans to work with {@link Note} entities.
 */
@Configuration
public class NoteServiceConfiguration {

  /**
   * Instantiates a {@link NoteService} bean.
   */
  @Bean
  public NoteService noteService(final NoteRepository noteRepository, final Clock clock) {
    return new NoteService(noteRepository, clock);
  }

}
