package com.acme.server.infra.postgresql.model.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * Base class that implements the hashCode and equals methods to use in all JPA entities.
 */
public abstract class PostgreSQLEntity implements Serializable {

  /**
   * Returns the entity unique ID.
   */
  public abstract Object getId();

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    final PostgreSQLEntity that = (PostgreSQLEntity) o;
    final Object thisId = getId();
    final Object thatId = that.getId();
    return thisId != null && thatId != null && Objects.equals(thisId, thatId);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
