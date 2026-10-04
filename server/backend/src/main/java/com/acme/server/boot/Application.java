package com.acme.server.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration;
import org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

/**
 * Server entrypoint. Persistence auto-configuration is excluded here and imported back by
 * {@link com.acme.server.infra.postgresql.PostgreSQLConfiguration} only when PostgreSQL is the selected datasource, so the server boots
 * without a database for the in-memory adapters.
 */
@SpringBootApplication(scanBasePackages = "com.acme.server",
    exclude = {DataSourceAutoConfiguration.class, FlywayAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
public class Application {

  /**
   * Starts the server.
   */
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

}
