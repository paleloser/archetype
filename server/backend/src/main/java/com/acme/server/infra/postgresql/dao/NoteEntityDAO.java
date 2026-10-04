package com.acme.server.infra.postgresql.dao;

import com.acme.server.infra.postgresql.model.entity.NoteEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Returns PostgreSQL implementations from the corresponding table.
 */
@Repository
public interface NoteEntityDAO extends JpaRepository<NoteEntity, UUID> {

}
