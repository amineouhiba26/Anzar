package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CustomConfiguration;
import com.mycompany.myapp.repository.CustomConfigurationRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.CustomConfiguration}.
 */
@RestController
@RequestMapping("/api/custom-configurations")
@Transactional
public class CustomConfigurationResource {

    private static final Logger LOG = LoggerFactory.getLogger(CustomConfigurationResource.class);

    private static final String ENTITY_NAME = "customConfiguration";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomConfigurationRepository customConfigurationRepository;

    public CustomConfigurationResource(CustomConfigurationRepository customConfigurationRepository) {
        this.customConfigurationRepository = customConfigurationRepository;
    }

    /**
     * {@code POST  /custom-configurations} : Create a new customConfiguration.
     *
     * @param customConfiguration the customConfiguration to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customConfiguration, or with status {@code 400 (Bad Request)} if the customConfiguration has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CustomConfiguration> createCustomConfiguration(@RequestBody CustomConfiguration customConfiguration)
        throws URISyntaxException {
        LOG.debug("REST request to save CustomConfiguration : {}", customConfiguration);
        if (customConfiguration.getId() != null) {
            throw new BadRequestAlertException("A new customConfiguration cannot already have an ID", ENTITY_NAME, "idexists");
        }
        customConfiguration = customConfigurationRepository.save(customConfiguration);
        return ResponseEntity.created(new URI("/api/custom-configurations/" + customConfiguration.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, customConfiguration.getId().toString()))
            .body(customConfiguration);
    }

    /**
     * {@code PUT  /custom-configurations/:id} : Updates an existing customConfiguration.
     *
     * @param id the id of the customConfiguration to save.
     * @param customConfiguration the customConfiguration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customConfiguration,
     * or with status {@code 400 (Bad Request)} if the customConfiguration is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customConfiguration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomConfiguration> updateCustomConfiguration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomConfiguration customConfiguration
    ) throws URISyntaxException {
        LOG.debug("REST request to update CustomConfiguration : {}, {}", id, customConfiguration);
        if (customConfiguration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customConfiguration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customConfigurationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        customConfiguration = customConfigurationRepository.save(customConfiguration);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customConfiguration.getId().toString()))
            .body(customConfiguration);
    }

    /**
     * {@code PATCH  /custom-configurations/:id} : Partial updates given fields of an existing customConfiguration, field will ignore if it is null
     *
     * @param id the id of the customConfiguration to save.
     * @param customConfiguration the customConfiguration to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customConfiguration,
     * or with status {@code 400 (Bad Request)} if the customConfiguration is not valid,
     * or with status {@code 404 (Not Found)} if the customConfiguration is not found,
     * or with status {@code 500 (Internal Server Error)} if the customConfiguration couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomConfiguration> partialUpdateCustomConfiguration(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CustomConfiguration customConfiguration
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update CustomConfiguration partially : {}, {}", id, customConfiguration);
        if (customConfiguration.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customConfiguration.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customConfigurationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CustomConfiguration> result = customConfigurationRepository
            .findById(customConfiguration.getId())
            .map(existingCustomConfiguration -> {
                if (customConfiguration.getName() != null) {
                    existingCustomConfiguration.setName(customConfiguration.getName());
                }
                if (customConfiguration.getDescription() != null) {
                    existingCustomConfiguration.setDescription(customConfiguration.getDescription());
                }
                if (customConfiguration.getCreatedBy() != null) {
                    existingCustomConfiguration.setCreatedBy(customConfiguration.getCreatedBy());
                }
                if (customConfiguration.getCreatedDate() != null) {
                    existingCustomConfiguration.setCreatedDate(customConfiguration.getCreatedDate());
                }
                if (customConfiguration.getLastModifiedBy() != null) {
                    existingCustomConfiguration.setLastModifiedBy(customConfiguration.getLastModifiedBy());
                }
                if (customConfiguration.getLastModifiedDate() != null) {
                    existingCustomConfiguration.setLastModifiedDate(customConfiguration.getLastModifiedDate());
                }

                return existingCustomConfiguration;
            })
            .map(customConfigurationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customConfiguration.getId().toString())
        );
    }

    /**
     * {@code GET  /custom-configurations} : get all the customConfigurations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customConfigurations in body.
     */
    @GetMapping("")
    public List<CustomConfiguration> getAllCustomConfigurations() {
        LOG.debug("REST request to get all CustomConfigurations");
        return customConfigurationRepository.findAll();
    }

    /**
     * {@code GET  /custom-configurations/:id} : get the "id" customConfiguration.
     *
     * @param id the id of the customConfiguration to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customConfiguration, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomConfiguration> getCustomConfiguration(@PathVariable("id") Long id) {
        LOG.debug("REST request to get CustomConfiguration : {}", id);
        Optional<CustomConfiguration> customConfiguration = customConfigurationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(customConfiguration);
    }

    /**
     * {@code DELETE  /custom-configurations/:id} : delete the "id" customConfiguration.
     *
     * @param id the id of the customConfiguration to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomConfiguration(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete CustomConfiguration : {}", id);
        customConfigurationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
