package com.acme.server.api.v1.authentication;

import jakarta.annotation.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 * Utility class to extract the user ID from the Security Context. Delegates pass it to the domain as a plain string (the identity provider
 * ID), so the domain never depends on Spring Security.
 */
public final class SessionIdExtractor {

  private static final String ID_ATTRIBUTE = "sub";

  private SessionIdExtractor() {

  }

  /**
   * Extracts the user ID from the current SecurityContext, or <code>null</code> when the request is not authenticated (e.g. with
   * <code>acme.authentication.enabled: false</code>).
   */
  @Nullable
  public static String extractIdpId() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof JwtAuthenticationToken jwtToken) {
      return (String) jwtToken.getTokenAttributes().get(ID_ATTRIBUTE);
    }
    return null;
  }
}
