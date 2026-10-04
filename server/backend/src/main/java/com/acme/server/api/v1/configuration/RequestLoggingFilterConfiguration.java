package com.acme.server.api.v1.configuration;

import com.acme.server.api.v1.configuration.RequestLoggingFilterConfiguration.RequestLoggingParams;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Min;
import java.util.Collections;
import java.util.List;
import lombok.Getter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

/**
 * Configuration class that provides a {@link CommonsRequestLoggingFilter} bean.
 */
@Configuration
@ConditionalOnProperty("acme.logging.api.enabled")
@EnableConfigurationProperties(RequestLoggingParams.class)
public class RequestLoggingFilterConfiguration {

  public static final String BEFORE_MESSAGE_PREFIX = "Start request: [";

  public static final String AFTER_MESSAGE_PREFIX = "End request: [";

  private final RequestLoggingParams params;

  /**
   * Main constructor.
   */
  public RequestLoggingFilterConfiguration(final RequestLoggingParams params) {
    this.params = params;
  }

  /**
   * Creates a {@link CommonsRequestLoggingFilter} bean.
   */
  @Bean
  public CommonsRequestLoggingFilter logFilter() {
    final CustomCommonsRequestLoggingFilter filter = new CustomCommonsRequestLoggingFilter();
    filter.setIncludeQueryString(params.isIncludeQueryString());
    filter.setIncludePayload(params.isIncludePayload());
    filter.setMaxPayloadLength(params.getMaxPayloadLength());
    filter.setIncludeHeaders(params.isIncludeHeaders());
    if (params.getExcludedHeaders() != null) {
      filter.setHeaderPredicate(header -> !params.getExcludedHeaders().contains(header));
    }
    filter.setBeforeMessagePrefix(BEFORE_MESSAGE_PREFIX);
    filter.setAfterMessagePrefix(AFTER_MESSAGE_PREFIX);
    if (params.getExcludedPaths() != null) {
      filter.setExcludedPaths(params.getExcludedPaths());
    }

    return filter;
  }

  /**
   * Extension of the {@link CommonsRequestLoggingFilter} to allow to exclude paths from being logged by overriding the shouldLog method.
   */
  @Getter
  public static class CustomCommonsRequestLoggingFilter extends CommonsRequestLoggingFilter {

    private List<String> excludedPaths = Collections.emptyList();

    public void setExcludedPaths(List<String> excludedPaths) {
      this.excludedPaths = excludedPaths != null ? excludedPaths : Collections.emptyList();
    }

    @Override
    protected boolean shouldLog(HttpServletRequest request) {
      return this.logger.isDebugEnabled() && !isExcludedPath(request.getServletPath());
    }

    private boolean isExcludedPath(String path) {
      return excludedPaths.stream().anyMatch(path::startsWith);
    }

  }

  /**
   * Configuration for logging API requests.
   */
  @ConfigurationProperties(prefix = "acme.logging.api")
  public static class RequestLoggingParams {

    public static final Integer DEFAULT_MAX_PAYLOAD_LENGTH = 10000;

    /**
     * Enable the log of all requests.
     */
    private final Boolean enabled;

    /**
     * _true_ if the request query parameters should be logged.
     */
    private final Boolean includeQueryString;

    /**
     * _true_ if the request payload should be logged.
     */
    private final Boolean includePayload;

    /**
     * Max length of the logged payload.
     */
    @Min(0)
    private final Integer maxPayloadLength;

    /**
     * _true_ if the request headers should be logged.
     */
    private final Boolean includeHeaders;

    /**
     * List of headers that should be excluded from being logged. Only used when <code>includeHeaders</code> is set to <code>true</code>.
     */
    private final List<String> excludedHeaders;

    /**
     * List of excluded base paths for being logged.
     */
    private final List<String> excludedPaths;

    /**
     * Main constructor.
     */
    public RequestLoggingParams(final Boolean enabled, final Boolean includeQueryString, final Boolean includePayload,
        final Integer maxPayloadLength, final Boolean includeHeaders, final List<String> excludedHeaders,
        final List<String> excludedPaths) {
      this.enabled = enabled != null && enabled;
      this.includeQueryString = includeQueryString != null && includeQueryString;
      this.includePayload = includePayload != null && includePayload;
      this.maxPayloadLength = maxPayloadLength == null ? DEFAULT_MAX_PAYLOAD_LENGTH : maxPayloadLength;
      this.includeHeaders = includeHeaders != null && includeHeaders;
      this.excludedHeaders = excludedHeaders;
      this.excludedPaths = excludedPaths;
    }

    public Boolean isEnabled() {
      return enabled;
    }

    public Boolean isIncludeQueryString() {
      return includeQueryString;
    }

    public Boolean isIncludePayload() {
      return includePayload;
    }

    public Integer getMaxPayloadLength() {
      return maxPayloadLength;
    }

    public Boolean isIncludeHeaders() {
      return includeHeaders;
    }

    public List<String> getExcludedPaths() {
      return excludedPaths;
    }

    public List<String> getExcludedHeaders() {
      return excludedHeaders;
    }
  }

}
