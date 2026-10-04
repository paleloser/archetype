package com.acme.server.infra.postgresql;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration;
import org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Configures SpringBoot features for using: PostgreSQL connection management and repositories' initialization, and Flyway DB migrations.
 */
@ConditionalOnProperty(name = "acme.datasource", havingValue = "postgresql")
@Configuration
@EnableJpaRepositories
@EntityScan
@Import({DataSourceAutoConfiguration.class, FlywayAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
public class PostgreSQLConfiguration {

}
