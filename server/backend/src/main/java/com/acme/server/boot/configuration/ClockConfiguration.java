package com.acme.server.boot.configuration;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Generates a global Clock. Domain code takes it as a dependency instead of calling <code>now()</code>, so tests can pin time.
 */
@Configuration
public class ClockConfiguration {

  /**
   * Instantiates a Clock.
   */
  @Bean
  public Clock clock() {
    return Clock.systemUTC();
  }
}
