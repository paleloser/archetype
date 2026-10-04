package com.acme.server.infra.postgresql;

import com.acme.server.infra.postgresql.dao.NoteEntityDAO;
import com.acme.server.infra.postgresql.repository.NoteRepositoryPostgreSQL;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Base class for the PostgreSQL adapters' integration tests: a real PostgreSQL in a container, migrated by Flyway, with only the
 * persistence beans in the context. Add each new DAO and repository to the classes below.
 */
@ActiveProfiles("postgresql")
@EnableTransactionManagement(proxyTargetClass = true)
@SpringBootTest(classes = {
    PostgreSQLConfiguration.class,
    NoteEntityDAO.class,
    NoteRepositoryPostgreSQL.class
})
public abstract class AbstractPostgreSQLIT {

  private static final PostgreSQLContainer POSTGRE_SQL_CONTAINER;

  static {
    POSTGRE_SQL_CONTAINER = new PostgreSQLContainer("postgres:18")
        .withDatabaseName("acme")
        .withUsername("acme")
        .withPassword("passwd");
    POSTGRE_SQL_CONTAINER.start();
  }

  @DynamicPropertySource
  static void postgresqlProperties(final DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRE_SQL_CONTAINER::getJdbcUrl);
    registry.add("spring.datasource.password", POSTGRE_SQL_CONTAINER::getPassword);
    registry.add("spring.datasource.username", POSTGRE_SQL_CONTAINER::getUsername);
  }
}
