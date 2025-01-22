package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.AttributeValue;
import com.mycompany.myapp.repository.AttributeValueRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.AttributeValue}.
 */
@RestController
@RequestMapping("/api/attribute-values")
@Transactional
public class AttributeValueResource {

    private static final Logger LOG = LoggerFactory.getLogger(AttributeValueResource.class);

    private static final String ENTITY_NAME = "attributeValue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AttributeValueRepository attributeValueRepository;

    public AttributeValueResource(AttributeValueRepository attributeValueRepository) {
        this.attributeValueRepository = attributeValueRepository;
    }

    /**
     * {@code POST  /attribute-values} : Create a new attributeValue.
     *
     * @param attributeValue the attributeValue to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new attributeValue, or with status {@code 400 (Bad Request)} if the attributeValue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AttributeValue> createAttributeValue(@RequestBody AttributeValue attributeValue) throws URISyntaxException {
        LOG.debug("REST request to save AttributeValue : {}", attributeValue);
        if (attributeValue.getId() != null) {
            throw new BadRequestAlertException("A new attributeValue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        attributeValue = attributeValueRepository.save(attributeValue);
        return ResponseEntity.created(new URI("/api/attribute-values/" + attributeValue.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, attributeValue.getId().toString()))
            .body(attributeValue);
    }

    /**
     * {@code PUT  /attribute-values/:id} : Updates an existing attributeValue.
     *
     * @param id the id of the attributeValue to save.
     * @param attributeValue the attributeValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attributeValue,
     * or with status {@code 400 (Bad Request)} if the attributeValue is not valid,
     * or with status {@code 500 (Internal Server Error)} if the attributeValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AttributeValue> updateAttributeValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AttributeValue attributeValue
    ) throws URISyntaxException {
        LOG.debug("REST request to update AttributeValue : {}, {}", id, attributeValue);
        if (attributeValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attributeValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attributeValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        attributeValue = attributeValueRepository.save(attributeValue);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, attributeValue.getId().toString()))
            .body(attributeValue);
    }

    /**
     * {@code PATCH  /attribute-values/:id} : Partial updates given fields of an existing attributeValue, field will ignore if it is null
     *
     * @param id the id of the attributeValue to save.
     * @param attributeValue the attributeValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attributeValue,
     * or with status {@code 400 (Bad Request)} if the attributeValue is not valid,
     * or with status {@code 404 (Not Found)} if the attributeValue is not found,
     * or with status {@code 500 (Internal Server Error)} if the attributeValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AttributeValue> partialUpdateAttributeValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AttributeValue attributeValue
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AttributeValue partially : {}, {}", id, attributeValue);
        if (attributeValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attributeValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attributeValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AttributeValue> result = attributeValueRepository
            .findById(attributeValue.getId())
            .map(existingAttributeValue -> {
                if (attributeValue.getValueString() != null) {
                    existingAttributeValue.setValueString(attributeValue.getValueString());
                }
                if (attributeValue.getValueBigDecimal() != null) {
                    existingAttributeValue.setValueBigDecimal(attributeValue.getValueBigDecimal());
                }
                if (attributeValue.getValueBoolean() != null) {
                    existingAttributeValue.setValueBoolean(attributeValue.getValueBoolean());
                }
                if (attributeValue.getCreatedBy() != null) {
                    existingAttributeValue.setCreatedBy(attributeValue.getCreatedBy());
                }
                if (attributeValue.getCreatedDate() != null) {
                    existingAttributeValue.setCreatedDate(attributeValue.getCreatedDate());
                }
                if (attributeValue.getLastModifiedBy() != null) {
                    existingAttributeValue.setLastModifiedBy(attributeValue.getLastModifiedBy());
                }
                if (attributeValue.getLastModifiedDate() != null) {
                    existingAttributeValue.setLastModifiedDate(attributeValue.getLastModifiedDate());
                }

                return existingAttributeValue;
            })
            .map(attributeValueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, attributeValue.getId().toString())
        );
    }

    /**
     * {@code GET  /attribute-values} : get all the attributeValues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of attributeValues in body.
     */
    @GetMapping("")
    public List<AttributeValue> getAllAttributeValues() {
        LOG.debug("REST request to get all AttributeValues");
        return attributeValueRepository.findAll();
    }

    /**
     * {@code GET  /attribute-values/:id} : get the "id" attributeValue.
     *
     * @param id the id of the attributeValue to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the attributeValue, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AttributeValue> getAttributeValue(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AttributeValue : {}", id);
        Optional<AttributeValue> attributeValue = attributeValueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(attributeValue);
    }

    /**
     * {@code DELETE  /attribute-values/:id} : delete the "id" attributeValue.
     *
     * @param id the id of the attributeValue to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeValue(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AttributeValue : {}", id);
        attributeValueRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
