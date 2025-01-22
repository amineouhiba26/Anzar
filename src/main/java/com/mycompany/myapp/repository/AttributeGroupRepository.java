package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AttributeGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AttributeGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttributeGroupRepository extends JpaRepository<AttributeGroup, Long> {}
