package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Agency;
import com.mycompany.myapp.repository.AgencyRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Agency}.
 */
@RestController
@RequestMapping("/api/agencies")
@Transactional
public class AgencyResource {

    private static final Logger LOG = LoggerFactory.getLogger(AgencyResource.class);

    private static final String ENTITY_NAME = "agency";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgencyRepository agencyRepository;

    public AgencyResource(AgencyRepository agencyRepository) {
        this.agencyRepository = agencyRepository;
    }

    /**
     * {@code POST  /agencies} : Create a new agency.
     *
     * @param agency the agency to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agency, or with status {@code 400 (Bad Request)} if the agency has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Agency> createAgency(@RequestBody Agency agency) throws URISyntaxException {
        LOG.debug("REST request to save Agency : {}", agency);
        if (agency.getId() != null) {
            throw new BadRequestAlertException("A new agency cannot already have an ID", ENTITY_NAME, "idexists");
        }
        agency = agencyRepository.save(agency);
        return ResponseEntity.created(new URI("/api/agencies/" + agency.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, agency.getId().toString()))
            .body(agency);
    }

    /**
     * {@code PUT  /agencies/:id} : Updates an existing agency.
     *
     * @param id the id of the agency to save.
     * @param agency the agency to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agency,
     * or with status {@code 400 (Bad Request)} if the agency is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agency couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Agency> updateAgency(@PathVariable(value = "id", required = false) final Long id, @RequestBody Agency agency)
        throws URISyntaxException {
        LOG.debug("REST request to update Agency : {}, {}", id, agency);
        if (agency.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agency.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        agency = agencyRepository.save(agency);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, agency.getId().toString()))
            .body(agency);
    }

    /**
     * {@code PATCH  /agencies/:id} : Partial updates given fields of an existing agency, field will ignore if it is null
     *
     * @param id the id of the agency to save.
     * @param agency the agency to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agency,
     * or with status {@code 400 (Bad Request)} if the agency is not valid,
     * or with status {@code 404 (Not Found)} if the agency is not found,
     * or with status {@code 500 (Internal Server Error)} if the agency couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Agency> partialUpdateAgency(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Agency agency
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Agency partially : {}, {}", id, agency);
        if (agency.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agency.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agencyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Agency> result = agencyRepository
            .findById(agency.getId())
            .map(existingAgency -> {
                if (agency.getName() != null) {
                    existingAgency.setName(agency.getName());
                }
                if (agency.getEmail() != null) {
                    existingAgency.setEmail(agency.getEmail());
                }
                if (agency.getPhoneNumber() != null) {
                    existingAgency.setPhoneNumber(agency.getPhoneNumber());
                }
                if (agency.getPosition() != null) {
                    existingAgency.setPosition(agency.getPosition());
                }
                if (agency.getCreatedBy() != null) {
                    existingAgency.setCreatedBy(agency.getCreatedBy());
                }
                if (agency.getCreatedDate() != null) {
                    existingAgency.setCreatedDate(agency.getCreatedDate());
                }
                if (agency.getLastModifiedBy() != null) {
                    existingAgency.setLastModifiedBy(agency.getLastModifiedBy());
                }
                if (agency.getLastModifiedDate() != null) {
                    existingAgency.setLastModifiedDate(agency.getLastModifiedDate());
                }

                return existingAgency;
            })
            .map(agencyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, agency.getId().toString())
        );
    }

    /**
     * {@code GET  /agencies} : get all the agencies.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agencies in body.
     */
    @GetMapping("")
    public List<Agency> getAllAgencies(@RequestParam(name = "filter", required = false) String filter) {
        if ("admin-is-null".equals(filter)) {
            LOG.debug("REST request to get all Agencys where admin is null");
            return StreamSupport.stream(agencyRepository.findAll().spliterator(), false)
                .filter(agency -> agency.getAdmin() == null)
                .toList();
        }
        LOG.debug("REST request to get all Agencies");
        return agencyRepository.findAll();
    }

    /**
     * {@code GET  /agencies/:id} : get the "id" agency.
     *
     * @param id the id of the agency to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agency, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Agency> getAgency(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Agency : {}", id);
        Optional<Agency> agency = agencyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(agency);
    }

    /**
     * {@code DELETE  /agencies/:id} : delete the "id" agency.
     *
     * @param id the id of the agency to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgency(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Agency : {}", id);
        agencyRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
