package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AttributeValueAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AttributeValue;
import com.mycompany.myapp.repository.AttributeValueRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link AttributeValueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AttributeValueResourceIT {

    private static final String DEFAULT_VALUE_STRING = "AAAAAAAAAA";
    private static final String UPDATED_VALUE_STRING = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_VALUE_BIG_DECIMAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE_BIG_DECIMAL = new BigDecimal(2);

    private static final Boolean DEFAULT_VALUE_BOOLEAN = false;
    private static final Boolean UPDATED_VALUE_BOOLEAN = true;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_MODIFIED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_MODIFIED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/attribute-values";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AttributeValueRepository attributeValueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAttributeValueMockMvc;

    private AttributeValue attributeValue;

    private AttributeValue insertedAttributeValue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AttributeValue createEntity() {
        return new AttributeValue()
            .valueString(DEFAULT_VALUE_STRING)
            .valueBigDecimal(DEFAULT_VALUE_BIG_DECIMAL)
            .valueBoolean(DEFAULT_VALUE_BOOLEAN)
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
    public static AttributeValue createUpdatedEntity() {
        return new AttributeValue()
            .valueString(UPDATED_VALUE_STRING)
            .valueBigDecimal(UPDATED_VALUE_BIG_DECIMAL)
            .valueBoolean(UPDATED_VALUE_BOOLEAN)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    public void initTest() {
        attributeValue = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAttributeValue != null) {
            attributeValueRepository.delete(insertedAttributeValue);
            insertedAttributeValue = null;
        }
    }

    @Test
    @Transactional
    void createAttributeValue() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AttributeValue
        var returnedAttributeValue = om.readValue(
            restAttributeValueMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attributeValue))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AttributeValue.class
        );

        // Validate the AttributeValue in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAttributeValueUpdatableFieldsEquals(returnedAttributeValue, getPersistedAttributeValue(returnedAttributeValue));

        insertedAttributeValue = returnedAttributeValue;
    }

    @Test
    @Transactional
    void createAttributeValueWithExistingId() throws Exception {
        // Create the AttributeValue with an existing ID
        attributeValue.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttributeValueMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attributeValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAttributeValues() throws Exception {
        // Initialize the database
        insertedAttributeValue = attributeValueRepository.saveAndFlush(attributeValue);

        // Get all the attributeValueList
        restAttributeValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attributeValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].valueString").value(hasItem(DEFAULT_VALUE_STRING)))
            .andExpect(jsonPath("$.[*].valueBigDecimal").value(hasItem(sameNumber(DEFAULT_VALUE_BIG_DECIMAL))))
            .andExpect(jsonPath("$.[*].valueBoolean").value(hasItem(DEFAULT_VALUE_BOOLEAN)))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(sameInstant(DEFAULT_LAST_MODIFIED_DATE))));
    }

    @Test
    @Transactional
    void getAttributeValue() throws Exception {
        // Initialize the database
        insertedAttributeValue = attributeValueRepository.saveAndFlush(attributeValue);

        // Get the attributeValue
        restAttributeValueMockMvc
            .perform(get(ENTITY_API_URL_ID, attributeValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attributeValue.getId().intValue()))
            .andExpect(jsonPath("$.valueString").value(DEFAULT_VALUE_STRING))
            .andExpect(jsonPath("$.valueBigDecimal").value(sameNumber(DEFAULT_VALUE_BIG_DECIMAL)))
            .andExpect(jsonPath("$.valueBoolean").value(DEFAULT_VALUE_BOOLEAN))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(sameInstant(DEFAULT_LAST_MODIFIED_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingAttributeValue() throws Exception {
        // Get the attributeValue
        restAttributeValueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAttributeValue() throws Exception {
        // Initialize the database
        insertedAttributeValue = attributeValueRepository.saveAndFlush(attributeValue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attributeValue
        AttributeValue updatedAttributeValue = attributeValueRepository.findById(attributeValue.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAttributeValue are not directly saved in db
        em.detach(updatedAttributeValue);
        updatedAttributeValue
            .valueString(UPDATED_VALUE_STRING)
            .valueBigDecimal(UPDATED_VALUE_BIG_DECIMAL)
            .valueBoolean(UPDATED_VALUE_BOOLEAN)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAttributeValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAttributeValue.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAttributeValue))
            )
            .andExpect(status().isOk());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAttributeValueToMatchAllProperties(updatedAttributeValue);
    }

    @Test
    @Transactional
    void putNonExistingAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeValue.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attributeValue.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(attributeValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeValue.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(attributeValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeValue.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeValueMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(attributeValue)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAttributeValueWithPatch() throws Exception {
        // Initialize the database
        insertedAttributeValue = attributeValueRepository.saveAndFlush(attributeValue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attributeValue using partial update
        AttributeValue partialUpdatedAttributeValue = new AttributeValue();
        partialUpdatedAttributeValue.setId(attributeValue.getId());

        partialUpdatedAttributeValue.createdBy(UPDATED_CREATED_BY).lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttributeValue.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAttributeValue))
            )
            .andExpect(status().isOk());

        // Validate the AttributeValue in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAttributeValueUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAttributeValue, attributeValue),
            getPersistedAttributeValue(attributeValue)
        );
    }

    @Test
    @Transactional
    void fullUpdateAttributeValueWithPatch() throws Exception {
        // Initialize the database
        insertedAttributeValue = attributeValueRepository.saveAndFlush(attributeValue);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the attributeValue using partial update
        AttributeValue partialUpdatedAttributeValue = new AttributeValue();
        partialUpdatedAttributeValue.setId(attributeValue.getId());

        partialUpdatedAttributeValue
            .valueString(UPDATED_VALUE_STRING)
            .valueBigDecimal(UPDATED_VALUE_BIG_DECIMAL)
            .valueBoolean(UPDATED_VALUE_BOOLEAN)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttributeValue.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAttributeValue))
            )
            .andExpect(status().isOk());

        // Validate the AttributeValue in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAttributeValueUpdatableFieldsEquals(partialUpdatedAttributeValue, getPersistedAttributeValue(partialUpdatedAttributeValue));
    }

    @Test
    @Transactional
    void patchNonExistingAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeValue.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attributeValue.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(attributeValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeValue.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(attributeValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAttributeValue() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        attributeValue.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeValueMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(attributeValue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AttributeValue in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAttributeValue() throws Exception {
        // Initialize the database
        insertedAttributeValue = attributeValueRepository.saveAndFlush(attributeValue);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the attributeValue
        restAttributeValueMockMvc
            .perform(delete(ENTITY_API_URL_ID, attributeValue.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return attributeValueRepository.count();
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

    protected AttributeValue getPersistedAttributeValue(AttributeValue attributeValue) {
        return attributeValueRepository.findById(attributeValue.getId()).orElseThrow();
    }

    protected void assertPersistedAttributeValueToMatchAllProperties(AttributeValue expectedAttributeValue) {
        assertAttributeValueAllPropertiesEquals(expectedAttributeValue, getPersistedAttributeValue(expectedAttributeValue));
    }

    protected void assertPersistedAttributeValueToMatchUpdatableProperties(AttributeValue expectedAttributeValue) {
        assertAttributeValueAllUpdatablePropertiesEquals(expectedAttributeValue, getPersistedAttributeValue(expectedAttributeValue));
    }
}
