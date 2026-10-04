package com.acme.server.domain.model.vo;

import jakarta.annotation.Nullable;

/**
 * What a user writes when creating or updating a Note.
 */
public record NoteDraft(String title, @Nullable String content) {

}
