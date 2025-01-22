package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Property;
import com.mycompany.myapp.repository.PropertyRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Property}.
 */
@RestController
@RequestMapping("/api/properties")
@Transactional
public class PropertyResource {

    private static final Logger LOG = LoggerFactory.getLogger(PropertyResource.class);

    private static final String ENTITY_NAME = "property";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PropertyRepository propertyRepository;

    public PropertyResource(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    /**
     * {@code POST  /properties} : Create a new property.
     *
     * @param property the property to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new property, or with status {@code 400 (Bad Request)} if the property has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Property> createProperty(@RequestBody Property property) throws URISyntaxException {
        LOG.debug("REST request to save Property : {}", property);
        if (property.getId() != null) {
            throw new BadRequestAlertException("A new property cannot already have an ID", ENTITY_NAME, "idexists");
        }
        property = propertyRepository.save(property);
        return ResponseEntity.created(new URI("/api/properties/" + property.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, property.getId().toString()))
            .body(property);
    }

    /**
     * {@code PUT  /properties/:id} : Updates an existing property.
     *
     * @param id the id of the property to save.
     * @param property the property to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated property,
     * or with status {@code 400 (Bad Request)} if the property is not valid,
     * or with status {@code 500 (Internal Server Error)} if the property couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Property property
    ) throws URISyntaxException {
        LOG.debug("REST request to update Property : {}, {}", id, property);
        if (property.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, property.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!propertyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        property = propertyRepository.save(property);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, property.getId().toString()))
            .body(property);
    }

    /**
     * {@code PATCH  /properties/:id} : Partial updates given fields of an existing property, field will ignore if it is null
     *
     * @param id the id of the property to save.
     * @param property the property to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated property,
     * or with status {@code 400 (Bad Request)} if the property is not valid,
     * or with status {@code 404 (Not Found)} if the property is not found,
     * or with status {@code 500 (Internal Server Error)} if the property couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Property> partialUpdateProperty(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Property property
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Property partially : {}, {}", id, property);
        if (property.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, property.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!propertyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Property> result = propertyRepository
            .findById(property.getId())
            .map(existingProperty -> {
                if (property.getName() != null) {
                    existingProperty.setName(property.getName());
                }
                if (property.getPrice() != null) {
                    existingProperty.setPrice(property.getPrice());
                }
                if (property.getLocation() != null) {
                    existingProperty.setLocation(property.getLocation());
                }
                if (property.getCreatedBy() != null) {
                    existingProperty.setCreatedBy(property.getCreatedBy());
                }
                if (property.getCreatedDate() != null) {
                    existingProperty.setCreatedDate(property.getCreatedDate());
                }
                if (property.getLastModifiedBy() != null) {
                    existingProperty.setLastModifiedBy(property.getLastModifiedBy());
                }
                if (property.getLastModifiedDate() != null) {
                    existingProperty.setLastModifiedDate(property.getLastModifiedDate());
                }

                return existingProperty;
            })
            .map(propertyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, property.getId().toString())
        );
    }

    /**
     * {@code GET  /properties} : get all the properties.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of properties in body.
     */
    @GetMapping("")
    public List<Property> getAllProperties() {
        LOG.debug("REST request to get all Properties");
        return propertyRepository.findAll();
    }

    /**
     * {@code GET  /properties/:id} : get the "id" property.
     *
     * @param id the id of the property to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the property, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Property> getProperty(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Property : {}", id);
        Optional<Property> property = propertyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(property);
    }

    /**
     * {@code DELETE  /properties/:id} : delete the "id" property.
     *
     * @param id the id of the property to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Property : {}", id);
        propertyRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
