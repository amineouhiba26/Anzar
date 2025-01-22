package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CustomConfigurationAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CustomConfiguration;
import com.mycompany.myapp.repository.CustomConfigurationRepository;
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
 * Integration tests for the {@link CustomConfigurationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CustomConfigurationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/custom-configurations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CustomConfigurationRepository customConfigurationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCustomConfigurationMockMvc;

    private CustomConfiguration customConfiguration;

    private CustomConfiguration insertedCustomConfiguration;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CustomConfiguration createEntity() {
        return new CustomConfiguration()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
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
    public static CustomConfiguration createUpdatedEntity() {
        return new CustomConfiguration()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    public void initTest() {
        customConfiguration = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedCustomConfiguration != null) {
            customConfigurationRepository.delete(insertedCustomConfiguration);
            insertedCustomConfiguration = null;
        }
    }

    @Test
    @Transactional
    void createCustomConfiguration() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CustomConfiguration
        var returnedCustomConfiguration = om.readValue(
            restCustomConfigurationMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(customConfiguration))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CustomConfiguration.class
        );

        // Validate the CustomConfiguration in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCustomConfigurationUpdatableFieldsEquals(
            returnedCustomConfiguration,
            getPersistedCustomConfiguration(returnedCustomConfiguration)
        );

        insertedCustomConfiguration = returnedCustomConfiguration;
    }

    @Test
    @Transactional
    void createCustomConfigurationWithExistingId() throws Exception {
        // Create the CustomConfiguration with an existing ID
        customConfiguration.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCustomConfigurationMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCustomConfigurations() throws Exception {
        // Initialize the database
        insertedCustomConfiguration = customConfigurationRepository.saveAndFlush(customConfiguration);

        // Get all the customConfigurationList
        restCustomConfigurationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(customConfiguration.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }

    @Test
    @Transactional
    void getCustomConfiguration() throws Exception {
        // Initialize the database
        insertedCustomConfiguration = customConfigurationRepository.saveAndFlush(customConfiguration);

        // Get the customConfiguration
        restCustomConfigurationMockMvc
            .perform(get(ENTITY_API_URL_ID, customConfiguration.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(customConfiguration.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(sameInstant(DEFAULT_LAST_MODIFIED_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingCustomConfiguration() throws Exception {
        // Get the customConfiguration
        restCustomConfigurationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCustomConfiguration() throws Exception {
        // Initialize the database
        insertedCustomConfiguration = customConfigurationRepository.saveAndFlush(customConfiguration);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the customConfiguration
        CustomConfiguration updatedCustomConfiguration = customConfigurationRepository.findById(customConfiguration.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCustomConfiguration are not directly saved in db
        em.detach(updatedCustomConfiguration);
        updatedCustomConfiguration
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCustomConfigurationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCustomConfiguration.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCustomConfiguration))
            )
            .andExpect(status().isOk());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCustomConfigurationToMatchAllProperties(updatedCustomConfiguration);
    }

    @Test
    @Transactional
    void putNonExistingCustomConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        customConfiguration.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomConfigurationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, customConfiguration.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCustomConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        customConfiguration.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomConfigurationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCustomConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        customConfiguration.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomConfigurationMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCustomConfigurationWithPatch() throws Exception {
        // Initialize the database
        insertedCustomConfiguration = customConfigurationRepository.saveAndFlush(customConfiguration);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the customConfiguration using partial update
        CustomConfiguration partialUpdatedCustomConfiguration = new CustomConfiguration();
        partialUpdatedCustomConfiguration.setId(customConfiguration.getId());

        partialUpdatedCustomConfiguration
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCustomConfigurationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomConfiguration.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCustomConfiguration))
            )
            .andExpect(status().isOk());

        // Validate the CustomConfiguration in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCustomConfigurationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCustomConfiguration, customConfiguration),
            getPersistedCustomConfiguration(customConfiguration)
        );
    }

    @Test
    @Transactional
    void fullUpdateCustomConfigurationWithPatch() throws Exception {
        // Initialize the database
        insertedCustomConfiguration = customConfigurationRepository.saveAndFlush(customConfiguration);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the customConfiguration using partial update
        CustomConfiguration partialUpdatedCustomConfiguration = new CustomConfiguration();
        partialUpdatedCustomConfiguration.setId(customConfiguration.getId());

        partialUpdatedCustomConfiguration
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCustomConfigurationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCustomConfiguration.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCustomConfiguration))
            )
            .andExpect(status().isOk());

        // Validate the CustomConfiguration in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCustomConfigurationUpdatableFieldsEquals(
            partialUpdatedCustomConfiguration,
            getPersistedCustomConfiguration(partialUpdatedCustomConfiguration)
        );
    }

    @Test
    @Transactional
    void patchNonExistingCustomConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        customConfiguration.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCustomConfigurationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, customConfiguration.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCustomConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        customConfiguration.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomConfigurationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isBadRequest());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCustomConfiguration() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        customConfiguration.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCustomConfigurationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(customConfiguration))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CustomConfiguration in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCustomConfiguration() throws Exception {
        // Initialize the database
        insertedCustomConfiguration = customConfigurationRepository.saveAndFlush(customConfiguration);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the customConfiguration
        restCustomConfigurationMockMvc
            .perform(delete(ENTITY_API_URL_ID, customConfiguration.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return customConfigurationRepository.count();
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

    protected CustomConfiguration getPersistedCustomConfiguration(CustomConfiguration customConfiguration) {
        return customConfigurationRepository.findById(customConfiguration.getId()).orElseThrow();
    }

    protected void assertPersistedCustomConfigurationToMatchAllProperties(CustomConfiguration expectedCustomConfiguration) {
        assertCustomConfigurationAllPropertiesEquals(
            expectedCustomConfiguration,
            getPersistedCustomConfiguration(expectedCustomConfiguration)
        );
    }

    protected void assertPersistedCustomConfigurationToMatchUpdatableProperties(CustomConfiguration expectedCustomConfiguration) {
        assertCustomConfigurationAllUpdatablePropertiesEquals(
            expectedCustomConfiguration,
            getPersistedCustomConfiguration(expectedCustomConfiguration)
        );
    }
}
