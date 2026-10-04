package com.acme.server.api.v1.configuration;

import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

/**
 * Configuration class for dealing with authentication at API level. The API is a stateless OAuth2 resource server: it accepts JWT bearer
 * access tokens issued by any OpenID Connect provider (<code>spring.security.oauth2.resourceserver.jwt.issuer-uri</code>), and
 * <code>acme.authentication.enabled: false</code> turns all of it off for local runs.
 */
@Configuration
public class SecurityConfiguration {

  @Value("${acme.cors.allowed-origin-patterns:http://localhost:3000}")
  private List<String> allowedOriginPatterns;

  /**
   * Disables security for all endpoints.
   */
  @Bean
  @ConditionalOnProperty(name = "acme.authentication.enabled", havingValue = "false", matchIfMissing = true)
  public WebSecurityCustomizer webSecurityCustomizer() {
    return web -> web.ignoring().requestMatchers("/**");
  }

  /**
   * Configures CORS when authentication is disabled.
   */
  @Bean
  @ConditionalOnProperty(name = "acme.authentication.enabled", havingValue = "false", matchIfMissing = true)
  public SecurityFilterChain securityFilterChainNoauth(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(request -> corsConfiguration(false)));
    return http.build();
  }

  /**
   * Requires a valid bearer token on every endpoint but the health check.
   */
  @Bean
  @ConditionalOnProperty(name = "acme.authentication.enabled", havingValue = "true")
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(request -> corsConfiguration(true)))
        // Bearer tokens are never sent by the browser on its own, so there is no ambient credential for CSRF to abuse.
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            // Container healthchecks and the deploy gate poll this unauthenticated.
            // It only ever reports UP/DOWN (management.endpoint.health.show-details: never).
            .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/health/**").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
    return http.build();
  }

  private CorsConfiguration corsConfiguration(final boolean allowCredentials) {
    final CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(allowCredentials);
    config.setAllowedOriginPatterns(allowedOriginPatterns);
    config.setAllowedMethods(Collections.singletonList("*"));
    config.setAllowedHeaders(Collections.singletonList("*"));
    config.addExposedHeader("Location");
    return config;
  }

}
