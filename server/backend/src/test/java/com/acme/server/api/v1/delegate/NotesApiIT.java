package com.acme.server.api.v1.delegate;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.acme.server.boot.Application;
import com.acme.server.domain.repository.NoteRepository;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Exercises the REST façade end to end against the in-memory adapters: routing, validation, mapping and error handling.
 */
@AutoConfigureMockMvc
@SpringBootTest(classes = Application.class)
public class NotesApiIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private NoteRepository noteRepository;

  @BeforeEach
  void setUp() {
    noteRepository.deleteAll();
  }

  @Test
  @DisplayName("a created Note can be read back")
  void createsANote() throws Exception {
    mockMvc.perform(post("/v1/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"title\":\"Groceries\",\"content\":\"Milk\"}"))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location", startsWith("/v1/notes/")))
        .andExpect(jsonPath("$.title").value("Groceries"));

    mockMvc.perform(get("/v1/notes"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalItems").value(1))
        .andExpect(jsonPath("$.items[0].content").value("Milk"));
  }

  @Test
  @DisplayName("an invalid request is answered with the violated constraints, as a problem")
  void rejectsAnInvalidNote() throws Exception {
    mockMvc.perform(post("/v1/notes")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"title\":\"\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(header().string("Content-Type", MediaType.APPLICATION_PROBLEM_JSON_VALUE))
        .andExpect(jsonPath("$.violations[0].field").value("title"));
  }

  @Test
  @DisplayName("a missing Note is answered with a 404 problem")
  void answersNotFound() throws Exception {
    mockMvc.perform(get("/v1/notes/" + UUID.randomUUID()))
        .andExpect(status().isNotFound())
        .andExpect(header().string("Content-Type", MediaType.APPLICATION_PROBLEM_JSON_VALUE))
        .andExpect(jsonPath("$.type").value("https://api.acme.example/errors/NOT_FOUND"));
  }
}
