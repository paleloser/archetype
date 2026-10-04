package com.acme.server.boot;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ApplicationIT {

  @Test
  @DisplayName("context loads")
  void contextLoads() {
    // Empty on purpose: the test only ensures that the context loads
  }
}
