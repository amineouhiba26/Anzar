package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.AttributeGroup;
import com.mycompany.myapp.repository.AttributeGroupRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.AttributeGroup}.
 */
@RestController
@RequestMapping("/api/attribute-groups")
@Transactional
public class AttributeGroupResource {

    private static final Logger LOG = LoggerFactory.getLogger(AttributeGroupResource.class);

    private static final String ENTITY_NAME = "attributeGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AttributeGroupRepository attributeGroupRepository;

    public AttributeGroupResource(AttributeGroupRepository attributeGroupRepository) {
        this.attributeGroupRepository = attributeGroupRepository;
    }

    /**
     * {@code POST  /attribute-groups} : Create a new attributeGroup.
     *
     * @param attributeGroup the attributeGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new attributeGroup, or with status {@code 400 (Bad Request)} if the attributeGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AttributeGroup> createAttributeGroup(@RequestBody AttributeGroup attributeGroup) throws URISyntaxException {
        LOG.debug("REST request to save AttributeGroup : {}", attributeGroup);
        if (attributeGroup.getId() != null) {
            throw new BadRequestAlertException("A new attributeGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        attributeGroup = attributeGroupRepository.save(attributeGroup);
        return ResponseEntity.created(new URI("/api/attribute-groups/" + attributeGroup.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, attributeGroup.getId().toString()))
            .body(attributeGroup);
    }

    /**
     * {@code PUT  /attribute-groups/:id} : Updates an existing attributeGroup.
     *
     * @param id the id of the attributeGroup to save.
     * @param attributeGroup the attributeGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attributeGroup,
     * or with status {@code 400 (Bad Request)} if the attributeGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the attributeGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AttributeGroup> updateAttributeGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AttributeGroup attributeGroup
    ) throws URISyntaxException {
        LOG.debug("REST request to update AttributeGroup : {}, {}", id, attributeGroup);
        if (attributeGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attributeGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attributeGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        attributeGroup = attributeGroupRepository.save(attributeGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, attributeGroup.getId().toString()))
            .body(attributeGroup);
    }

    /**
     * {@code PATCH  /attribute-groups/:id} : Partial updates given fields of an existing attributeGroup, field will ignore if it is null
     *
     * @param id the id of the attributeGroup to save.
     * @param attributeGroup the attributeGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated attributeGroup,
     * or with status {@code 400 (Bad Request)} if the attributeGroup is not valid,
     * or with status {@code 404 (Not Found)} if the attributeGroup is not found,
     * or with status {@code 500 (Internal Server Error)} if the attributeGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AttributeGroup> partialUpdateAttributeGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AttributeGroup attributeGroup
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AttributeGroup partially : {}, {}", id, attributeGroup);
        if (attributeGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, attributeGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!attributeGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AttributeGroup> result = attributeGroupRepository
            .findById(attributeGroup.getId())
            .map(existingAttributeGroup -> {
                if (attributeGroup.getName() != null) {
                    existingAttributeGroup.setName(attributeGroup.getName());
                }
                if (attributeGroup.getCreatedBy() != null) {
                    existingAttributeGroup.setCreatedBy(attributeGroup.getCreatedBy());
                }
                if (attributeGroup.getCreatedDate() != null) {
                    existingAttributeGroup.setCreatedDate(attributeGroup.getCreatedDate());
                }
                if (attributeGroup.getLastModifiedBy() != null) {
                    existingAttributeGroup.setLastModifiedBy(attributeGroup.getLastModifiedBy());
                }
                if (attributeGroup.getLastModifiedDate() != null) {
                    existingAttributeGroup.setLastModifiedDate(attributeGroup.getLastModifiedDate());
                }

                return existingAttributeGroup;
            })
            .map(attributeGroupRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, attributeGroup.getId().toString())
        );
    }

    /**
     * {@code GET  /attribute-groups} : get all the attributeGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of attributeGroups in body.
     */
    @GetMapping("")
    public List<AttributeGroup> getAllAttributeGroups() {
        LOG.debug("REST request to get all AttributeGroups");
        return attributeGroupRepository.findAll();
    }

    /**
     * {@code GET  /attribute-groups/:id} : get the "id" attributeGroup.
     *
     * @param id the id of the attributeGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the attributeGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AttributeGroup> getAttributeGroup(@PathVariable("id") Long id) {
        LOG.debug("REST request to get AttributeGroup : {}", id);
        Optional<AttributeGroup> attributeGroup = attributeGroupRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(attributeGroup);
    }

    /**
     * {@code DELETE  /attribute-groups/:id} : delete the "id" attributeGroup.
     *
     * @param id the id of the attributeGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttributeGroup(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete AttributeGroup : {}", id);
        attributeGroupRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
