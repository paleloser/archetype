package com.acme.server.domain.model.vo;

import java.util.Collection;

public record Page<T>(int totalPages, long totalElements, Collection<T> elements) {

}
