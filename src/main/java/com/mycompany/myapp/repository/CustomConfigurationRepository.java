package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CustomConfiguration;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CustomConfiguration entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomConfigurationRepository extends JpaRepository<CustomConfiguration, Long> {}
