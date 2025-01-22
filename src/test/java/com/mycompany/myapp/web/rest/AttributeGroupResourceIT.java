package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AttributeGroupAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AttributeGroup;
import com.mycompany.myapp.repository.AttributeGroupRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AttributeGroupResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AttributeGroupResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/attribute-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AttributeGroupRepository attributeGroupRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAttributeGroupMockMvc;

    private AttributeGroup attributeGroup;

    private AttributeGroup insertedAttributeGroup;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttributeGroup createEntity() {
        return new AttributeGroup()
            .name(DEFAULT_NAME)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttributeGroup createUpdatedEntity() {
        return new AttributeGroup()
            .name(UPDATED_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    public void initTest() {
        attributeGroup = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAttributeGroup != null) {
            attributeGroupRepository.delete(insertedAttributeGroup);
            insertedAttributeGroup = null;
        }
    }

    @Test
    @Transactional
    void createAttributeGroup() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AttributeGroup
        var returnedAttributeGroup = om.readValue(
            restAttributeGroupMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attributeGroup))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AttributeGroup.class
        );

        // Validate the AttributeGroup in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAttributeGroupUpdatableFieldsEquals(returnedAttributeGroup, getPersistedAttributeGroup(returnedAttributeGroup));

        insertedAttributeGroup = returnedAttributeGroup;
    }

    @Test
    @Transactional
    void createAttributeGroupWithExistingId() throws Exception {
        // Create the AttributeGroup with an existing ID
        attributeGroup.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttributeGroupMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attributeGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAttributeGroups() throws Exception {
        // Initialize the database
        insertedAttributeGroup = attributeGroupRepository.saveAndFlush(attributeGroup);

        // Get all the attributeGroupList
        restAttributeGroupMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attributeGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }

    @Test
    @Transactional
    void getAttributeGroup() throws Exception {
        // Initialize the database
        insertedAttributeGroup = attributeGroupRepository.saveAndFlush(attributeGroup);

        // Get the attributeGroup
        restAttributeGroupMockMvc
            .perform(get(ENTITY_API_URL_ID, attributeGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attributeGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(sameInstant(DEFAULT_LAST_MODIFIED_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingAttributeGroup() throws Exception {
        // Get the attributeGroup
        restAttributeGroupMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAttributeGroup() throws Exception {
        // Initialize the database
        insertedAttributeGroup = attributeGroupRepository.saveAndFlush(attributeGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attributeGroup
        AttributeGroup updatedAttributeGroup = attributeGroupRepository.findById(attributeGroup.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAttributeGroup are not directly saved in db
        em.detach(updatedAttributeGroup);
        updatedAttributeGroup
            .name(UPDATED_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAttributeGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAttributeGroup.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAttributeGroup))
            )
            .andExpect(status().isOk());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAttributeGroupToMatchAllProperties(updatedAttributeGroup);
    }

    @Test
    @Transactional
    void putNonExistingAttributeGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeGroup.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attributeGroup.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(attributeGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAttributeGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeGroupMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(attributeGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAttributeGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeGroupMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attributeGroup)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAttributeGroupWithPatch() throws Exception {
        // Initialize the database
        insertedAttributeGroup = attributeGroupRepository.saveAndFlush(attributeGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attributeGroup using partial update
        AttributeGroup partialUpdatedAttributeGroup = new AttributeGroup();
        partialUpdatedAttributeGroup.setId(attributeGroup.getId());

        partialUpdatedAttributeGroup.name(UPDATED_NAME).createdDate(UPDATED_CREATED_DATE).lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restAttributeGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttributeGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAttributeGroup))
            )
            .andExpect(status().isOk());

        // Validate the AttributeGroup in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAttributeGroupUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAttributeGroup, attributeGroup),
            getPersistedAttributeGroup(attributeGroup)
        );
    }

    @Test
    @Transactional
    void fullUpdateAttributeGroupWithPatch() throws Exception {
        // Initialize the database
        insertedAttributeGroup = attributeGroupRepository.saveAndFlush(attributeGroup);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attributeGroup using partial update
        AttributeGroup partialUpdatedAttributeGroup = new AttributeGroup();
        partialUpdatedAttributeGroup.setId(attributeGroup.getId());

        partialUpdatedAttributeGroup
            .name(UPDATED_NAME)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAttributeGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttributeGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAttributeGroup))
            )
            .andExpect(status().isOk());

        // Validate the AttributeGroup in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAttributeGroupUpdatableFieldsEquals(partialUpdatedAttributeGroup, getPersistedAttributeGroup(partialUpdatedAttributeGroup));
    }

    @Test
    @Transactional
    void patchNonExistingAttributeGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeGroup.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attributeGroup.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(attributeGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAttributeGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeGroupMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(attributeGroup))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAttributeGroup() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeGroup.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeGroupMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(attributeGroup))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttributeGroup in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAttributeGroup() throws Exception {
        // Initialize the database
        insertedAttributeGroup = attributeGroupRepository.saveAndFlush(attributeGroup);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the attributeGroup
        restAttributeGroupMockMvc
            .perform(delete(ENTITY_API_URL_ID, attributeGroup.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return attributeGroupRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected AttributeGroup getPersistedAttributeGroup(AttributeGroup attributeGroup) {
        return attributeGroupRepository.findById(attributeGroup.getId()).orElseThrow();
    }

    protected void assertPersistedAttributeGroupToMatchAllProperties(AttributeGroup expectedAttributeGroup) {
        assertAttributeGroupAllPropertiesEquals(expectedAttributeGroup, getPersistedAttributeGroup(expectedAttributeGroup));
    }

    protected void assertPersistedAttributeGroupToMatchUpdatableProperties(AttributeGroup expectedAttributeGroup) {
        assertAttributeGroupAllUpdatablePropertiesEquals(expectedAttributeGroup, getPersistedAttributeGroup(expectedAttributeGroup));
    }
}
